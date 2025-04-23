from datetime import datetime, timedelta, timezone

def get_utc_time_for_api(report_type):
    """
    Generates a UTC timestamp string formatted for the aviationweather.gov API,
    matching the logic from the original UTC.py script.

    Args:
        report_type (str): The type of report ('Metar', 'Sigmet', etc.) 
                           to determine specific time adjustments if needed.

    Returns:
        str: Formatted UTC timestamp string (e.g., YYYYMMDD_HHMMZ).
    """
    now_utc = datetime.now(timezone.utc)
    
    # The original script had specific logic for METAR time, potentially
    # fetching reports valid around T-1 hour, 54th minute.
    if report_type.lower() == "metar":
        # Go back one hour and set minute to 54
        adjusted_time = (now_utc - timedelta(hours=1)).replace(minute=54, second=0, microsecond=0)
        formatted_time = adjusted_time.strftime("%Y%m%d_%H%M") + "Z" # Add Z for UTC
        return formatted_time
    elif report_type.lower() == "sigmet":  
        # Original SIGMET logic just used current time
        # The API might also accept ISO format, but sticking to original
        formatted_time = now_utc.strftime("%Y%m%d_%H%M") + "Z"
        return formatted_time
    else:
        # Default for other types (like PIREP if date is used, though current pirep route uses 'age')
        # Using current time as default
        formatted_time = now_utc.strftime("%Y%m%d_%H%M") + "Z"
        return formatted_time

# Example usage:
# if __name__ == '__main__':
#     print("METAR time:", get_utc_time_for_api("Metar"))
#     print("SIGMET time:", get_utc_time_for_api("Sigmet"))
#     print("Other time:", get_utc_time_for_api("Pirep")) 