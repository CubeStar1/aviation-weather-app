import re
import requests
import json
from flask import jsonify, request
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
from shapely.geometry import LineString, Polygon, Point
from shapely.errors import GEOSException
import time

# Import functions from other route modules
# Assuming they are in the same directory
from .metar import get_metar_summary
from .pirep import get_pirep_summary
from .sigmet import get_airsigmet_summary

# Initialize geocoder (consider adding a unique user_agent)
geolocator = Nominatim(user_agent="aviation-weather-app/1.0")

# Simple cache for coordinates to avoid repeated lookups
coordinate_cache = {}

def get_coordinates(identifier):
    """Gets coordinates for an identifier (e.g., airport code) using geopy with caching."""
    if identifier in coordinate_cache:
        return coordinate_cache[identifier]

    try:
        # Add " airport" to potentially improve geocoding accuracy for ICAO codes
        location = geolocator.geocode(f"{identifier} airport", timeout=10)
        if location:
            coords = (location.latitude, location.longitude)
            coordinate_cache[identifier] = coords
            return coords
        else:
            # Try without " airport" as fallback
            location = geolocator.geocode(identifier, timeout=10)
            if location:
                coords = (location.latitude, location.longitude)
                coordinate_cache[identifier] = coords
                return coords
            else:
                print(f"Warning: Could not geocode identifier: {identifier}")
                coordinate_cache[identifier] = None # Cache failure
                return None
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        print(f"Error geocoding {identifier}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error during geocoding for {identifier}: {e}")
        return None

def parse_flight_plan(plan_string):
    """Parses a flight plan string (ID1,ALT1,ID2,ALT2,...) into a list of waypoint dicts."""
    parts = [p.strip() for p in plan_string.split(',')]
    if len(parts) < 2 or len(parts) % 2 != 0:
        raise ValueError("Invalid flight plan format. Expected 'ID1,ALT1,ID2,ALT2,...'")

    waypoints = []
    max_altitude = 0
    for i in range(0, len(parts), 2):
        identifier = parts[i].upper()
        try:
            altitude = int(parts[i+1])
            if altitude > max_altitude:
                max_altitude = altitude
        except ValueError:
            raise ValueError(f"Invalid altitude '{parts[i+1]}' for waypoint {identifier}.")

        coords = get_coordinates(identifier)
        # if coords is None:
            # Optionally raise an error here if coordinates are essential
            # print(f"Warning: Skipping waypoint {identifier} due to missing coordinates.")
            # continue

        waypoints.append({
            "id": identifier,
            "alt_ft": altitude,
            "coords": coords # Coords can be None if geocoding failed
        })

    if len(waypoints) < 2:
        raise ValueError("Flight plan requires at least two valid waypoints with coordinates.")

    return waypoints, max_altitude

def check_sigmet_intersections(leg_start_coords, leg_end_coords, sigmets):
    """Checks if a flight leg intersects with any SIGMET polygons."""
    intersecting_sigmets = []
    if not leg_start_coords or not leg_end_coords:
        return intersecting_sigmets # Cannot check intersection without coordinates

    try:
        # Shapely uses (lon, lat)
        flight_leg = LineString([
            (leg_start_coords[1], leg_start_coords[0]),
            (leg_end_coords[1], leg_end_coords[0])
        ])
    except Exception as e:
         print(f"Error creating flight leg LineString: {e}")
         return {"error": "Failed to create flight leg geometry"}


    for sigmet in sigmets:
        # Ensure the sigmet has coordinate data in the expected format
        # The aviationweather.gov API returns area geometry in sigmet['area']
        if not sigmet or 'area' not in sigmet or not isinstance(sigmet['area'], list):
            continue

        # Extract coordinates - assuming format [{lat: y1, lon: x1}, {lat: y2, lon: x2}, ...]
        # Sometimes it might be under a different key or structure, adjust as needed.
        sigmet_coords_list = sigmet['area']
        shapely_coords = [(point.get('lon'), point.get('lat')) for point in sigmet_coords_list if point.get('lon') is not None and point.get('lat') is not None]

        if len(shapely_coords) < 3:
            # print(f"Warning: Insufficient valid coordinates for SIGMET polygon {sigmet.get('airSigmetId')}")
            continue # Need at least 3 points for a polygon

        try:
            sigmet_polygon = Polygon(shapely_coords)
            if not sigmet_polygon.is_valid:
                 # Attempt to buffer by 0 to fix potential self-intersection issues
                 sigmet_polygon = sigmet_polygon.buffer(0)
                 if not sigmet_polygon.is_valid:
                     print(f"Warning: Invalid SIGMET polygon geometry for {sigmet.get('airSigmetId')}, skipping intersection check.")
                     continue

            if flight_leg.intersects(sigmet_polygon):
                intersecting_sigmets.append({
                    "airSigmetId": sigmet.get('airSigmetId'),
                    "hazard": sigmet.get('hazard'),
                    "severity": sigmet.get('severity'),
                    "simplified_summary": sigmet.get('simplified_summary')
                })

        except (GEOSException, ValueError, TypeError) as e:
            print(f"Error processing SIGMET geometry {sigmet.get('airSigmetId')}: {e}")
        except Exception as e:
            print(f"Unexpected error during intersection check for SIGMET {sigmet.get('airSigmetId')}: {e}")

    return intersecting_sigmets

