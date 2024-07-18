let looping = false;
let keysActive = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "./frames/sketch";
let maxFrames = 20;
let gl, currentProgram;
let vertices = [];
let colors = [];
let indices = [];
let amountOfLines = 0;
let drawCount = 0;
let vertex_buffer, indices2_buffer, Index_Buffer, color_buffer, width_buffer, uv_buffer, dots_buffer;
let dots = [];
let frame = 0;
let frameInc = Math.PI * 2 / 60;
let seed = 10;
const openSimplex = openSimplexNoise(seed);

function setup() {
    socket = io.connect('http://localhost:8080');
    pixelDensity(1);
    // cnvs = createCanvas(windowWidth, windowWidth / 16 * 9, WEBGL);
    noCanvas();
    cnvs = document.getElementById('my_Canvas');
    gl = cnvs.getContext('webgl', { preserveDrawingBuffer: true });
    // canvasDOM = document.getElementById('my_Canvas');
    // canvasDOM = document.getElementById('defaultCanvas0');
    // gl = canvasDOM.getContext('webgl');
    // gl = cnvs.drawingContext;

    // gl = canvasDOM.getContext('webgl', { premultipliedAlpha: false });

    vertex_buffer = gl.createBuffer();
    indices2_buffer = gl.createBuffer();
    Index_Buffer = gl.createBuffer();
    color_buffer = gl.createBuffer();
    width_buffer = gl.createBuffer();
    uv_buffer = gl.createBuffer();
    dots_buffer = gl.createBuffer();
    shadersReadyToInitiate = true;
    initializeShaders();
    currentProgram = getProgram("smooth-line");
    gl.useProgram(currentProgram);

    // gl.colorMask(false, false, false, true);
    // gl.colorMask(false, false, false, true);

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable the depth test
    // gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);

    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.colorMask(true, true, true, true);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);

    // Set the view port
    gl.viewport(0, 0, cnvs.width, cnvs.height);


    frameRate(30);
    background(0);
    fill(255, 50);
    noStroke();
    if (!looping) {
        noLoop();
    }
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
            if (!grimoire) {
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
            }   
        }, false);
    }, 1);
}

draw = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    resetLines();
    resetDots();
    // addLine(0, 1, 0, -1, 
    //         10, 
    //         0, 0, 0, 0.8);
    // expandingUniverse();
    drawArachne();
    currentProgram = getProgram("smooth-dots");
    gl.useProgram(currentProgram);
    drawDots(currentProgram);
    currentProgram = getProgram("smooth-line");
    gl.useProgram(currentProgram);
    drawLines();
    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
    drawCount++;
}

resetLines = function() {
    indices = [];
    indices2 = [];
    vertices = [];
    colors = [];
    widths = [];
    uvs = [];
    lineAmount = 0;
};

addLine = function(x0, y0, x1, y1, w, r, g, b, a) {
    let ii = [0, 1, 2, 0, 2, 3];
    let iii = [0, 1, 2, 3];
    for (let k = 0; k < ii.length; k++) {
        indices.push(ii[k] + (lineAmount*4));
    }        
    for (let k = 0; k < iii.length; k++) {
        indices2.push(iii[k]);
    }
    let vv = [
        x0, y0, x1, y1,
        x0, y0, x1, y1,
        x0, y0, x1, y1,
        x0, y0, x1, y1
    ];
    for (let k = 0; k < vv.length; k++) {
        vertices.push(vv[k]);
    }
    let cc = [
        r, g, b, a, 
        r, g, b, a, 
        r, g, b, a, 
        r, g, b, a
    ];
    for (let k = 0; k < cc.length; k++) {
        colors.push(cc[k]);
    }
    widths.push(w, w, w, w);
    let uv = [
        0, 0, 
        1, 0, 
        1, 1, 
        0, 1
    ];
    for (let k = 0; k < uv.length; k++) {
        uvs.push(uv[k]);
    }
    lineAmount++;
};


