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
    gl.drawArrays(gl.POINTS, 0, n);
};

shapesSet = false;
setShapes = function() {
    if (!shapesSet) {
        positions = [];
        colors = [];
        n = 0;
        let t = drawCount * 1e-6 + 1e2;
         let inc;
        inc = Math.PI * 2 / 160;
        let p = 0.5;
        let towers = [
            [p, p], [p, -p], 
            [-p, p], [-p, -p]
        ];
        let tc = [
            [1, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 1, 0, 1],
            [1, 1, 0, 1],
        ];
        tc = [
            [1, 0, 0, 1],
            [1, 0, 0, 1],
            [1, 0, 0, 1],
            [1, 0, 0, 1],
        ];
        for (let j = 0; j < towers.length; j++) {
            for (let z = 1; z > -2; z -= 0.25) {
                // let r = map(z, 1, -1, 1, 0);
                for (let i = 0; i < (Math.PI * 2) - inc; i += inc) {
                    let r = map(z, 1, -1, 1, 0);
                    r *= map(Math.sin(i*10), -1, 1, 1.1, 0.9);
                    let x = Math.cos(i) * 0.25 * r;
                    let y = Math.sin(i) * 0.25 * r;
                    positions.push(
                        towers[j][0]+x, 
                        towers[j][1]+y, z
                    );
                    colors.push(
                        tc[j][0], tc[j][1], 
                        tc[j][2], tc[j][3]
                    );
                    n++;
                }
            }
        }
            inc = 0.0125;
        for (let x = -1; x <= (1+inc); x += inc) {
            for (let y = -1; y <= (1+inc); y += inc) {
                positions.push(x * 0.9, y * 0.9, 1);
                colors.push(1, 0, 0, 1);
                n++;
            }
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
        shapesSet = true;
    }
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