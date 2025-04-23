import requests
import re
from avwx import Metar
from flask import jsonify
import json
import logging 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

from ..utils import get_utc_time_for_api


def get_raw_metar(airport_id):
    """Fetches the full METAR JSON object for a single airport ID."""
    time_str = get_utc_time_for_api("Metar")
    try:
        # Note: The original URL included specific bbox and hours=1. Retaining hours=1.
        # Consider making 'hours' a parameter if needed.
        # Using the time format from the utility function
        url = f"https://aviationweather.gov/api/data/metar?ids={airport_id}&format=json&hours=1&date={time_str}"
        logger.info(f"Requesting METAR from: {url}") # Log URL
        response = requests.get(url)
        response.raise_for_status() # Raises an exception for bad status codes
        data = response.json()
        logger.info(f"Received METAR JSON for {airport_id}: {json.dumps(data)}") # Log full JSON response
        if data and isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
            return data[0] 
        else:
            logger.warning(f"Unexpected METAR response format or empty data for {airport_id}: {data}")
            return None 
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching METAR for {airport_id}: {e}")
        return None
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON response for {airport_id}: {e}")
        return None

def get_metar_summary(airport_ids, altitudes=None):
    """
    Fetches and summarizes METAR data, including VFR allowance check.
    Accepts an optional altitudes dictionary {airport_id: altitude_ft}.
    """
    metar_data = {}
    if not isinstance(airport_ids, list):
        raise TypeError("airport_ids must be a list")
    
    # Ensure altitudes is a dict if provided, otherwise default to empty
    altitudes = altitudes or {}

    for airport_id in airport_ids:
        raw_api_response = get_raw_metar(airport_id)
        
        if raw_api_response and isinstance(raw_api_response, dict):
            raw_metar_string = raw_api_response.get("rawOb")
            receipt_time = raw_api_response.get("receiptTime")
            station_name = raw_api_response.get("name", airport_id) # Use ID as fallback if name missing
            
            if not raw_metar_string:
                logger.warning(f"Missing 'rawOb' in API response for {airport_id}")
                metar_data[airport_id] = {"error": "Missing raw METAR string in API response", "api_response": raw_api_response}
                continue 

            logger.info(f"Processing METAR for {airport_id}: {raw_metar_string}")
            try:
                parser = Metar(airport_id)
                if parser.parse(raw_metar_string):
                    summary_parts = parser.summary.split(",")[:5]
                    general_summary = ', '.join(summary_parts)
                    cloud_translation = parser.translations.clouds if parser.translations else None
                    remarks_translation_dict = parser.translations.remarks if parser.translations else {}
                    filtered_remarks_list = list({k: v for k, v in remarks_translation_dict.items() if not re.fullmatch(r'T\d{8}', k)}.values())

                    # VFR Check
                    vfr_check_result = None
                    airport_alt = altitudes.get(airport_id)
                    if airport_alt is not None:
                        # Extract info needed for VFR check
                        visibility = extract_visibility_sm(general_summary)
                        # cloud_translation string might be like "Broken clouds at 3000ft"
                        vfr_check_result = is_vfr_allowed(visibility, cloud_translation, airport_alt)
                    else:
                        logger.info(f"Skipping VFR check for {airport_id}: Altitude not provided.")

                    metar_data[airport_id] = {
                        "raw": raw_metar_string, 
                        "general": general_summary,
                        "cloud": cloud_translation,
                        "remarks": filtered_remarks_list,
                        "receipt_time": receipt_time, 
                        "station_name": station_name, 
                        "vfr_allowed": vfr_check_result, # Added VFR check result (True/False/None)
                        "api_response": raw_api_response 
                    }
                else:
                     logger.warning(f"Could not parse METAR for {airport_id}: {raw_metar_string}")
                     metar_data[airport_id] = {"error": "Could not parse METAR data", "raw": raw_metar_string, "api_response": raw_api_response}

            except Exception as e:
                logger.error(f"Error processing METAR for {airport_id}: {e}", exc_info=True)
                metar_data[airport_id] = {"error": f"Processing failed: {e}", "raw": raw_metar_string, "api_response": raw_api_response}
        else:
            logger.warning(f"Failed to fetch METAR data dictionary for {airport_id}")
            metar_data[airport_id] = {"error": "Failed to fetch METAR data"}

    return metar_data

