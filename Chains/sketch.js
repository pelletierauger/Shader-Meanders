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
    cnvs.height = window.innerWidth * 9 / 16;
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
// Chainmail, correct
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
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    uv *= 2.;
    uv.y += 0.15;
    float rando = rand(uv+time);
    vec2 ov = uv;
    uv = uv.yx;
    // uv = rotateUV(uv, pi * 0.5, 0.0);
   // uv *= 1.0-(length(uv)*length(uv))*0.0625;
    
    uv.x += time * 0.5e-2;
    // uv.y += time * 1e-2;
    // uv.y *= -1.;
    // uv = uv.yx;
    float ax = floor(uv.x*4.);
    float ay = floor(uv.y*4.);
    float xx = (mod(ax, 2.) == 0.) ? 0. : 1.;
    float yy = (mod(ay, 2.) == 0.) ? 0. : 1.;
    uv = fract(uv*4.);
    float c0 = length(uv - vec2(1., yy));
    c0 = abs((c0 - 0.85) * 4.) * -1. + 1.;
    c0 = smoothstep(0., 1., c0);
    float c = length(uv - vec2(0., yy));
    c = abs((c - 0.85) * 4.) * -1. + 1.;
    c = smoothstep(0., 1., c);
    float c1 = length(uv - vec2(0. + 0., 1.-yy));
    c1 = abs((c1 - 0.85) * 4.) * -1. + 1.;
    c1 = smoothstep(0., 1., c1);
    float c2 = length(uv - vec2(1. + 0., 1.-yy));
    c2 = abs((c2 - 0.85) * 4.) * -1. + 1.;
    c2 = smoothstep(0., 1., c2);
    float shadowA = (uv.x) * 0.5;
    float shadowB = (1. - uv.x) * 0.5;
    float vignette = 1.0-length(ov+vec2(0.,-0.1)*5.)*0.5;
    vignette = smoothstep(0., 1., vignette);
    vignette = smoothstep(0., 1., vignette);
    c += smoothstep(0.9, 1., c) * 0.1;
    c0 += smoothstep(0.9, 1., c0) * 0.1;
    c1 += smoothstep(0.9, 1., c1) * 0.1;
    c2 += smoothstep(0.9, 1., c2) * 0.1;
    // shadowB += uv.x * -1.;
    // shadowB -= (uv.x);
    shadowA = smoothstep(0., 1., shadowA);
    shadowB = smoothstep(0., 1., shadowB);
    shadowA = smoothstep(0., 1., shadowA);
    shadowB = smoothstep(0., 1., shadowB);
    // c = c - shadowA;
    // c1 = c1 - shadowB;
    // c2 = c2 - shadowA;
    // c0 = c0 - shadowB;
    float cOri = c;
    float a = 0.3, b = 0.5;
    if (xx == 0.) {
        if (yy == 0.) {
            if (uv.x < uv.y) {
                c2 *= smoothstep(a, b, c2);
                cOri = mix(c2, cOri, smoothstep(a, b, cOri));
                c = cOri - shadowA;
                // c = 1.;
            } else {
                cOri *= smoothstep(a, b, cOri);
                cOri = mix(cOri, c2, smoothstep(a, b, c2));
                c = cOri - shadowA;
                // c = 1.;
            }
        } else {
            if (uv.x < uv.y * -1. + 1.) {
                c2 *= smoothstep(a, b, c2);
                cOri = mix(c2, cOri, smoothstep(a, b, cOri));
                c = cOri - shadowA;
                // c = 1.;
            } else {
                cOri *= smoothstep(a, b, cOri);
                cOri = mix(cOri, c2, smoothstep(a, b, c2));
                c = cOri - shadowA;
                // c = 1.;
            }
        }
    } else {
        if (yy == 1.) {
            if (uv.x > uv.y) {
                c0 *= smoothstep(a, b, c0);
                // c0 = min(c0, c0-c1Shadow * 1. * (1.0-uv.y*2.5));
                c1 = mix(c0, c1, smoothstep(a, b, c1));
                c = c1 - shadowB;
            } else {
                c1 *= smoothstep(a, b, c1);
                c0 = mix(c1, c0, smoothstep(a, b, c0));
                c = c0 - shadowB;
                // c = 1.;
            }
        } else {
            if (uv.x > uv.y * -1. + 1.) {
                c0 *= smoothstep(a, b, c0);
                // c0 = min(c0, c0-c1Shadow);
                // c0 -= c1Shadow * 200.;
                // c0 = min(c0, c0-c1Shadow * 1. * (1.25-uv.y*2.5)*-1.);
                c1 = mix(c0, c1, smoothstep(a, b, c1));
                c = c1 - shadowB;
                // c = 1.;
            } else {
                c1 *= smoothstep(a, b, c1);
                c0 = mix(c1, c0, smoothstep(a, b, c0));
                c = c0 - shadowB;
                // c = 1.;
            }
        }
    }
    // c = min(c, c-c1Shadow * 0.5 * (1.25-uv.y*2.5)*-1.);
    float grid = floor(1.0-abs(uv.x)+0.01) + floor(1.0-abs(uv.y)+0.01);
    gl_FragColor = vec4(vec3(c+grid*0.), 1.0-rando*0.075);
    gl_FragColor.rgb *= vignette;
    float r = gl_FragColor.r;
    // r *= smoothstep(0., 1., ov.y * 0.5 + 0.75);
    gl_FragColor.rgb = vec3(r, pow(max(0., r), 4.)*0.5, pow(max(0., r), 2.)*0.5);
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