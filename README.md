# Data Visualization

*Author: Marco Scanu*

## Overview
The aim is to build a narrative tool that tells the story of a sea cruise using the data collected during the cruise. <br>
The challenge is trying to do something that is aesthetically pleasing and strives toward the goal of unfolding a narrative story through the data.
Right now, the project has been realized using a mockup dataset, because the system for collecting data from the ship is not yet live and running. 

***Data***: a csv file containing time series data for the provided variables. Have a look into the *"dati"* directory for a more detailed description.

***Vis scope***: time series.

## User manual
So that everything work correctly, the project must be executed on a localhost server. <br>
It can be done in this way: <br>
First, go to the directory where the files are located. <br>
Secondly, either on the *linux command line* or on the *Windows PowerShell*, you need to write:
	
	python3 -m http.server

Now in your browser, go to *localhost:3000* (or *:8000* or whatever is shown on the commandline). 

This project is meant to be visualized in a full screen mode with resolution 1920x1080 pixel. So, in order to visualize it properly, the browser must be setted in its full screen mode.

## Future development
Optional integration with additional external data. <br>
For example:
- Weather data from external stations.
- Astronomical data (sunset/sunrise, sun height during the day, moon rising/setting and phases).
- Cruise passengers biometric data.