# --- VFR Check Logic (adapted from VFR.py) ---

def extract_visibility_sm(general_string):
    """Extracts visibility in SM from the general summary string."""
    visibility = None
    if not general_string:
        return None
    for part in general_string.split(','):
        part = part.strip()
        if part.startswith("Vis"): # Example: "Vis 10sm"
            try:
                # Extract numeric part after "Vis" and before "sm"
                vis_part = part.split("Vis")[1].strip()
                if vis_part.lower().endswith("sm"):
                     vis_part = vis_part[:-2].strip()
                # Handle fractions like 1/2sm (though avwx summary usually converts)
                if '/' in vis_part:
                    num, den = map(float, vis_part.split('/'))
                    visibility = num / den
                else:
                    visibility = float(vis_part)
                break # Found visibility
            except (ValueError, IndexError, ZeroDivisionError):
                logger.warning(f"Could not parse visibility from part: '{part}'")
                visibility = None
    return visibility

def is_vfr_allowed(visibility, cloud_cover_string, altitude):
    """Determines if VFR is allowed based on simplified rules from VFR.py."""
    # Ensure altitude is numeric
    try:
        altitude = int(altitude)
    except (ValueError, TypeError):
        logger.warning(f"Invalid altitude for VFR check: {altitude}")
        return False # Cannot check without valid altitude

    # Check visibility first
    if visibility is None or visibility < 3.0:
        # logger.info(f"VFR Check: Visibility {visibility} < 3.0")
        return False
    
    # Check altitude ceiling (Class A airspace)
    if altitude > 17999: # Class A starts at 18000
        # logger.info(f"VFR Check: Altitude {altitude} > 17999")
        return False

    # Handle cloud cover
    if cloud_cover_string is None or "clear" in cloud_cover_string.lower():
        # logger.info(f"VFR Check: Clouds Clear or None")
        return True # Clear skies allow VFR

    # Check cloud bases against altitude
    # Original regex: r'at (\d+)ft' - assumes format like "Broken clouds at 3000ft"
    try:
        cloud_layers = re.findall(r'at (\d+)ft', cloud_cover_string)
        cloud_bases_agl = [int(height) for height in cloud_layers]
    except Exception as e:
        logger.warning(f"Could not parse cloud bases from string '{cloud_cover_string}': {e}")
        return False # Cannot determine cloud clearance

    if not cloud_bases_agl: # No specific layers found (e.g., only 'Overcast')
        # Could potentially treat 'Overcast' without altitude as a low ceiling, but 
        # AVWX translation usually includes height if available. If no height, assume problematic.
        # However, the original script didn't explicitly handle this case. Let's assume 
        # if no specific 'at x ft' found, we can't determine clearance reliably.
        # A simple 'Overcast' might imply a ceiling below typical VFR minima near clouds.
        # For now, if specific layers aren't found, let's be conservative.
        # But if vis > 3, maybe it's MVFR/IFR due to ceiling, but VFR isn't strictly disallowed based *only* on altitude yet?
        # Let's rethink: VFR requires staying clear of clouds (e.g., 1000ft below).
        # If we have clouds but *no* reported base, we can't guarantee clearance.
        # Let's return False if clouds exist but base cannot be determined.
        if "clouds" in cloud_cover_string.lower() or "overcast" in cloud_cover_string.lower():
             logger.info(f"VFR Check: Clouds present but base undetermined from '{cloud_cover_string}'")
             return False 
        else: # Should ideally not happen if clouds are None/clear already handled
             return True

    # Check if altitude is too close to the clouds
    # VFR requires 1000ft below clouds
    for base in cloud_bases_agl:
        if altitude >= base - 1000:
            # logger.info(f"VFR Check: Altitude {altitude} >= base {base} - 1000")
            return False
    
    # logger.info(f"VFR Check: Passed all checks")
    return True
