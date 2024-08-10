let looping = true;
let keysActive = true;
let socket, cnvs, gl, shaderProgram, time;
let drawCount = 0, drawIncrement = 1;
let resolutionUniformLocation, timeUniformLocation;
let vertexIDAttribLocation;
let positions, colors;
let currentProgram;
let ratio;
let resolution = 1;
let indices = [];
for (let i = 0; i < 10000000; i++) {
    indices.push(i);
}
indices = new Float32Array(indices);
let indicesBuffer, dots_buffer;

function setup() {
    socket = io.connect('http://localhost:8080');
    pixelDensity(1);
    noCanvas();
    cnvs = document.getElementById('cnvs');
    // cnvs.width = window.innerWidth * resolution;
    // cnvs.height = window.innerHeight * resolution;
    gl = cnvs.getContext('webgl', { preserveDrawingBuffer: true });
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    frameRate(20);

    indicesBuffer = gl.createBuffer();
    dots_buffer = gl.createBuffer();

    shadersReadyToInitiate = true;
    initializeShaders();

    currentProgram = getProgram("smooth-dots-vertex");
    gl.useProgram(currentProgram);

    vertexIDAttribLocation = gl.getAttribLocation(currentProgram, "vertexID");
    // -------------------------------------------
    // Updating the indices buffer
    // -------------------------------------------
    gl.bindBuffer(gl.ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(vertexIDAttribLocation, 1, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(vertexIDAttribLocation);
    
    resolutionUniformLocation = gl.getUniformLocation(smoothDotsVertex.program, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    timeUniformLocation = gl.getUniformLocation(smoothDotsVertex.program, "time");
    
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
    // drawOgiveWindows();
    drawLancetWindows();
    // drawEye(currentProgram);
    drawCount += drawIncrement;
};

drawOgiveWindows = function() {
    currentProgram = getProgram("smooth-dots-vertex");
    gl.useProgram(currentProgram);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    // -------------------------------------------
    // Updating the indices buffer
    // -------------------------------------------
    gl.bindBuffer(gl.ARRAY_BUFFER, indicesBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(vertexIDAttribLocation, 1, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(vertexIDAttribLocation);
    gl.uniform1f(timeUniformLocation, drawCount);
    // 57600 = (240 * 240)
    gl.drawArrays(gl.POINTS, 0, 360 * 360);
};

drawLancetWindows = function() {
    currentProgram = getProgram("lancet-windows");
    gl.useProgram(currentProgram);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
        // -------------------------------------------
    // Updating the indices buffer
    // -------------------------------------------
    gl.bindBuffer(gl.ARRAY_BUFFER, indicesBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(vertexIDAttribLocation, 1, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(vertexIDAttribLocation);
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    // 57600 = (240 * 240)
    gl.drawArrays(gl.POINTS, 0, Math.pow(700, 2));
};

function setResolution(r) {
    resolution = r;
    cnvs.width = window.innerWidth * resolution;
    cnvs.height = window.innerHeight * resolution;
}

keyPressed = function() {
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
        if (key == 'p' || key == 'P') {
            drawCount = 0;
        }
    }
}


drawEye = function() {
    vertices = [];
    inc = (Math.PI * 2) / 200;
    let eyeDist = 0.8;
    for (let i = 0 ; i < Math.PI * 2; i += inc) {
        let x = Math.cos(i) * 0.125;
        let y = Math.sin(i) * 0.125;
        vertices.push(x + eyeDist, y, 1, 1);
        vertices.push(x - eyeDist, y, 1, 1);
        // num++;
    }
    // for (let i = 0 ; i < Math.PI * 2; i += inc*0.5) {
    //     let x = Math.cos(i*1*drawCount) * 0.125 * i;
    //     let y = Math.sin(i*1*drawCount) * 0.125 * i;
    //     // vertices.push(x + eyeDist, y, 1, 1);
    //     // vertices.push(-x - eyeDist, y, 1, 1);
    //     // num++;
    // }
    // inc = (Math.PI * 2) / 250;
    // for (let i = Math.PI * 0.5 ; i < Math.PI * 2.5; i += inc) {
    //     // let x = Math.cos(i) * ((i < Math.PI * 1.5) ? 1 : -0.5) * 0.5;
    //     let x = Math.cos(i) * 0.5;
    //     let y = Math.sin(i) * 0.5;
    //     let c = Math.cos(Math.PI * 0.65) * 0.8;
    //     x = (x * 2 > c) ? x : -x + c;
    //     vertices.push(x * (9 / 16) * 0.75 + 0.7, y * 0.75 + 0.75, 1, 1);
    //     // num++;
    //     vertices.push(-x * (9 / 16) * 0.75 - 0.7, y * 0.75 + 0.75, 1, 1);
    //     // num++;
    // }
    // aaa = 1000;
    // teardrop equation
    // http://paulbourke.net/geometry/teardrop/
    // inc = (Math.PI * 2) / 250;
    // for (let i = 0; i < Math.PI * 2; i += inc) {
    //     let sc = 0.25;
    //     let x = 0.5 * (4 * Math.cos(i * 0.5) * Math.pow(Math.sin(i * 0.5), 4)) * sc; 
    //     let y = -Math.cos(i) * sc; 
    //     vertices.push(x * (9 / 16) + eyeDist, -y - (Math.cos(0) * sc) - 0.4, 1, 1);
    //     // num++;
    //             vertices.push(x * (9 / 16) - eyeDist, -y - (Math.cos(0) * sc) - 0.4, 1, 1);
    //     // num++;
    // }
    inc = PI / 500;
     for (let i = Math.PI / 4; i < Math.PI / 4 * 3; i += inc) {
         let sc = 0.75;
         let x = (Math.cos(i) * sc);
         let y = (Math.sin(i) * sc) - Math.sin(Math.PI/4) * sc;
    // ellipse(x + 60, y, 1);
    // vertex(x + 60, y);
         vertices.push(x - eyeDist, y, 1, 1);
         // num++;         
         vertices.push(x - eyeDist, -y, 1, 1);
         // num++;
         vertices.push(x + eyeDist, y, 1, 1);
         // num++;         
         vertices.push(x + eyeDist, -y, 1, 1);
         // num++;
    // ellipse(x - 55, y, 1);
    // ellipse(x + 60, y * -1 + 300 - 17, 1);
    // ellipse(x - 55, y * -1 + 300 - 17, 1);
      }
    
    // for (let j = 0; j < 5; j++) {
    // for (let i = Math.PI / 4; i < Math.PI / 4 * 3; i += inc) {
    //      let sc = Math.pow(2, (1+j) * Math.sin(i*0.5+drawCount*0.5e-1));
    //      let x = (Math.cos(i) * sc);
    //      let y = (Math.sin(i) * sc) - Math.sin(Math.PI/4) * sc;
    // // ellipse(x + 60, y, 1);
    // // vertex(x + 60, y);
    //      vertices.push(x - eyeDist, y, 1, 1);
    //      // num++;         
    //      vertices.push(x - eyeDist, -y, 1, 1);
    //      // num++;
    //      vertices.push(x + eyeDist, y, 1, 1);
    //      // num++;         
    //      vertices.push(x + eyeDist, -y, 1, 1);
    //      // num++;
    // // ellipse(x - 55, y, 1);
    // // ellipse(x + 60, y * -1 + 300 - 17, 1);
    // // ellipse(x - 55, y * -1 + 300 - 17, 1);
    //   }
    // }
    let speed = 0.01;
    let center = 1/speed/2;
    // center = 0;
//     for (let x = 0; x < 800; x++) {
//         let y = Math.abs((((x+center+drawCount*8)*speed) % 1) - 0.5) * 2;
//         // vertices.push(-x * 0.005 + 2, y * 0.5 - 1, 1, 1);
//         vertices.push(-y * 0.5 + 2.25, x * 0.005 - 2., 1, 1);
//         vertices.push(y * 0.5 - 2.25, x * 0.005 - 2., 1, 1);
        
//     }
//     for (let x = 0; x < 800; x++) {
//         let y = Math.abs((((x+center+drawCount*4)*speed) % 1) - 0.5) * 2;
//         // let fluc = Math.floor(map(Math.sin(x*speed+Math.tan(drawCount)),-1,1,0,2));
//         // y += Math.sin(Math.tan(drawCount * 1e-1 * Math.sin(x *1e-2)) * Math.sin(x*1e2)) * 1 * fluc;
//         // vertices.push(x * 0.005 + -2, y * 0.5 - 1, 1, 1);
//         // vertices.push(-x * 0.005 + 2, y * 0.5 + 0.5, 1, 1);
        
//     }
//     for (let x = 0; x < 400; x++) {
//         let y = Math.abs((Math.abs(((x-200)*speed))*(Math.sin(drawCount*1e-1)*0.5+0.5) % 1)-0.5)*2;
//         // vertices.push(-x * 0.005 + 1, y * 0.5 - 1, 1, 1);
        
//     }
    draw3DDots(currentProgram);
};

if (false) {

drawEye = function() {
    vertices = [];
    sides = 3;
    inc = (Math.PI * 2) / sides;
    st = Math.PI * 0.5;
        for (let i = st; i <= (Math.PI * 2.1) - inc + st; i += inc) {
            let p0 = [Math.cos(i), Math.sin(i)];
            let p1 = [Math.cos(i + inc), Math.sin(i + inc)];
            for (let p = 0; p < 1; p += 0.005) {
                let x = lerp(p0[0], p1[0], p) * 1;
                let y = lerp(p0[1], p1[1], p) * 1;
                if (i == st + inc) {
                    y -= Math.abs(x) * 0.52 - 0.45;
                }
                x *= map(Math.cos(drawCount * 0.5), -1,1,0.3,1)*0.7;
                // x += Math.sin(drawCount+x);
                vertices.push(x * 0.5, -y * 0.5 * 0.8, 1, 1);
            }
        }
    
    draw3DDots(currentProgram);
};

drawEye = function() {
    vertices = [];
    inc = PI / 500;
    let scale = (-drawCount * 0.25e-1) % 1;
    scale = Math.pow(2, Math.floor(scale)) / Math.pow(2, scale);
    scale *= scale;
    for (let j = 0; j < 20; j++) {
         inc = PI / 800;
        // let size = map(j, 0, 7, 0.3, 2) * scale;
        let sc = Math.pow(2, (1+j)) * 0.01225 * scale;
        let size = Math.min(1.4, 0.1 + sc * 0.5);
        for (let i = Math.PI / 4; i < Math.PI / 4 * 3; i += inc) {
            let x = (Math.cos(i) * sc) *0.83;
            let y = (Math.sin(i) * sc) - Math.sin(Math.PI/4) * sc;
            let xy = rotate(0, 0, x, y, -drawCount * 0.5e-1)
            if (j % 2 == 0) {
                 vertices.push(x, y, 1, size);
                 vertices.push(x, -y, 1, size);
            } else {
                 vertices.push(y, x, 1, size);
                 vertices.push(-y, x, 1, size);
            }
        }
         inc = PI / 300;
        for (let i = 0 ; i < Math.PI * 2; i += inc) {
            let x = Math.cos(i*i*100+drawCount*1e-2) * i * sc * 0.59;
            let y = Math.sin(i*i*100+drawCount*1e-2) * i * sc * 0.59;
            vertices.push(x, y, 1, size * 2);
        }
    }
    draw3DDots(currentProgram);
};

}

draw3DDots = function(selectedProgram) {
        currentProgram = getProgram("smooth-dots-3D");
    gl.useProgram(currentProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, dots_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.POINTS, 0, vertices.length / 4);
};