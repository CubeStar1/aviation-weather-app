# Aviation Weather

## Problem statement:

Pilots must gather and analyze extensive weather data before a flight, which is a time-consuming
and complex process due to the sheer volume and coded nature of the information. This high
workload can overwhelm the flight crew, leading to the risk of ignoring critical reports altogether.

## Desired Solution:

Develop a solution that provides a summary and detailed weather briefing for a flight plan
Input: A flight plan – list of airport and waypoints along with the altitude.
 Format: Airport ID, Altitude, Airport ID, Altitude, Airport ID, Altitude, etc.
Example: KPHX,1500,KBXK,12000,KPSP,20000,KLAX,50
Note: Airport ID is the standard ICAO ID, Altitude is in feet

Output:

- Textual Weather briefing for the entire flight plan [Summary and Detailed Textual Output].
- Should include at least the following reports: METAR, TAF, PIREP, SIGMET.
- All weather data should be real-time
- No database or canned files
- DECODING REPORTS

## Tech Stack:

- NextJS
- TailwindCSS
- Shadcn UI
- Flask API

## SOLUTION FEATURES    

- Capability to query weather summary for a single waypoint or a flight leg
- Capability to query a detailed weather report for a waypoint or the entire flight plan
- Stretch goals for extra points:
  - In addition to a textual summary, provide a graphical overlay of the weather classification/
    summary on the US map.
  - Analyze weather reports and provide a classification of the weather activity for each
    waypoint and each flight leg
  - VFR Conditions (no weather activity)
  - Significant Weather Activity


