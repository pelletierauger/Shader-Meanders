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
// Smooth triangle
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
${blendingMath}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float smoothTriangle(vec2 p, vec2 p0, vec2 p1, vec2 p2, float smoothness) {
    vec3 e0, e1, e2;
    e0.xy = normalize(p1 - p0).yx * vec2(+1.0, -1.0);
    e1.xy = normalize(p2 - p1).yx * vec2(+1.0, -1.0);
    e2.xy = normalize(p0 - p2).yx * vec2(+1.0, -1.0);
    e0.z = dot(e0.xy, p0) - smoothness;
    e1.z = dot(e1.xy, p1) - smoothness;
    e2.z = dot(e2.xy, p2) - smoothness;
    float a = max(0.0, dot(e0.xy, p) - e0.z);
    float b = max(0.0, dot(e1.xy, p) - e1.z);
    float c = max(0.0, dot(e2.xy, p) - e2.z);
    return smoothstep(smoothness * 2.0, 1e-7, length(vec3(a, b, c)));
}
float smin(float a, float b, float k, int type) {
    // Quadratic
    if (type == 0) {
        k *= 4.0;
        float h = max(k-abs(a-b),0.0);
        return min(a, b) - h*h*0.25/k;
    }
    // Cubic
    if (type == 1) {
        k *= 6.0;
        float h = max( k-abs(a-b), 0.0 )/k;
        return min(a, b) - h*h*h*k*(1.0/6.0);
    }
    // Quartic
    if (type == 2) {
        k *= 16.0/3.0;
        float h = max( k-abs(a-b), 0.0 )/k;
        return min(a, b) - h*h*h*(4.0-h)*k*(1.0/16.0);
    }
    // Circular
    if (type == 3) {
        k *= 1.0/(1.0-sqrt(0.5));
        float h = max( k-abs(a-b), 0.0 )/k;
        return min(a, b) - k*0.5*(1.0+h-sqrt(1.0-h*(h-2.0)));
    }
    // Exponential
    if (type == 4) {
        return -k*log2( exp2( -a/k ) + exp2( -b/k ) );
    }
    // Sigmoid
    if (type == 5) {
        k *= log(2.0);
        float x = b-a;
        return a + x/(1.0-exp2(x/k));
    }
    // SquareRoot
    if (type == 6) {
        k *= 2.0;
        float x = b-a;
        return 0.5*( a+b-sqrt(x*x+k*k) );
    }
    // Circular Geometrical
    if (type == 7) {
        k *= 1.0/(1.0-sqrt(0.5));
        return max(k,min(a,b))-length(max(vec2(k-a,k-b), 0.0));
    }
}
float sdVesica(vec2 p, float r, float d) {
    p = abs(p);
    float b = sqrt(r*r-d*d);
    return ((p.y-b)*d>p.x*b) ? length(p-vec2(0.0,b))
                             : length(p-vec2(-d,0.0))-r;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    uv *= 1.4;
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    vec2 ov = uv;
    uv.x = abs(uv.x);
    float noise = rand(uv + sin(time)) * 0.05;
    float face = length(uv * vec2(0.5, 0.25) * 0.5 + vec2(0.0, -0.04));
    face = 1.0 - smoothstep(0.1, 0.147, face);
    // face = smoothstep(0., 1., face);
    float eye = length(uv - vec2(0.3, 0.0));
    float oriEye = eye;
    eye = smoothstep(0.1 - 0., 0.2 - 0., eye);
    face *= 0.5;
    face *= eye - (face - eye);
    // face -= (1.0 - smoothstep(0.12 + 0.08, 0.15 + 0.08, oriEye) * 1.) * 0.25;
    vec2 v0 = vec2(0.0, -0.25);
    vec2 v1 = vec2(0.25, 0.25);
    vec2 v2 = vec2(-0.25, 0.25);
    float a = smoothTriangle(uv, v0, v1, v2, 0.04);
    float a2 = smoothTriangle(uv, (v0 + vec2(0.3, 0.0)), (v1 + vec2(0.3, 0.0)), (v2 + vec2(0.3, 0.0)), 0.1);
    float a22 = smoothTriangle(uv * 0.5, v0 + vec2(0.1, 0.0), v1 + vec2(0.1, 0.0), v2 + vec2(0.1, 0.0), 0.08);
    float a3 = smoothTriangle(uv * vec2(3., -1.), v0, v1, v2, 0.1);
    // a = smin(a, eye, 0.5, );
    // face -= a;
    face = min(face, face * (1.0 -a22 * 0.5));
    face = min(face, face * (1.0 -a2 * 0.95));
    // face -= a2 * 0.5;
    face += a3 * 0.2;
    face *= smoothstep(0.4 - 0.1, 0.3 - 0.1, uv.y);
    // face = smoothstep(0., 2., face);
    // float eye2 = length(uv - vec2(0.39, 0.05));
    // eye2 = smoothstep(0.0, 0.15, eye2);
    // float eye3 = length(uv - vec2(0.39, -0.05));
    // eye3 = smoothstep(0., 0.95, eye2);
    // float d = smin(eye, eye2, 0.8, 3);
    // d = smin(d, eye3, 0.5, 3);
    // vec3 col = (d > 0.0) ? vec3(0.9,0.0,0.3) : vec3(0.6,0.5,0.5);
    //     col *= 1.0 - exp(-7.0*abs(d)) * 10.;
    // col *= 0.8 + 0.2*cos( ((d>0.0)?100.0:200.0)*abs(d));
        float mouth = sdVesica(ov.yx + vec2(0.5, 0.), 0.23, 0.3);
    mouth = smoothstep(0., 0.1, mouth);
    mouth = 1.0 - clamp(mouth, 0., 1.0);
    // face = 1.0 - mouth;
    face -= mouth * 2.;
    face *= sin(ov.x - time * 0.25e-1);
    // vec3 col = vec3(0.5);
    vec3 blend = BlendSoftLight(vec3(face), vec3(1.0, 0.5, 0.0));
    gl_FragColor = vec4(blend, 1.0 - noise);
    // gl_FragColor = vec4(vec3(eye2 + eye), 1.0 - noise);
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