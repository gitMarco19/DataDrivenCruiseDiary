# Cruise Diary Dataset

## Mockup Dataset (available now)

### mockup-cruise-entries.csv
These data represent all the information collected during the cruise.

#### header
appWindDir,appWindSpeed,computedWindDir,computedWindSpeed,distance,elevation,humidity,lat,lon,pressure,shipDirection,shipSpeed,solarRadiation,temperature,time,UVIndex,waterTemperature

#### Units of measure
ship_direction (deg)
wind_speed (knots)
wind_direction (deg)
elevation (m) 
humidity (%)
ship_speed (knots)
UV_index
solar_radiation (w/m^2)
pressure (hPa)
temperature (deg)
distance_traveled (km)
apparent_wind_speed (knots)
apparent_wind_direction (deg)
longitude
latitude
current_time

### Data Fields that may be present in the future

#### From the boat itself:
- boat position/speed
- wind
- sea depth (tbd)
- humidity, water and air temperature (tbd)
- air quality sensors (gases, co2) (tbd)

#### From weather stations
- UV/solar exposition,
- temperature, humidity
- sunny/cloudy/rain (tbd)
- sea waves (tbd)

#### Cruise passengers biometric data
- heart rate, temperature (tbd)
- at rest / exhertion (tbd)
- raw accelerometer data (tbd)


### cruise_stages.csv
These data represent the stages reached during the cruise.

#### header
codice,lat,lon,tappa,dataArrivo,dataPartenza

Each stage is indentified by:
- a unique code 
- latitude and longitude
- the name of the stage itself
- the check-in date
- the departure date

### world.json
This is the set of coordinates useful for drawing the map in order to visualize the trip of the ship during the cruise.
