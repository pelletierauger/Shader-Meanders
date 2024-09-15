let looping = true;
let keysActive = true;
let socket, cnvs, gl, shaderProgram, time;
let drawCount = 0, drawIncrement = 1;
let positionBuffer, colorBuffer, indexBuffer, index2Buffer;
let positionAttribLocation, colorAttribLocation;
let indexAttribLocation, index2AttribLocation, resolutionUniformLocation;
let positions, colors;
let currentProgram;
let ratio;
let resolution = 1;
let branches = 0;
let indices = [];
let indices2 = [];
// for (let i = 0; i < 1000000; i++) {
//     indices.push(i);
// }
let index = 0;

function setup() {
    socket = io.connect('http://localhost:8080');
    pixelDensity(1);
    noCanvas();
    cnvs = document.getElementById('cnvs');
    // cnvs.width = window.innerWidth * resolution;
    // cnvs.height = window.innerHeight * resolution;
    // gl = cnvs.getContext('webgl', { preserveDrawingBuffer: true });
    gl = cnvs.getContext('webgl', {antialias: false, depth: false});
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    frameRate(20);

    positionBuffer = gl.createBuffer();
    colorBuffer = gl.createBuffer();
    indexBuffer = gl.createBuffer();
    index2Buffer = gl.createBuffer();

    shadersReadyToInitiate = true;
    initializeShaders();

    currentProgram = getProgram("smooth-dots");
    gl.useProgram(currentProgram);
    positionAttribLocation = gl.getAttribLocation(currentProgram, "position");
    colorAttribLocation = gl.getAttribLocation(currentProgram, "color");
    indexAttribLocation = gl.getAttribLocation(currentProgram, "index");
    index2AttribLocation = gl.getAttribLocation(currentProgram, "index2");

    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);

    setTimeout(function() {
        scdConsoleArea.setAttribute("style", "display:block;");
        scdArea.style.display = "none";
        scdConsoleArea.setAttribute("style", "display:none;");
        jsCmArea.style.height = "685px";
        jsArea.style.display = "block";
        displayMode = "js";
        javaScriptEditor.cm.refresh();
    }, 1);
    setTimeout( function() {
        keysControl.addEventListener("mouseenter", function(event) {
        document.body.style.cursor = "none";
        document.body.style.backgroundColor = "#000000";
        appControl.setAttribute("style", "display:none;");
        let tabs = document.querySelector("#file-tabs");
        tabs.setAttribute("style", "display:none;");
        cinemaMode = true;
        scdArea.style.display = "none";
        scdConsoleArea.style.display = "none";
        jsArea.style.display = "none";
        jsConsoleArea.style.display = "none";
    }, false);
    keysControl.addEventListener("mouseleave", function(event) {
            document.body.style.cursor = "default";
            document.body.style.backgroundColor = "#1C1C1C";
            appControl.setAttribute("style", "display:block;");
            let tabs = document.querySelector("#file-tabs");
            tabs.setAttribute("style", "display:block;");
            if (displayMode === "both") {
                scdArea.style.display = "block";
                scdConsoleArea.style.display = "block";
                jsArea.style.display = "block";
                jsConsoleArea.style.display = "block";
            } else if (displayMode == "scd") {
                scdArea.style.display = "block";
                scdConsoleArea.style.display = "block";
            } else if (displayMode == "js") {
                jsArea.style.display = "block";
                jsConsoleArea.style.display = "block";
            }
            cinemaMode = false;
            clearSelection();
        }, false);
    }, 1);
    ratio = window.innerHeight / window.innerWidth;
    if (!looping) {
        noLoop();
    }
    positions = [];
    colors = [];
    makeWreath();
}

draw = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    currentProgram = getProgram("smooth-dots");
    gl.useProgram(currentProgram);
    drawDots(currentProgram);
    drawCount += drawIncrement;
};

