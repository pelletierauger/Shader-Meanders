let looping = true;
let keysActive = true;
let socket, cnvs, gl, shaderProgram, time, resolution;
let drawCount = 0, drawIncrement = 1;
let vbuffer;

function setup() {
    socket = io.connect('http://localhost:8080');
    pixelDensity(1);
    noCanvas();
    cnvs = document.getElementById('cnvs');
    gl = cnvs.getContext('webgl', { preserveDrawingBuffer: true });
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    vbuffer = gl.createBuffer();
    frameRate(20);
    background(0);
    fill(255, 50);
    noStroke();
    setBothShaders(`
    // beginGLSL
        precision mediump float;
        #define pi 3.1415926535897932384626433832795
        varying vec2 vTexCoord;
        uniform float time;
        uniform vec2 resolution;
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }
    float rand(vec2 co) {
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
        void main() {
            vec2 uv = gl_FragCoord.xy / resolution;
            uv = uv - 0.5;
            uv.y -= map(sin(time*0.01), -1., 1., 0., 0.125);
            uv.x *= 1280./720.;
            // uv.x *= map(sin(uv.x*0.01+time*0.125), -1., 1., 0.8, 1.2);
            float c = map(sin(atan(uv.y, uv.x)+(pi*-1.)+sin(time*1e-1)*0.1), -1., 1., 0., 1.);
            float a = 250.;
            c = a * c - (a - 1.);
            c *= sin(pow(length(uv), 0.125)*140.-time*2.25)*0.5+0.5;
            // c *= max(0., 1.0-length(uv+vec2(0., 0.5))*1.);
            float spot = 1.0-length(uv+vec2(0., 0.85))*0.85;
            c = max(c, spot);
            
            // float c2 = map(sin(atan(uv.y, abs(uv.x)-0.2)+(pi*-1.25)+sin(time*1e-1)*0.1), -1., 1., 0., 1.);
            // float a2 = 250.;
            // c2 = a2 * c2 - (a - 1.);
            // c = max(c, c2);
            // c = max(c, c+c2*max(0., min(1., spot)));
            c += (1.0-length(vec2(abs(2.*abs(uv.x)-1.), uv.y*2.+1.))) * (1. - c);
            c *= map(sin(pow(length(uv*vec2(0.1, 1.)), 0.125)*70.-time*2.), -1., 1., 0.7, 1.)*max(0., spot*2.);
            gl_FragColor = vec4(vec3(c, 0., 0.)-(rand(uv+time*1e-2)*0.05), 1.0);
        }
    // endGLSL
    `);
    setRectangle();
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
        // keysControl.style.cursor = 'none';
        keysControl.addEventListener("mouseenter", function(event) {
        document.body.style.cursor = "none";
        document.body.style.backgroundColor = "#000000";
        appControl.setAttribute("style", "display:none;");
        let tabs = document.querySelector("#file-tabs");
        tabs.setAttribute("style", "display:none;");
        // let slider = document.querySelector("#timeline-slider");
        // slider.setAttribute("style", "display:none;");
        // slider.style.display = "none";
        // canvasDOM.style.bottom = "0";
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
                // let slider = document.querySelector("#timeline-slider");
                // slider.setAttribute("style", "display:block;");
                // slider.style.display = "block";
                // canvasDOM.style.bottom = null;
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
    if (!looping) {
        noLoop();
    }
}

function draw() {
    gl.uniform1f(time, drawCount);
    gl.uniform2f(resolution, cnvs.width, cnvs.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    drawCount += drawIncrement;
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