const firebaseConfig = {
    apiKey: "AIzaSyD45ji7yhAa-Va-Czv-mXfoR6LAsuD9e5U",
    authDomain: "traintime-cd3a3.firebaseapp.com",
    databaseURL: "https://traintime-cd3a3.firebaseio.com",
    projectId: "traintime-cd3a3",
    storageBucket: "traintime-cd3a3.appspot.com",
    messagingSenderId: "583129701352",
    appId: "1:583129701352:web:bb2fe816f979c8d5"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

let trainName = "";
let destination = "";
let trainTime = "";
let freq = "";


$("#add-train-btn").on("click", function (event) {
    event.preventDefault();
    console.log("working");

    trainName = $("#train-name").val().trim();
    destination = $("#destination-input").val().trim();
    trainTime = $("#trainTime").val().trim();
    freq = $("#frequency-input").val().trim();

    database.ref().push({
        TrainName: trainName,
        Destination: destination,   
        TrainTime: trainTime,
        Frequency: freq,
    });

    alert("Employee Successfully Added");


    $("#train-name").val("");
    $("#destination-input").val("");
    $("#trainTime").val("");
    $("#frequency-input").val("");

    return false;

});

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot); 
  
    trainName = childSnapshot.val().trainName;
    destination = childSnapshot.val().destination;
    trainTime = childSnapshot.val().trainTime;
    freq = parseInt(childSnapshot.val().freq); 

    let firstTimeInput = moment(trainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeInput);    
    let currentTimeCalc = moment().subtract(1, "years");

    const diffTime = moment().diff(moment(firstTimeInput), "minutes");
    let beforeCalc = moment(firstTimeInput).diff(currentTimeCalc, "minutes");
    let beforeMinutes = Math.ceil(moment.duration(beforeCalc).asMinutes());

    const tRemainder = diffTime%freq;
    let minutesRemaining = freq - tRemainder;
    let nextTrain = moment().add(minutesRemaining, "minutes").format ("hh:mm");

    if ((currentTimeCalc - firstTimeInput) < 0) {
        nextTrain = childSnapshot.val().trainTime;
        console.log("Before First Train");
        minutesRemaining = beforeMinutes;
    }
        else {
        nextTrain;
        minutesRemaining = freq - tRemainder;
        console.log("Working");
    }
    

    let newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(freq),
        $("<td>").text(trainTime),
        $("<td>").text(minutesRemaining),
    );

    $("#trainTable > tbody").append(newRow);
});