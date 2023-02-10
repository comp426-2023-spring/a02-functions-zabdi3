#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment';
import fetch from 'node-fetch';

var helptext = `Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
-h            Show this help message and exit.
-n, -s        Latitude: N positive; S negative.
-e, -w        Longitude: E positive; W negative.
-z            Time zone: uses tz.guess() from moment-timezone by default.
-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
-j            Echo pretty JSON from open-meteo API and exit.`

var args = minimist(process.argv.slice(2));

if (args.h){
    console.log(helptext);
    process.exit(0)
}

const latitude = parseFloat(args.n || -args.s);
const longitude = parseFloat(-args.w || args.e);
//const timezone = moment.tz.guess();
const timezone = args.z || "America/New_York"

// Make a request
let response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' 
+ longitude + '&daily=weathercode,temperature_2m_max,precipitation_hours,windspeed_10m_max,winddirection_10m_dominant&timezone=' + timezone);

// Get the data from the request
const data = await response.json();

//const days = args.d; 
const days = (args.d !== undefined) ? args.d : 1
var whichday = "";
if (days == 0) {
  //console.log("today.")
    whichday = "today."
} else if (days > 1) {
  //console.log("in " + days + " days.")
    whichday = "in " + days + "day.";
} else {
  //console.log("tomorrow.")
    whichday = "tomorrow."
}

if (args.j){
    console.log(data);
    process.exit(0);
}
if (data.daily.precipitation_hours[days] > 0){
    console.log("You might need your galoshes for " + whichday);
} else {
    console.log("You will not need your galoshes for " + whichday)
}