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
// The Curse of the Eye, Outward
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
}
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    uv.x *= ratio;
    float col = 0.0;
    // col += sdEquilateralTriangle(uv * 40., 4.);
    // col += sdEquilateralTriangle(uv * 10., 1.);
    uv.x *= 0.9;
    // uv *= 0.5; uv.x -= 0.35;
    uv.x = abs(uv.x);
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    iris = smoothstep(0.4, 0.5, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.-time*0.5)-time*1.)*0.5+0.5) * 0.5;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 8.);
    iris2 = smoothstep(0.35, 0.65, iris2);     
    float iris3 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.);
    iris3 = smoothstep(0., 1., iris3) * 0.35;
    col = col - iris - iris2 - iris3;
    // col = iris;
    col = smoothstep(0., 1., col);
    if (col < 0.01) {
        discard;
    }
    float noise = rand(uv + sin(time)) * 0.075;
    float br = pow(col, 4.) * 0.2;
    gl_FragColor = vec4(vec3(1.0, br, br), col - noise);
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