var can, ctx, canX, canY, joyStickCenter ={}, mouseIsDown = 0,
    radius = 70, maxDragDistance = 300, dragDistance = 0;

function init() {
    can = document.getElementById("can");
    ctx = can.getContext("2d");

    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    can.addEventListener("mousedown", mouseDown, false);
    can.addEventListener("mousemove", mouseXY, false);
    can.addEventListener("touchstart", touchDown, false);
    can.addEventListener("touchmove", touchXY, true);
    can.addEventListener("touchend", touchUp, false);

    document.body.addEventListener("mouseup", mouseUp, false);
    document.body.addEventListener("touchcancel", touchUp, false);
}

function mouseUp() {
    mouseIsDown = false;
    clearScreen();
    mouseXY();
}

function touchUp() {
    mouseIsDown = false;
    // no touch to track, so just show state
    clearScreen();
    showPos();
}

function mouseDown(e) {
    mouseIsDown = true;
    joyStickCenter.x = e.pageX - can.offsetLeft;
    joyStickCenter.y = e.pageY - can.offsetTop;
    mouseXY();
}

function touchDown(e) {
    mouseIsDown = 1;
    joyStickCenter.x = e.targetTouches[0].pageX - can.offsetLeft;
    joyStickCenter.y = e.targetTouches[0].pageY - can.offsetTop;
    touchXY();
}

function mouseXY(e) {
    if (!e)
        var e = event;

    if (mouseIsDown) {
        canX = e.pageX - can.offsetLeft;
        canY = e.pageY - can.offsetTop;
        vecX = (canX - joyStickCenter.x);
        vecY = (joyStickCenter.y - canY);

        if (vecX > maxDragDistance) {
            vecX = maxDragDistance;
        }
        if (vecY > maxDragDistance) {
            vecY = maxDragDistance;
        }

        drawJoystick();
        printVectors();
    }
}

function printVectors() {
    console.log("vecX: " +  vecX + ", vecY: " + vecY);
}

function touchXY(e) {
    if (!e)
        var e = event;
    e.preventDefault();
    canX = e.targetTouches[0].pageX - can.offsetLeft;
    canY = e.targetTouches[0].pageY - can.offsetTop;
    drawJoystick();
}

function drawCoordinates() {
    var str = canX + ", " + canY;

    ctx.fillStyle = "white";
    ctx.font="30px Arial";
    ctx.fillText(str, can.width / 2 - ctx.measureText(str).width, can.height - 100, can.width - 10);
}

function clearScreen() {
    ctx.clearRect(0, 0, can.width, can.height);
}

function drawVector() {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(joyStickCenter.x, joyStickCenter.y);
    ctx.lineTo(canX, canY);
    ctx.stroke();
}

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
 //   ctx.fillStyle = color;
   // ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
}

function drawJoystick() {
    clearScreen();
    drawCircle(canX, canY, radius, 'white');
    drawCircle(joyStickCenter.x, joyStickCenter.y, maxDragDistance, '#fff');
    drawVector();
    drawCoordinates();
}

function showPos() {
    // large, centered, bright green text
    ctx.font = "24pt Helvetica";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgb(64,255,64)";
    var str = canX + ", " + canY;
    if (mouseIsDown)
        str += " down";
    if (!mouseIsDown)
        str += " up";
    ctx.clearRect(0, 0, can.width, can.height);
    // draw text at center, max length to fit on canvas
    ctx.fillText(str, can.width / 2, can.height / 2, can.width - 10);
    // plot cursor
    ctx.fillStyle = "white";
    ctx.fillRect(canX -5, canY -5, 10, 10);
}


var socket = io();

$( "#forward" ).click(function() {
  socket.emit('move', { cmd: "forward", pwm: 1 });
});


$( "#left" ).click(function() {
  socket.emit('move', { cmd: "left", pwm: 1 });
});


$( "#stop" ).click(function() {
  socket.emit('move', { cmd: "stop", pwm: 1 });
});


$( "#right" ).click(function() {
  socket.emit('move', { cmd: "right", pwm: 1 });
});


$( "#reverse" ).click(function() {
  socket.emit('move', { cmd: "reverse", pwm: 1 });
});
