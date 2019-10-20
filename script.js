
var minutes = 0;
var seconds = 00;
var i = 0;
var galPerSec = .035;
var dollarPerGal = .03;
var refreshInterval;

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
    refreshInterval = setInterval(update, 1000);
}

function update() {
    if (timeStarter == 1) {
        add();
        document.getElementById("timer").innerHTML = pad(minutes) + ":" + pad(seconds);
    } else if (timeStarter == 2){
        clearInterval(refreshInterval);
        document.getElementById("timer-content").style.display = "none";
        saveTime();
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
    document.getElementById("stats-page").style.display = "";
    quipDisplay();
    var totalGal = ((minutes * 60) + seconds) * galPerSec;
    document.getElementById("stat-timer").innerHTML = pad(minutes) + ":" + pad(seconds);
    document.getElementById("num-gallons").innerHTML = totalGal.toFixed(2);
    document.getElementById("bill-impact").innerHTML = (totalGal * dollarPerGal).toFixed(2);
    document.getElementById("total-bill").innerHTML = (totalGal * dollarPerGal * 30).toFixed(2);
}

function quipDisplay() {
    if (minutes < 1) {
        document.getElementById("quips").innerHTML = "Wow! That must be a record, good job!"
    } else if (minutes < 8) {
        document.getElementById("quips").innerHTML = "Nice shower time, you're under the national average. Way to save water!"
    } else if (minutes < 12) {
        document.getElementById("quips").innerHTML = "Slightly above the average but you're still doing well! Check your impact below."
    } else if (minutes < 16) {
        document.getElementById("quips").innerHTML = "Does it really take you that long to wash your hair? Check your impact below."
    } else if (minutes > 16) {
        var navyShower = "Navy shower";
        navyShowerLink = navyShower.link("https://en.wikipedia.org/wiki/Navy_shower")
        document.getElementById("quips").innerHTML = "Have you ever heard of a " + navyShowerLink + "? Check your impact below."
    }
}

function addMinute() {
    minutes += 1;
}
function addTenSeconds() {
    seconds += 10;
}


function loginComplete() {
    document.getElementById("create-account").style.display = "none";
    document.getElementById("timer-content").style.display = "";
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
  var docRef;

  // Create an account
  function createAccount(){

    var usernameTaken = false; // Will keep track if username is already taken

    //Get username and password
    var username = document.getElementById("username").value.toLowerCase().trim(); // Not case senstive
    var password = document.getElementById("password").value.trim();
  
    //Check if username and password is valid (at least one char each) and username is not in use
    if(username.length > 0 && password.length > 0) {
        docRef = db.collection("users").doc(username);

        docRef.get().then(function(doc) {
            //Check if username exists
            if (doc.exists) {
                alert("Username is already in use!")
            } else {
                db.collection("users").doc("" + username).set({           
                    Password: "" + password,
                    totalShowerTimer: 0,
                    totalShowers: 0
                });
                loginComplete(); // Lets us know that user succesfully logged in
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });    
    } else {
        alert("Username or Password is invalid, only requirement is that each are at least one character long");
    }
  };

function login() {
    //Get username and password
    var username = document.getElementById("username").value.toLowerCase().trim(); // Not case senstive
    var password = document.getElementById("password").value.trim();
  
    //Check if username and password is valid (at least one char each) and username is not in use
    if(username.length > 0 && password.length > 0) {
        docRef = db.collection("users").doc(username);

        docRef.get().then(function(doc) {
            //Check if username is valid
            if (doc.exists) {
                //Check if password is correct
                if(password == doc.data().Password) {
                    loginComplete();
                } else {
                    alert("Password is incorrect");
                }
            } else {
                // doc.data() will be undefined in this case
                alert("Username does not exist!")
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });    
    } else {
        alert("Username or Password is invalid, only requirement is that each are at least one character long");
    }

}

function saveTime() {
    
    // Atomically increment the total time by the current shower time and the number of showers.
    //docRef = db.collection("users").doc(username);

    docRef.update({
    totalShowerTimer: firebase.firestore.FieldValue.increment((minutes * 60) + seconds),
    totalShowers: firebase.firestore.FieldValue.increment(1)
    }).then(function() {
        getAverageShowerTime();
    });
}


//Used for comaprison methods
    var otherTotalTime;
    var otherTotalShowers;
    var totalTime;
    var totalShowers;

function getAverageShowerTime() {
    

    //docRef = db.collection("users").doc(username);

    //Get data on you
    docRef.get().then(function(doc) {
        //Check if username is valid
        if (doc.exists) {
            //Check if password is correct
            totalTime = doc.data().totalShowerTimer;
            totalShowers = doc.data().totalShowers;
            alert(totalTime + "**" + totalShowers);
           
        } else {
            // doc.data() will be undefined in this case
            alert("Username does not exist!")
        }

        
        
    }).then(function() { 
        displayStats();  
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    
    
    

}

//With the gets from the database not loading instanly it's usefull to just call another method once it;s done loading 
function compareShowerTimes() {

    //Get input
    var otherUsername = document.getElementById("compare-input").innerText;
    username = otherUsername;

    docRef.get().then(function(doc) {
        //Check if username is valid
        if (doc.exists) {
            //Check if password is correct
            otherTotalTime = doc.data().totalShowerTimer;
            otherTotalShowers = doc.data().totalShowers;
           
        } else {
            // doc.data() will be undefined in this case
            alert("Username does not exist!")
        }
        displayComparison();
        alert("Here is some more stuff: " + otherTotalTime + "" + otherTotalShowers + "" + totalShowers + "" + totalTime);
    }).catch(function(error) {
        console.log("Error getting document:", error);
    }); 
}

function displayComparison() {
    
}

function displayStats() {
    console.log(totalTime);
    document.getElementById("average-time").innerText = Math.round((totalTime/totalShowers)/60) + ":" + (Math.round((totalTime/totalShowers)) % 60);
    document.getElementById("total-usage").innerText = (totalTime * 2.1).toFixed(2);
}
