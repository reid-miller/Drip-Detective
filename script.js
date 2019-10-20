
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

function loginComplete() {
    //Do stuff
}


//Firebase and log in stuff


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyC2hoBM7RmOif8VFLw0mnY0lMtpO9teeS4",
    authDomain: "drip-detective.firebaseapp.com",
    databaseURL: "https://drip-detective.firebaseio.com",
    projectId: "drip-detective",
    storageBucket: "drip-detective.appspot.com",
    messagingSenderId: "678865921320",
    appId: "1:678865921320:web:292da79a637ce2492d9c1d",
    measurementId: "G-0C43H4S07S"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  
  var db = firebase.firestore();

  function createAccount(){

    var usernameTaken = false; // Will keep track if username is already taken

    //Get username and password
    var username = document.getElementById("username").value.toLowerCase().trim(); // Not case senstive
    var password = document.getElementById("password").value.trim();
  
    //Check if username and password is valid (at least one char each) and username is not in use
    if(username.length > 0 && password.length > 0) {
        // Check if username is in use
        db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.id == username) {
                    usernameTaken = true;
                }
            });
        });
  
        //Add user to database if user name is not taken
        if(usernameTaken == true) {
            alert("Sorry username is ")
        } else {

        
        db.collection("users").doc("" + username).set({           
            Password: "" + password
        }).catch(function(error) {
            console.error("Error adding document: ", error);
        });
        loginComplete();
    }
        
    } 
  };

function login() {
    
    
    loginComplete();
    }
