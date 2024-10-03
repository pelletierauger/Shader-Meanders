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
    cnvs.width = window.innerWidth;
    cnvs.height = window.innerHeight;
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
// Flame, long and thin
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
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    // uv *= .;
    float m = 0.125;
    uv.x *= map(uv.y, 0., -0.55, 1., 0.2);
    // uv += vec2(sin(uv.y*10.-time*1e-1), cos(uv.x*10.-time*1e-1))*0.025;
    uv.x += sin(time * -3e-1 + uv.y * 2e1) * map(uv.y, 1., -0.3, 1., 0.) * 2e-2;
    // uv.x += abs(fract((uv.y-time*1e-2) * 5.)-0.5) * 0.1;
    // uv.x = mod((uv.x*1.)+(m*0.5), m)-(m*0.5);
    float c = length(uv);
    uv *= 1.15;
    float size = 8.;
    float smoothness = 2e-2;
    float c0 = length(uv+vec2(size,0.));
    float c1 = length(uv-vec2(size,0.));
    float c0A = smoothstep(size + smoothness, size, c0);
    float c1A = smoothstep(size + smoothness, size, c1);
    size *= 0.7;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    float c0B = smoothstep(size + smoothness * 2., size, c0);
    float c1B = smoothstep(size + smoothness * 2., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = max((c0A * c1A), (c0B * c1B * 0.95));
    size *= 0.25;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    c0B = smoothstep(size + smoothness * 10., size, c0);
    c1B = smoothstep(size + smoothness * 10., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = smoothstep(0., 1., c);
    float halo = max((c0A * c1A), (c0B * c1B * 0.35));
    // c = max(c, halo);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c), 1.0);
    gl_FragColor = vec4(vec3(1.0, pow(c,5.)*0.75, pow(c,5.)*0.5*0.75), (c+halo)*0.7-noise);
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

draw = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(time, drawCount);
    gl.uniform2f(resolution, cnvs.width, cnvs.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    drawCount += drawIncrement;
};

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