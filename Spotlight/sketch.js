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
    // Spotlight with 2 layers of fog, flashing, and hue shift
    setBothShaders(`
    // beginGLSL
    precision mediump float;
    #define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
    uniform float time;
    uniform vec2 resolution;
    ${blendingMath}
    vec2 rotateUV(vec2 uv, float rotation, float mid) {
        return vec2(
          cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
          cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
        );
    }
    vec2 hash(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }
    float noise( in vec2 p ) {
        const float K1 = 0.366025404; // (sqrt(3)-1)/2;
        const float K2 = 0.211324865; // (3-sqrt(3))/6;
        vec2  i = floor(p + (p.x + p.y) * K1 );
        vec2  a = p - i + (i.x + i.y) * K2;
        float m = step(a.y, a.x); 
        vec2  o = vec2(m, 1.0 - m);
        vec2  b = a - o + K2;
        vec2  c = a - 1.0 + 2.0 * K2;
        vec3  h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
        vec3  n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
        return dot(n, vec3(70.0));
    }
    float multilevelNoise(vec2 uv, vec2 p, float s) {
        float f = 0.0;
        vec2 muv = uv * 2.;
        muv.x *= 0.25;
        muv.x += time * -s;
        mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
        f  = 0.5000 * noise(muv);
        muv = m * muv;
        f += 0.2500 * noise(muv);
        muv = m * muv;
        f += 0.1250 * noise(muv);
        muv = m * muv;
        f += 0.0625 * noise(muv);
        f = 0.5 + 0.5 * f;
        // f *= smoothstep(0.0, 0.005, abs(p.x - 0.5)); 
        return f;
    }
    void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        float ratio = resolution.y / resolution.x;
        uv = uv - 0.5;
        uv.x /= ratio;
        uv -= vec2(0.5, 0.25);
        uv *= 8.;
        float n0 = multilevelNoise(uv, vec2(0.0), 1e-2*0.5);
        float n1 = multilevelNoise(uv*0.5+vec2(100.,200), vec2(0.0), 2e-2*0.5);
        float fog = mix(n0, n1*3., 0.5);
        uv = rotateUV(uv, pi * 0.25, 0.);
        vec2 uv2 = vec2(uv.x + 0.3, uv.y * 0.0625);
        uv2.x = smoothstep(0., 1., uv2.x);
        uv2.x = smoothstep(0., 1., uv2.x);
        float circle = max(0., 1. / length(uv + vec2(0.125, 0.)) * 0.05);
        float c = sin(atan(uv.y, uv.x) + (pi * -0.5)) * 0.5 + 0.5;
        c = pow(c, 64.);
        c *= 1.0 - length(uv) * 0.15;
        c *= max(0., 1. - uv2.x * 64.);
        c = mix(c + circle, (1.0 - ((1.0 - c) * (1.0 - circle))), 0.5);
        float osc = sin(time * 1e-1) * 0.5 + 0.5;
        float x = fract(time * 1e-2) * 2.;
        osc = fract(x)*15.*(-1.+floor(x)*2.)+(1.-floor(x));
        osc = clamp(osc, 0., 1.);
        osc = max(osc, max(0.,(fract(x)*-0.2+0.2)*(1.-floor(x))));
        float hue = mod(floor(((fract(time * 0.5e-2) * 4.)+1.)*0.5), 2.);
        c *= osc;
        c *= 1. - fog * 0.3;
        gl_FragColor = vec4(vec3(c, pow(c, 5.) * 0.5, pow(c, 3.) * 0.95), 1.0);
        gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, pi * 0.75 * hue);
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