def get_flight_path_weather(plan_string):
    """Main function to get weather briefing for a flight plan string."""
    results = {
        "flight_plan": plan_string,
        "waypoints": [],
        "legs": [],
        "metar": {},
        "pireps": {},
        "airsigmets": [],
        "errors": [],
        "warnings": []
    }

    try:
        waypoints, max_altitude = parse_flight_plan(plan_string)
        results["waypoints"] = waypoints
    except ValueError as e:
        results["errors"].append(f"Flight Plan Parsing Error: {e}")
        return results # Cannot proceed without a valid plan
    except Exception as e:
         results["errors"].append(f"Unexpected Flight Plan Parsing Error: {e}")
         return results

    waypoint_ids = [wp["id"] for wp in waypoints]

    # Fetch METAR data
    try:
        # Create the altitudes dictionary needed by get_metar_summary
        altitudes_dict = {wp['id']: wp['alt_ft'] for wp in waypoints if wp.get('id') and wp.get('alt_ft') is not None}
        # Pass the altitudes dictionary for VFR checks
        metar_data = get_metar_summary(waypoint_ids, altitudes_dict)
        results["metar"] = metar_data
        # Check for errors in METAR data
        for wp_id, data in metar_data.items():
             if data.get("error"):
                 results["warnings"].append(f"METAR fetch/parse failed for {wp_id}: {data['error']}")
    except Exception as e:
        results["errors"].append(f"Failed to fetch METAR data: {e}")

    # Fetch PIREP data
    try:
        pirep_data = get_pirep_summary(waypoint_ids)
        results["pireps"] = pirep_data
         # Check for errors in PIREP data
        for wp_id, data in pirep_data.items():
             if data.get("error"):
                 results["warnings"].append(f"PIREP fetch/parse failed for {wp_id}: {data['error']}")
    except Exception as e:
        results["errors"].append(f"Failed to fetch PIREP data: {e}")

    # Fetch AIRMET/SIGMET data (using max altitude for now)
    # Consider refining this: maybe fetch for a range or per leg altitude
    try:
        # Using max_altitude, fetch ALL hazards initially
        airsigmet_data = get_airsigmet_summary(max_altitude, hazard="ALL")
        if isinstance(airsigmet_data, list):
            results["airsigmets"] = airsigmet_data
        elif isinstance(airsigmet_data, dict) and 'error' in airsigmet_data:
            results["errors"].append(f"Failed to fetch AIRMET/SIGMET data: {airsigmet_data['error']}")
            airsigmet_data = [] # Ensure it's a list for intersection check
        else:
             results["warnings"].append("Received unexpected format for AIRMET/SIGMET data.")
             airsigmet_data = []

    except Exception as e:
        results["errors"].append(f"Failed to fetch AIRMET/SIGMET data: {e}")
        airsigmet_data = [] # Ensure it's a list

    # Check intersections for each leg
    for i in range(len(waypoints) - 1):
        wp1 = waypoints[i]
        wp2 = waypoints[i+1]
        leg_info = {
            "from": wp1["id"],
            "to": wp2["id"],
            "intersecting_sigmets": []
        }
        if wp1["coords"] and wp2["coords"]:
            intersections = check_sigmet_intersections(wp1["coords"], wp2["coords"], airsigmet_data)
            if isinstance(intersections, dict) and 'error' in intersections:
                 results["warnings"].append(f"SIGMET intersection check failed for leg {wp1['id']}-{wp2['id']}: {intersections['error']}")
            else:
                leg_info["intersecting_sigmets"] = intersections
        else:
            results["warnings"].append(f"Skipping SIGMET intersection check for leg {wp1['id']}-{wp2['id']} due to missing coordinates.")

        results["legs"].append(leg_info)

    # Add coordinate warnings if any waypoint failed geocoding
    for wp in waypoints:
        if wp["coords"] is None:
             results["warnings"].append(f"Could not determine coordinates for waypoint {wp['id']}. Some analysis may be incomplete.")

    return results

# Example usage (within Flask context)
# @app.route('/api/flight_path_weather', methods=['POST'])
# def flight_path_weather_route():
#     data = request.get_json()
#     if not data or 'plan' not in data:
#         return jsonify({"error": "Missing 'plan' in request body"}), 400
#     plan_string = data['plan']
#     weather_data = get_flight_path_weather(plan_string)
#     return jsonify(weather_data)

# Example for direct testing
# if __name__ == '__main__':
#      test_plan = "KDEN,10000,KORD,15000,KBOS,20000"
#      # test_plan = "KSFO,5000,KLAX,10000" # Another example
#      # test_plan = "KPHX,1500,KBXK,12000,KPSP,20000,KLAX,50" # README example
#      print(f"Fetching weather for flight plan: {test_plan}")
#      briefing = get_flight_path_weather(test_plan)
#      print(json.dumps(briefing, indent=2, default=str)) 