drawLines = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices2), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(widths), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW); 
    // setShaders();
    /* ======== Associating shaders to buffer objects =======*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(currentProgram, "coordinates");
    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    // bind the indices2 buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    // get the attribute location
    var indices2AttribLocation = gl.getAttribLocation(currentProgram, "index");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(indices2AttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(indices2AttribLocation);
    // bind the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    // get the attribute location
    var color = gl.getAttribLocation(currentProgram, "color");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(color);
    // bind the width buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    // get the attribute location
    var widthAttribLocation = gl.getAttribLocation(currentProgram, "width");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(widthAttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(widthAttribLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    var uvAttribLocation = gl.getAttribLocation(currentProgram, "uv");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(uvAttribLocation, 2, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(uvAttribLocation);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);    
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
};

let makeLine2 = function(x0, y0, x1, y1, w) {
    let a0 = Math.atan2(y1 - y0, x1 - x0);
    let halfPI = Math.PI * 0.5;
    let c0 = Math.cos(a0 + halfPI) * w;
    let c1 = Math.cos(a0 - halfPI) * w;
    let s0 = Math.sin(a0 + halfPI) * w;
    let s1 = Math.sin(a0 - halfPI) * w;
    let xA = x0 + c0;
    let yA = y0 + s0;
    let xB = x0 + c1;
    let yB = y0 + s1;
    let xC = x1 + c0;
    let yC = y1 + s0;
    let xD = x1 + c1;
    let yD = y1 + s1;
    return [xA, yA, xB, yB, xC, yC, xD, yD];
};

resetDots = function() {
    dots = [];
};

drawDots = function(selectedProgram) {
    // vertices = [];
    // num=0;
    // for (let i = 0; i < reached.length; i++) {
    //     vertices.push(reached[i][0], reached[i][1]);
    //     num++;
    // }
    gl.bindBuffer(gl.ARRAY_BUFFER, dots_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dots), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.POINTS, 0, dots.length * 0.5);
};

drawArachne = function() {
    frameInc = Math.pow((openSimplex.noise2D(drawCount * 5e-2, 0) * 0.5 + 1), 5) * 0.05;
    // frameInc = Math.min(frameInc, 0.26);
    frameInc *= (Math.sin(drawCount*10)*0.5+0.5);
    let a = 4;
    let b = 3.2;
    let r = 48 / cnvs.width * 3;
    let br = (24 * 6) / cnvs.width * 3;
    // stroke(255, 0, 0);
    let ii = 0;
    for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / 12) {
        if (ii !== 7 && ii !== 5 && ii !== 6 && ii !== 0) {
            let f = i;
            let t = frame;
            let x = (b + a * Math.cos(f + Math.sin(i * 2 + t) * 0.2)) * Math.cos(f + Math.sin(i * 2 + t) * 0.2) * r;
            let y = (b + a * Math.cos(f + Math.sin(i * 2 + t) * 0.2)) * Math.sin(f + Math.sin(i * 2 + t) * 0.2) * r;
            let cx = 0; let cy = 0;
            let rr = rotate2D(0, 0, x, y, Math.PI * 0.5);
            // for (let k = 0; k < frameInc *1000; k++) {
                // var angle = Math.random()*Math.PI*2;
                // var rad = Math.random() * frameInc;
                // let d = [Math.cos(angle) * rad, Math.sin(angle)* rad];
                // dots.push(rr[0]*2 + d[0], ((rr[1] + (br * 2))*-1+0.45)*2-0.25+d[1]);
            // }
            let bx = Math.cos(i - Math.PI * 0.5 + Math.sin(i * 2 + t) * 0.2) * br;
            let by = Math.sin(i - Math.PI * 0.5 + Math.sin(i * 2 + t) * 0.2) * br;
            addLine(
                0, 0-0.25, bx*2, -by*2-0.25, 
                1/2/4+frameInc,
                1, 0, 0, 0.5
            );
            addLine(
                rr[0]*2, ((rr[1] + (br * 2))*-1+0.45)*2-0.25, bx*2, -by*2-0.25,
                1/2/4+frameInc,
                1, 0, 0, 0.5
            );
            addLine(
                0, 0-0.25, bx*2, -by*2-0.25, 
                1/5/4+frameInc,
                1, 0, 0, 1
            );
            addLine(
                rr[0]*2, ((rr[1] + (br * 2))*-1+0.45)*2-0.25, bx*2, -by*2-0.25,
                1/5/4+frameInc,
                1, 0, 0, 1
            );
        }
    ii++;
    }
    for (let i = 0; i < Math.PI * 2 - (Math.PI * 2 / 1200); i += Math.PI * 2 / 400) {
        let f = i;
        let x = (b + a * Math.cos(f)) * Math.cos(f) * r;
        let y = (b + a * Math.cos(f)) * Math.sin(f) * r;
        let cx = 0; let cy = 0;
        let rr = rotate2D(0, 0, x, y, Math.PI * 0.5);
        dots.push(rr[0]*2, ((rr[1] + (br*2))*-1+0.45)*2-0.25);
    }
    for (let i = 0; i < Math.PI * 2 - (Math.PI * 2 / 1200); i += Math.PI * 2 / 200) {
        let bx = Math.cos(i - Math.PI * 0.5) * br * (2/3);
        let by = Math.sin(i - Math.PI * 0.5) * br * (2/3);
        dots.push(bx*2*1.5, -by*2*1.5-0.25);
        dots.push(0+(Math.sin(i+drawCount*2e-1)*(i*0.005)), i*0.25-0.25);
    }
    // for (let i = 0; i < Math.PI * 2 - (Math.PI * 2 / 1200); i += Math.PI * 2 / 75) {
        // let bx = Math.cos(i - Math.PI * 0.5) * br * (2/3);
        // let by = Math.sin(i - Math.PI * 0.5) * br * (2/3);
        // dots.push(bx * (3/2)*0.25*2, ((by * (3/2)*0.25 - (br*2) * 1.5)*-1-0.45*1.5)*2-0.3);
        // ii++;
    // }
    // frame *= hit;
    frame += frameInc;
    socket.emit('note', frameInc);
    // hit = Math.max(1.0, hit * 0.9);
};

hit = 1;
hit = 20

function rotate2D(cx, cy, x, y, angle) {
    var rcos = Math.cos(angle),
        rsin = Math.sin(angle),
        nx = (rcos * (x - cx)) + (rsin * (y - cy)) + cx,
        ny = (rcos * (y - cy)) - (rsin * (x - cx)) + cy;
    return [nx, ny];
}

function rotate(p, a) {
    return [
        p.x * a.y + p.y * a.x,
        p.y * a.y - p.x * a.x
    ];
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
        if (key == 'p' || key == 'P') {
            makeField();
        }
        if (key == 'r' || key == 'R') {
            window.location.reload();
        }
        if (key == 'm' || key == 'M') {
            redraw();
        }
    }
}
