import requests
from avwx import Pireps
from collections import defaultdict
import json

# Import the utility function
from ..utils import get_utc_time_for_api

# Assuming UTC.py provides a function to get the current UTC time string
# Reuse the placeholder from metar.py or implement proper import
# from ..scripts.UTC import utc # Potential relative import

# Placeholder UTC function (replace with actual logic from UTC.py)
# def get_current_utc_time_string(report_type="Pirep"):
#     from datetime import datetime, timezone
#     now_utc = datetime.now(timezone.utc)
#     # Adjust format if needed based on the PIREP API requirements
#     return now_utc.strftime("%Y-%m-%dT%H:%M:%SZ")

def get_pirep_summary(location_ids):
    """
    Fetches and summarizes PIREP data near a list of location IDs.
    Returns a dictionary with location IDs as keys and their PIREP data.
    """
    pirep_data = {}
    if not isinstance(location_ids, list):
        raise TypeError("location_ids must be a list")

    for location_id in location_ids:
        pireps_for_location = {}
        summary_counters = defaultdict(int)
        # Get the time string, although it's not currently used in the URL
        # time_str = get_utc_time_for_api("Pirep") # Or potentially "Metar" if PIREPs used same logic
        # The original script had hardcoded distance, level, inten parameters.
        # These could be made configurable via API parameters if needed.
        # Using age=1 (hours), distance=100 (NM seems reasonable default), format=raw
        url = f"https://aviationweather.gov/api/data/pirep?id={location_id}&format=raw&age=1&distance=100"
        # Removed date={time_str} as 'age' parameter is usually sufficient for recent reports
        # If date parameter were needed, it would be added here: &date={time_str}
        # Removed hardcoded level and inten filters for broader results, can be added back if needed

        try:
            response = requests.get(url)
            response.raise_for_status()
            raw_pirep_text = response.text.strip()

            if not raw_pirep_text or "No PIREPs" in raw_pirep_text:
                 pireps_for_location["status"] = f"{location_id}: No recent PIREPs found within parameters."
                 pireps_for_location["reports"] = []

            else:
                pirep_lines = raw_pirep_text.split('\n')
                parsed_reports = []
                report_counter = 0
                parser = Pireps(location_id) # Reuse parser instance

                for line in pirep_lines:
                    # Basic filter from original script, might need refinement
                    if "TOP" in line and "T" in line:
                        continue
                    if parser.parse(line): # parse returns True on success
                        # AVWX returns a list, usually with one PIREP per parse call
                        if parser.data:
                            report_counter += 1
                            # Store the structured data from the parser
                            parsed_report_data = parser.data[0].__dict__ # Convert dataclass to dict
                            parsed_reports.append(parsed_report_data)

                            # Update summary counts based on the parsed data
                            if parsed_report_data.get('clouds') is not None:
                                summary_counters['clouds'] += 1
                            if parsed_report_data.get('flight_visibility') is not None:
                                summary_counters['flight_visibility'] += 1
                            if parsed_report_data.get('icing') is not None:
                                summary_counters['icing'] += 1
                            if parsed_report_data.get('turbulence') is not None:
                                summary_counters['turbulence'] += 1
                        else:
                             print(f"Warning: PIREP parser succeeded but produced no data for line: {line}")
                    # else:
                    #     print(f"Warning: Could not parse PIREP line for {location_id}: {line}")


                # Generate summary string
                if summary_counters:
                     summary_str = f"{location_id}: Reports found with " + ", ".join(f"{k}={v}" for k, v in summary_counters.items())
                else:
                     summary_str = f"{location_id}: Parsed {report_counter} PIREP(s), no specific conditions counted."

                pireps_for_location["status"] = summary_str
                pireps_for_location["reports"] = parsed_reports # List of dicts

        except requests.exceptions.RequestException as e:
            print(f"Error fetching PIREPs for {location_id}: {e}")
            pireps_for_location["status"] = f"{location_id}: Error fetching data."
            pireps_for_location["reports"] = []
            pireps_for_location["error"] = str(e)
        except Exception as e:
             print(f"Error processing PIREPs for {location_id}: {e}")
             pireps_for_location["status"] = f"{location_id}: Error processing data."
             pireps_for_location["reports"] = []
             pireps_for_location["error"] = str(e)


        pirep_data[location_id] = pireps_for_location

    return pirep_data

# Example usage (optional, for testing)
# if __name__ == '__main__':
#     test_ids = ['KDEN', 'KBOS']
#     summary = get_pirep_summary(test_ids)
#     # Use default=str because AVWX objects might not be directly JSON serializable
#     print(json.dumps(summary, indent=2, default=str)) 