drawDots = function(selectedProgram) {
    // positions = [];
    // colors = [];
    // let n = 27000;
    // let t = drawCount * 1e-6 + 1e2;
    // for (let i = 0; i < n; i += 1) {
    //     // Defining positions
    //     let x = Math.cos(i * t) * i * 5e-5;
    //     let y = Math.sin(i * t) * i * 5e-5;
    //     positions.push(x * ratio, y, 0);
    //     // Defining colors
    //     let r = map(i, 0, n, 1, 0);
    //     let g = Math.abs(Math.atan2(y, x) / Math.PI);
    //     let b = Math.sin(i * 1e-3) * 0.5 + 0.5;
    //     let a = 1;
    //     colors.push(r, g, b, a);
    // }
    // -------------------------------------------
    // Updating the position data
    // -------------------------------------------
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // Point an attribute to the currently bound buffer
    gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);
    // Enable the position attribute
    gl.enableVertexAttribArray(positionAttribLocation);
    // -------------------------------------------
    // Updating the color data
    // -------------------------------------------
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    // Point an attribute to the currently bound buffer
    gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
    // Enable the color attribute
    gl.enableVertexAttribArray(colorAttribLocation);
    // -------------------------------------------
    // Updating the index data
    // -------------------------------------------
    gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW);
    // Point an attribute to the currently bound buffer
    gl.vertexAttribPointer(indexAttribLocation, 1, gl.FLOAT, false, 0, 0);
    // Enable the color attribute
    gl.enableVertexAttribArray(indexAttribLocation);    
    // -------------------------------------------
    // Updating the index2 data
    // -------------------------------------------
    gl.bindBuffer(gl.ARRAY_BUFFER, index2Buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices2), gl.STATIC_DRAW);
    // Point an attribute to the currently bound buffer
    gl.vertexAttribPointer(index2AttribLocation, 1, gl.FLOAT, false, 0, 0);
    // Enable the color attribute
    gl.enableVertexAttribArray(index2AttribLocation);
    // -------------------------------------------
    // Updating the resolution uniform
    // -------------------------------------------
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);    
    // -------------------------------------------
    // Updating the time uniform
    // -------------------------------------------
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    // -------------------------------------------
    // Drawing
    // -------------------------------------------
    gl.drawArrays(gl.POINTS, 0, Math.min(branches, 50000));
};

function setResolution(r) {
    resolution = r;
    cnvs.width = window.innerWidth * resolution;
    cnvs.height = window.innerHeight * resolution;
}

function keyPressed() {
    if (keysActive) {
        if (keyCode === 32) {
            if (looping) {
                noLoop();
                looping = false;
            } else {
                loop();
                looping = true;
            }
        }
    }
}

makeWreath = function() {
    var r = 2;
    var total = 50;
    shape = "circle";
    var increment = TWO_PI / total;
    for (var i = 0; i < TWO_PI * 4; i += increment) {
        var x = Math.cos(i * 1) * r * 5;
        var y = Math.sin(i * 1) * r * 5;
        var nextX = Math.cos((i + (increment * 1)) * 1) * r * 5;
        var nextY = Math.sin((i + (increment * 1)) * 1) * r * 5;
        var vec1 = {
            x: Math.sin(i) * 100,
            y: Math.cos(i) * 100
        };
        var vec2 = {
            x: Math.sin(i + increment) * 100,
            y: Math.cos(i + increment) * 100
        };
        var angle = Math.atan2(vec2.y - vec1.y, vec2.x - vec1.x);
        var endLineX = vec1.x + Math.cos(angle) * 200;
        var endLineY = vec1.y + Math.sin(angle) * 200;
        var green = map(Math.abs(Math.sin(i)), 0, 1, 50, 205);
        // fill(255, green, 0);
        // stroke(255, green, 0);
        seed(vec1.x, vec1.y, angle, 10, green, i);
    }
};

seed = function(x, y, a, h, green, i) {
    if (branches < 60000) {
        branches++;
        var s = {x: x, y: y};
        var angle = a + random(-0.17, 0.17);
        var hyp = h * 0.97;
        var newX = s.x + Math.cos(a) * h;
        var newY = s.y + Math.sin(a) * h;
        var blue = map(h, 4, 0, 0, 255);
        var red = map(h, 4, 0, 250, 0);
        var alpha = map(h, 9, 0, 0, 150);
        // line(s.x, s.y, newX, newY);
        positions.push(s.x / 100, s.y / 100, 0);
        colors.push(red / 255, green / 255, blue / 255, alpha / 255);
        indices.push(index);
        indices2.push(i);
        index++;
        if (hyp > 0.2) {
            setTimeout(function() {
                seed(newX, newY, angle, hyp, green, i);
            }, 1);
        }
        if (hyp > 0.2 && (Math.round((hyp * 13)) % 20) == 0) {
            setTimeout(function() {
                seed(newX, newY, angle + random(-0.6, 0.6), hyp, green, i);
            }, 1);
        }
    }
};