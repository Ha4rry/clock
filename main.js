let unixEpoch;
let h;
let m;
let s;
let timeZoneAdjustment;
const c = document.querySelector('#clock')
const ctx = c.getContext('2d')
const timeText = document.querySelector("#timeText")

const cw = c.width
const ch = c.height

let radius = 0.9*(0.5*Math.min(cw,ch))

let hourHandLength = 0.65 * radius
let minuteHandLength = 0.8 * radius
let secondHandLength = 0.9 * radius
let littleLineLength = 0.05*radius
let radiusExcludingLittleLine;
let timeZoneHourAdjustment = null;

let hourString;
let minuteString;
let secondString;
let timeString;
let timeStringHTML;

let updDelayMs = 1; // how long between each screen update

function cartx (x) { // returns cartesian coordinate x as canvas x
    return x + cw/2
}
function carty (y) { // returns cartesian coordinate y as canvas y
    return ch/2 - y
}

function degSin(x) {
    return Math.sin(x * Math.PI/180)
}
function degCos(x) {
    return Math.cos(x * Math.PI/180)
}

function drawLineFromOriginToCart(x,y, colour, width=1) {
    ctx.beginPath();
    ctx.moveTo(cartx(0), carty(0));
    ctx.lineTo(cartx(x), carty(y));
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.stroke();
}

function drawLineFromCartToCart(x1,y1, x2,y2, colour, width=1) {
    ctx.beginPath();
    ctx.moveTo(cartx(x1), carty(y1));
    ctx.lineTo(cartx(x2), carty(y2));
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.stroke();
}
ctx.beginPath();
ctx.arc(cartx(0), carty(0), radius, 0, 2 * Math.PI);
ctx.stroke();

function upd(){
    ctx.clearRect(0, 0, cw, ch);
    // draw circle
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cartx(0), carty(0), radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2
    ctx.stroke();

    // draw the little lines
    radiusExcludingLittleLine = radius - littleLineLength
    for (let i = 0; i < 12; i++) {
        drawLineFromCartToCart(radiusExcludingLittleLine*degSin(30*i),radiusExcludingLittleLine*degCos(30*i),radius*degSin(30*i),radius*degCos(30*i), colour="black", width=2)
    }
    // fun time
    unixEpoch = Date.now()/1000 // from ms to s
    // yes it checks for the time zone every update, don't question it :D (maybe remove/change this for speed optimisation.)
    timeZoneHourAdjustment = -((new Date().getTimezoneOffset())/60) // utc - local = x, utc = x + local, utc - x = local, utc + (-x) = local, where x is getTimezoneOffset(), so we need -(getTimezoneOffset())
    secondsElapsedInDay = unixEpoch % (60*60*24)
    h = secondsElapsedInDay/(60*60) + timeZoneHourAdjustment
    m = (secondsElapsedInDay/60) % 60
    s = secondsElapsedInDay % 60

    
    drawLineFromOriginToCart((hourHandLength*degSin(30*h)),(hourHandLength*degCos(30*h)), colour="grey", width=3)
    drawLineFromOriginToCart((minuteHandLength*degSin(6*m)),(minuteHandLength*degCos(6*m)), colour="black", width=2)
    drawLineFromOriginToCart((secondHandLength*degSin(6*s)),(secondHandLength*degCos(6*s)), colour="red", width=1)
    

    // update time texts
    hourString = Math.floor(h).toString().padStart(2,"0")
    minuteString = Math.floor(m).toString().padStart(2,"0")
    secondString = Math.floor(s).toString().padStart(2,"0")
    timeStringHTML = `Current Time: <span id="hourText">${hourString}</span>:<span id="minuteText">${minuteString}</span>:<span id="secondText">${secondString}</span>`
    if (timeText.innerHTML !== timeStringHTML) {
        timeText.innerHTML = timeStringHTML
    }

    timeString = `${hourString}:${minuteString}:${secondString}`
    if (document.title !== timeString) {
        document.title = timeString;
    }
}
setInterval(upd, updDelayMs) // updates every 1ms! nice and smooooooth. (1000fps)
