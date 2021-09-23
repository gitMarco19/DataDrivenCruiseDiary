# Data Visualization

*Author: Marco Scanu*

## Objective
The aim is to build a narrative tool that tells the story of a sea cruise using the data collected during the cruise. <br>
The challenge is trying to do something that is aesthetically pleasing and strives toward the goal of unfolding a narrative story through the data.
Right now, the project has been realized using a mockup dataset, because the system for collecting data from the ship is not yet live and running it.

The visualization is done by using [*JavaScript*](https://github.com/topics/javascript) and its library [*D3*](https://github.com/d3/d3).

## User manual
So that everything work correctly, the project must be executed on a localhost server. <br>
It can be done in this way: <br>
First, go to the directory where the files are located. <br>
Secondly, either on the *linux command line* or on the *Windows PowerShell*, you need to write:
	
	python3 -m http.server

Now, in your browser, open the *indexProgetto.html* at the *localhost:3000* (or *:8000* or whatever is shown on the command line):
	
	http://localhost:3000/indexProgetto.html

This project is meant to be visualized in a full screen mode with resolution 1920x1080 pixel. So, in order to visualize it properly, the browser must be setted in its full screen mode.

## Contents
There is:
- ***dati***: it is the folder that contains all the data to visualize.
- ***documenti***: it contains the *project sketch* and some slides about the company (*dotdotdot*) which proposed the project.
- ***immagini***: it contains some pictures used in the project.
- ***indexProgetto.html***: it is the main page of the porject.
- ***script.js***: *JavaScript file* that allows the visualization through D3 library.
- ***style.css***: this is the *style sheet* for the html page.

## Future development
Optional integration with additional external data. <br>
For example:
- Weather data from external stations.
- Astronomical data (sunset/sunrise, sun height during the day, moon rising/setting and phases).
- Cruise passengers biometric data.
