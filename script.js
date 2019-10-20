
var minutes = 0;
var seconds = 00;
var i = 0;
var galPerSec = .035;
var dollarPerGal = .03;

var timeStarter = 0; // 0 means timer hasn't started 
                    // 1 means timer has been pressed and is running
                    // 2 means timer has been pressed again and should be stopped

function timeButton() {
    if (timeStarter == 0) {
        timeStarter = 1;
        document.getElementById("start-stop").childNodes[0].innerHTML = "Stop Timer";
        timer();
    } else if (timeStarter == 1) {
        timeStarter = 2;
    }
}

function timer() {
    var refreshInterval = setInterval(update, 1000);
}

function update() {
    if (timeStarter == 1) {
        add();
        document.getElementById("timer").innerHTML = pad(minutes) + ":" + pad(seconds);
    } else if (timeStarter == 2){
        document.getElementById("start-stop").style.visibility = 'hidden';
        statistics();
    }
}

function add() {
    if (seconds >= 59) {
        seconds = 0;
        minutes = minutes + 1;
    } else {
        seconds = seconds + 1;
    }
}

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

function statistics() {
    var totalGal = ((minutes * 60) + seconds) * galPerSec;
    document.getElementById("stat-timer").innerHTML = pad(minutes) + ":" + pad(seconds);
    document.getElementById("num-gallons").innerHTML = totalGal.toFixed(2);
    document.getElementById("bill-impact").innerHTML = (totalGal * dollarPerGal).toFixed(2);
    document.getElementById("total-bill").innerHTML = (totalGal * dollarPerGal * 30).toFixed(2);
}


//Firebase and log in stuff

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC2hoBM7RmOif8VFLw0mnY0lMtpO9teeS4",
    authDomain: "drip-detective.firebaseapp.com",
    projectId: "drip-detective"
  });
  
  var db = firebase.firestore();

  function createAccount(){

    //Get username and password
    var username = document.getElementById("username").value.toLowerCase().trim; // Not case senstive
    var password = document.getElementById("password").value.trim;
  
    //Check if username and password is valid (at least one char each) and username is not in use
    if(username.length > 0 && password.length > 0) {
        // TODO Check if username is in use
  
        //Add user to database
        db.collection("users").add({
            Username: "" + username,
            Password: "" + password,
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
        
    }

  console.log(username);
  console.log(password);
  
  };
