let looping = true;
let keysActive = true;
let socket, cnvs, gl, shaderProgram, time;
let drawCount = 0, drawIncrement = 1;
let positionBuffer, colorBuffer;
let positionAttribLocation, colorAttribLocation, resolutionUniformLocation;
let positions, colors;
let currentProgram;
let ratio;
let resolution = 1;
let shapesSet = false;

function setup() {
    socket = io.connect('http://localhost:8080');
    pixelDensity(1);
    noCanvas();
    cnvs = document.getElementById('cnvs');
    cnvs.width = window.innerWidth * resolution;
    cnvs.height = window.innerHeight * resolution;
    gl = cnvs.getContext('webgl', { preserveDrawingBuffer: true });
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    frameRate(20);

    positionBuffer = gl.createBuffer();
    colorBuffer = gl.createBuffer();

    shadersReadyToInitiate = true;
    initializeShaders();

    currentProgram = getProgram("smooth-dots");
    gl.useProgram(currentProgram);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    positionAttribLocation = gl.getAttribLocation(currentProgram, "position");
    gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);
    // Enable the position attribute
    gl.enableVertexAttribArray(positionAttribLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    colorAttribLocation = gl.getAttribLocation(currentProgram, "color");
    gl.vertexAttribPointer(colorAttribLocation, 4, gl.FLOAT, false, 0, 0);
    // Enable the color attribute
    gl.enableVertexAttribArray(colorAttribLocation);

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
}

draw = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT); 
    currentProgram = getProgram("smooth-dots");
    gl.useProgram(currentProgram);
    drawSpiral(currentProgram);
    drawCount += drawIncrement;
};

drawSpiral = function(selectedProgram) {
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
    setShapes();
    // -------------------------------------------
    // Drawing
    // -------------------------------------------
    timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    gl.drawArrays(gl.POINTS, 0, points.length);
};

randomPointOnSphere = function() {
  var theta = 6.283185 * Math.random();
  var u = 2.0 * Math.random() - 1.0;
  var v = Math.sqrt(1 - u * u);
  return [v * Math.cos(theta), v * Math.sin(theta), u];
}

randomPointWithinSphere = function() {
    var d, x, y, z;
    do {
        x = Math.random() * 2.0 - 1.0;
        y = Math.random() * 2.0 - 1.0;
        z = Math.random() * 2.0 - 1.0;
        d = x * x + y * y + z * z;
    } while (d > 1.0);
    return [x, y, z];
}

rotate3D = function(pitch, roll, yaw) {
    var cosa = Math.cos(yaw);
    var sina = Math.sin(yaw);
    var cosb = Math.cos(pitch);
    var sinb = Math.sin(pitch);
    var cosc = Math.cos(roll);
    var sinc = Math.sin(roll);
    var Axx = cosa*cosb;
    var Axy = cosa*sinb*sinc - sina*cosc;
    var Axz = cosa*sinb*cosc + sina*sinc;
    var Ayx = sina*cosb;
    var Ayy = sina*sinb*sinc + cosa*cosc;
    var Ayz = sina*sinb*cosc - cosa*sinc;
    var Azx = -sinb;
    var Azy = cosb*sinc;
    var Azz = cosb*cosc;
    for (var i = 0; i < pointsModif.length; i++) {
        var px = pointsModif[i][0][0];
        var py = pointsModif[i][0][1];
        var pz = pointsModif[i][0][2];
        pointsModif[i][0][0] = Axx*px + Axy*py + Axz*pz;
        pointsModif[i][0][1] = Ayx*px + Ayy*py + Ayz*pz;
        pointsModif[i][0][2] = Azx*px + Azy*py + Azz*pz;
    }
}

shapesSet = false;
setShapes = function() {
    if (!shapesSet) {
        positions = [];
        colors = [];
        n = 0;
        //     inc = 0.0125;
        // for (let x = -1; x <= (1+inc); x += inc) {
        //     for (let y = -1; y <= (1+inc); y += inc) {
        //         positions.push(x * 0.9, y * 0.9, 1);
        //         colors.push(1, 0, 0, 1);
        //         n++;
        //     }
        // }
        for (let i = 0; i < 12250; i ++) {
            let v = randomPointOnSphere();
            positions.push(v[0], v[1], v[2]);
            colors.push(1, 1, 1, 1);
            n++;
        }
        points = [];
        for (let i = 0; i < 3250; i ++) {
            let v = randomPointOnSphere();
            points.push(
                [
                    v,
                    [1, 1, 1, 1]
                ]);
            // n++;
        }
        for (let i = 0; i < 202250; i ++) {
            let v = randomPointWithinSphere();
            points.push(
                [
                    [v[0] * 0.95, v[1] * 0.95, v[2] * 0.95],
                    [0, 0, 0, 1]
                ]);
            // n++;
        }
        shapesSet = true;
    }
        pointsModif = Array.from(points);
        positions = [];
        colors = [];
        rotate3D(drawCount * 1e-6, 0, 0);
        pointsModif.sort((a, b) => a[0][2] < b[0][2]);
        for (let i = 0; i < pointsModif.length; i++) {
            let v = pointsModif[i][0];
            let c = pointsModif[i][1];
            positions.push(v[0] * (9./16.), v[1], v[2]);
            colors.push(c[0], c[1], c[2], c[3])
        }
        // -------------------------------------------
        // Updating the position data
        // -------------------------------------------
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        // -------------------------------------------
        // Updating the color data
        // -------------------------------------------
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        // shapesSet = true;
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