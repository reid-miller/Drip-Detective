
var minutes = 0;
var seconds = 15;
var btn = document.createElement("BUTTON");
btn.innerHTML = "Stop Timer";
// document.body.appendChild(btn);

function startTime() {
    document.getElementById("timer").innerHTML = minutes + ":" + seconds;
    document.getElementById("start-shower").childNodes[0].innerHTML = "Stop Timer";
}

function timer() {

}
