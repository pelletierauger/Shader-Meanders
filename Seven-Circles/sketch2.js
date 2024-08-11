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

function setup() {
    socket = io.connect('http://localhost:8080');
    socket.on('receiveOSC', function(data) {
        // console.log(data.args);
        // console.log(data.args[0].value);
        currentCircle = data.args[0].value;
        alphas[currentCircle] = 1;
        // scdAmplitude = 1;
    });
    pixelDensity(1);
    noCanvas();
    cnvs = document.getElementById('cnvs');
    cnvs.width = window.innerWidth * resolution;
    cnvs.height = window.innerHeight * resolution;
    gl = cnvs.getContext('webgl', { preserveDrawingBuffer: true });
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
    currentProgram = getProgram("smooth-dots");
    gl.useProgram(currentProgram);
    
    drawSpiral(currentProgram);
    drawSpiral2(currentProgram);
    drawCount += drawIncrement;
};

drawSpiral = function(selectedProgram) {
    positions = [];
    colors = [];
    let n = 27000;
    let t = drawCount * 1e-6 + 1e2;
    
    for (let i = 0; i < 6; i++) {
        let a = -i * (Math.PI*2/6) - drawCount * 1e-2*0;
        let x = Math.cos(a + Math.PI * 0.5) * 0.21;
        let y = Math.sin(a + Math.PI * 0.5) * 0.21;
        positions.push(x * ratio, y, 0);
        colors.push(0.0, 0.0, 1.0, alphas[i]);
    }
    
    positions.push(0, 0, 0);
    colors.push(1.0, 0.0, 0.0, alphas[6]);
    // for (let i = 0; i < alphas.length; i++) {
    //     alphas[i] *= 0.95;
    // }
    // counter++;
    // if (counter == 8) {
    //     counter = 0;
    //     currentCircle = (currentCircle + 1) % 7;
    //     alphas[currentCircle] = 1;
    // }
    currentProgram = smoothDots.program;
    gl.useProgram(currentProgram);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
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
    // -------------------------------------------
    // Drawing
    // -------------------------------------------
    gl.drawArrays(gl.POINTS, 0, positions.length/3);
};

alphas = [0, 0, 0, 0, 0, 0, 0];
currentCircle = 0;
counter = 0;
drawSpiral2 = function(selectedProgram) {
    positions = [];
    colors = [];
    let n = 27000;
    let t = drawCount * 1e-6 + 1e2;
    
    for (let i = 0; i < 6; i++) {
        let a = -i * (Math.PI*2/6) - drawCount * 1e-2*0;
        let x = Math.cos(a + Math.PI * 0.5) * 0.21;
        let y = Math.sin(a + Math.PI * 0.5) * 0.21;
        positions.push(x * ratio, y, 0);
        colors.push(0.0, 0.0, 1.0, alphas[i]);
    }
    
    positions.push(0, 0, 0);
    colors.push(1.0, 0.0, 0.0, alphas[6]);
    for (let i = 0; i < alphas.length; i++) {
        alphas[i] *= 0.9025;
    }
    // counter++;
    // if (counter == 8) {
    //     counter = 0;
    //     currentCircle = (currentCircle + 1) % 7;
    //     alphas[currentCircle] = 1;
    // }
    currentProgram = smoothDots2.program;
    gl.useProgram(currentProgram);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
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
    // -------------------------------------------
    // Drawing
    // -------------------------------------------
    gl.drawArrays(gl.POINTS, 0, positions.length/3);
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