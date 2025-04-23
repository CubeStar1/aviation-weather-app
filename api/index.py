from flask import Flask, jsonify, request

# Import functions from the routes modules
# Using absolute import from the 'api' package perspective
# This assumes the Flask app is run with the parent directory in PYTHONPATH
# or using 'flask run' from the parent directory after setting FLASK_APP=api.index
try:
    from api.routes.metar import get_metar_summary
    from api.routes.pirep import get_pirep_summary
    from api.routes.sigmet import get_airsigmet_summary
    from api.routes.flight_path import get_flight_path_weather
except ImportError:

    print("Attempting relative imports for routes...")
    from routes.metar import get_metar_summary
    from routes.pirep import get_pirep_summary
    from routes.sigmet import get_airsigmet_summary
    from routes.flight_path import get_flight_path_weather

app = Flask(__name__)


@app.route("/api/metar", methods=['POST'])
def metar_route():
    """Endpoint to get METAR summary for a list of airport IDs."""
    data = request.get_json()
    if not data or 'ids' not in data or not isinstance(data['ids'], list):
        return jsonify({"error": "Invalid request. Body must be JSON with an 'ids' list."}), 400
    
    airport_ids = data['ids']
    # Get optional altitudes dictionary
    altitudes = data.get('altitudes') 
    
    # Optional: Add validation for altitudes if present
    if altitudes is not None:
        if not isinstance(altitudes, dict):
             return jsonify({"error": "Invalid request. 'altitudes' must be an object/dictionary."}), 400
        # Further validation could check if keys are in ids and values are numbers
        # for airport_id, alt in altitudes.items():
        #     if airport_id not in airport_ids:
        #         # Handle mismatch or ignore?
        #         pass 
        #     try:
        #         int(alt)
        #     except (ValueError, TypeError):
        #          return jsonify({"error": f"Invalid altitude '{alt}' for {airport_id}. Must be integer."}), 400

    try:
        # Pass altitudes dictionary to the summary function
        metar_data = get_metar_summary(airport_ids, altitudes)
        return jsonify(metar_data)
    except Exception as e:
        print(f"Error in /api/metar route: {e}")
        return jsonify({"error": "An internal error occurred processing METAR request."}), 500

@app.route("/api/pirep", methods=['POST'])
def pirep_route():
    """Endpoint to get PIREP summary for a list of location IDs."""
    data = request.get_json()
    if not data or 'ids' not in data or not isinstance(data['ids'], list):
        return jsonify({"error": "Invalid request. Body must be JSON with an 'ids' list."}), 400
    
    location_ids = data['ids']
    try:
        pirep_data = get_pirep_summary(location_ids)
        # Use default=str for potential non-serializable types from avwx within PIREP data
        return jsonify(pirep_data)
    except Exception as e:
        print(f"Error in /api/pirep route: {e}")
        return jsonify({"error": "An internal error occurred processing PIREP request."}), 500

@app.route("/api/airsigmet", methods=['GET'])
def airsigmet_route():
    """Endpoint to get AIRMET/SIGMET data based on altitude and optional hazard."""
    altitude = request.args.get('altitude')
    hazard = request.args.get('hazard', default="ALL", type=str)

    if altitude is None:
        return jsonify({"error": "Missing required query parameter: altitude (in feet)"}), 400

    try:
        # Validate altitude format within the route handler too
        altitude_ft = int(altitude)
    except ValueError:
         return jsonify({"error": "Invalid altitude format. Must be an integer."}), 400

    try:
        airsigmet_data = get_airsigmet_summary(altitude_ft, hazard)
        return jsonify(airsigmet_data)
    except Exception as e:
        print(f"Error in /api/airsigmet route: {e}")
        return jsonify({"error": "An internal error occurred processing AIRMET/SIGMET request."}), 500

@app.route("/api/flight_briefing", methods=['POST'])
def flight_briefing_route():
    """Endpoint to get a comprehensive weather briefing for a flight plan."""
    data = request.get_json()
    if not data or 'plan' not in data:
        return jsonify({"error": "Invalid request. Body must be JSON with a 'plan' string."}), 400

    plan_string = data['plan']
    if not isinstance(plan_string, str) or not plan_string:
         return jsonify({"error": "Invalid 'plan' format. Must be a non-empty string."}), 400

    try:
        briefing_data = get_flight_path_weather(plan_string)
        
        # Check if the core function caught parsing/validation errors
        if briefing_data.get("errors"):
            # Return 400 if errors occurred during parsing/setup phase
            return jsonify(briefing_data), 400
            
        # Use default=str for potential non-serializable types if successful
        return jsonify(briefing_data)
        
    except Exception as e:
        # Catch broader unexpected errors during the whole process
        print(f"Error in /api/flight_briefing route: {e}")
        return jsonify({"error": "An internal error occurred processing flight briefing request."}), 500

# Add a simple root route for testing if the server is up
@app.route("/")
def index():
    return jsonify({"message": "Aviation Weather API is running."}) 

# Optional: Add for running directly (python api/index.py) for development
# if __name__ == '__main__':
#     app.run(debug=True) # Turn off debug in production