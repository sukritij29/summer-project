var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router =express.Router();
var appRoutes= require('./app/routes/api')(router);
var path = require('path');
var ts=require("time-slots-generator");
const tc = require("time-slots-generator");


app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/api',appRoutes);
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/tutorial',function(err){
    if (err) {
        console.log('Not connected to the database: ' + err);
    
    } else {
        console.log('Successfully connected to MongoDB');
    }
});

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function() {
    console.log('Running the server on port' + port);
});



function getTime(num) {
    var tempHour = String(Math.trunc(num / 60));
    var hour = tempHour + "".length === 1 ? "0" + tempHour : tempHour;
    var min = num % 60 === 0 ? "00" : num % 60;
    return { num: num, time: hour + ":" + min };
}

function getTimeSlots(blockTimes, showTimeAsString, interval, includeStartBlockedTime,includeEndBlockedTime) {
    var times = 1,
      sums = 60;
      includeStartBlockedTime = includeStartBlockedTime === true ? true : false;
      includeEndBlockedTime = includeEndBlockedTime === true ? true : false;
    switch (interval) {
      case "tenth":
        times = 6;
        sums = 10;
        break;
      case "quarter":
        times = 4;
        sums = 15;
        break;
      case "half":
        times = 2;
        sums = 30;
        break;
      case "one":
        times = 1;
        sums = 60;
        break;
      case "two":
        times = 1 / 2;
        sums = 120;
        break;
      case "three":
        times = 1 / 3;
        sums = 180;
        break;
      case "four":
        times = 1 / 4;
        sums = 240;
        break;
      default:
        times = 1;
        sums = 60;
        break;
    }
    var start = 0;
    var dateTimes = Array(Math.round(24 * times))
      .fill(0)
      .map(function(_) {
        start = start + sums;
        return start;
      });
    blockTimes = Array.isArray(blockTimes) === true && blockTimes.length > 0 ? blockTimes : [];
    if (blockTimes.length > 0) {
      dateTimes = blockTimes.reduce(function(acc, x) {
        return acc
          .filter(function(y) {
            return includeStartBlockedTime == true ? y <= x[0] : y < x[0];
          })
          .concat(
            acc.filter(function(y) {
              return includeEndBlockedTime == true ? y >= x[1] : y > x[1];
            })
          );
      }, dateTimes);
    }
    if (showTimeAsString === true) {
      return dateTimes
        .map(function(x) {
          return getTime(x);
        })
        .reduce(function(accc, element) {
          accc["" + element.num] = element.time;
          return accc;
        }, {});
    }
    return dateTimes;
}
 


  module.exports = {
    getTimeSlots: getTimeSlots
  };



 
console.log("get me all the time slots of the day with time \n",tc.getTimeSlots([],true));
console.log("get me all the time slots of the day without the given times with time \n",tc.getTimeSlots([[300,800,1000,1080]],true));
 


