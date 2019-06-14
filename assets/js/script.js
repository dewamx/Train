var config = {
  apiKey: "AIzaSyDQ4w9j6afDbePhu-WH9gu3JGZKiDBVSAo",
  authDomain: "clicker516.firebaseapp.com",
  databaseURL: "https://clicker516.firebaseio.com",
  storageBucket: "clicker516.appspot.com",
  messagingSenderId: "516025280332"
};


firebase.initializeApp(config);

var database = firebase.database();

var name = "";
var destination = "";
var frequency = 0;
var firstTrain = "";
var minutesAway = 0;
var schedule = [];
var firstTrainTotalMin = 0;
var trainTime = 0;
var currentTimeTotalMin = 0;
var nextArrivalInMin = 0;
var nextArrival = "";


$("#submit-train").on("click", function () {

  event.preventDefault();
  name = $("#train-name").val().trim();
  firstTrain = $("#first-train").val().trim();
  destination = $("#destination").val().trim();
  frequency = $("#frequency").val().trim();

  convertCurrentTimeToMinutes();
  convertFirstTrainToMinutes(firstTrain);
  if (frequency < 1440) {


    createTrainSchedule(firstTrainTotalMin, frequency);


    determineNextTrain(currentTimeTotalMin, schedule);


    determineMinutesAway(nextArrivalInMin, currentTimeTotalMin);

  } else {
    nextArrivalInMin = firstTrainTotalMin + (frequency % 1440);
    determineNextTrain(currentTimeTotalMin, nextArrivalInMin);
    minutesAway = parseFloat(firstTrainTotalMin) + parseFloat(frequency);
  }
  convertNextTrainToHoursMin(nextArrivalInMin);
  $("#train-name").val("");
  $("#first-train").val("");
  $("#destination").val("");
  $("#frequency").val("");

  database.ref().push({
    name: name,
    destination: destination,
    frequency: frequency,
    nextArrival: nextArrival,
    minutesAway: minutesAway
  });

});

database.ref().on("child_added", function (snapshot) {

  $("#trains").append("<tr>" +
    "<th>" + snapshot.val().name + "</th>" +
    "<th>" + snapshot.val().destination + "</th>" +
    "<th>" + snapshot.val().frequency + "</th>" +
    "<th>" + snapshot.val().nextArrival + "</th>" +
    "<th>" + snapshot.val().minutesAway + "</th>" +
    "</tr>");
});


function convertFirstTrainToMinutes(firstTrain) {

  firstTrain = moment(firstTrain, "hh:mm");
  firstTrainHours = firstTrain.hours();
  firstTrainMin = firstTrain.minutes();

  firstTrainTotalMin = firstTrainMin + firstTrainHours * 60;
}

function convertCurrentTimeToMinutes() {
  var currentHours = moment().hours();
  var currentMinutes = moment().minutes();

  currentTimeTotalMin = currentMinutes + currentHours * 60;
}

function createTrainSchedule(firstTrainTotalMin, frequency) {

  trainTime = 0;
  schedule = [];
  for (var i = 0; trainTime < 1440; i++) {
    trainTime = firstTrainTotalMin + (frequency * i);
    if (trainTime > 1440) {
      return schedule;
    } else {
      schedule.push(trainTime);
    }
  }
};

function determineNextTrain(currentTimeTotalMin, schedule) {


  for (var i = 0; i < schedule.length; i++) {
    if (schedule[i] > currentTimeTotalMin) {
      nextArrivalInMin = schedule[i];
      return nextArrivalInMin;
    }
  }
}


function convertNextTrainToHoursMin(nextArrivalInMin) {
  var nextArrivalHours = Math.floor(nextArrivalInMin / 60);
  var ampm = "";


  if (nextArrivalHours > 12) {
    nextArrivalHours = nextArrivalHours - 12;
    ampm = "PM";
  } else {
    nextArrivalHours = nextArrivalHours;
    ampm = "AM";
  }
  var nextArrivalMin = nextArrivalInMin % 60;
  if (nextArrivalHours < 10) {
    nextArrivalHours = "0" + nextArrivalHours;
  }
  if (nextArrivalMin < 10) {
    nextArrivalMin = "0" + nextArrivalMin;
  }
  nextArrival = nextArrivalHours + ":" + nextArrivalMin + " " + ampm;
}



function determineMinutesAway(nextArrivalInMin, currentTimeTotalMin) {

  minutesAway = nextArrivalInMin - currentTimeTotalMin;

  return minutesAway;
}