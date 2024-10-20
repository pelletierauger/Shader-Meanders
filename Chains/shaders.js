if (false) {

// Chains
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
    // uv *= 2.;
    float ax = floor(uv.x*4.);
    float ay = floor(uv.y*4.);
    float xx = (mod(ax, 2.) == 0.) ? 0. : 1.;
    float yy = (mod(ay, 2.) == 0.) ? 0. : 1.;
    uv = fract(uv*4.);
    float c0 = length(uv - vec2(1., yy));
    c0 = abs((c0 - 0.85) * 7.) * -1. + 1.;
    c0 = smoothstep(0., 1., c0);
    float c = length(uv - vec2(0., yy));
    c = abs((c - 0.85) * 7.) * -1. + 1.;
    c = smoothstep(0., 1., c);
    if (yy == 0.) {
        c0 *= smoothstep(0.4, 0.5, c0);
        c0 = mix(c0, c, smoothstep(0.4, 0.5, c));
        c = c0;
    } else {
        c *= smoothstep(0.4, 0.5, c);
        c = mix(c, c0, smoothstep(0.4, 0.5, c0));
    }
    float grid = floor(1.0-abs(uv.x)+0.01) + floor(1.0-abs(uv.y)+0.01);
    gl_FragColor = vec4(vec3(c+grid*1.), 1.0);
    // gl_FragColor.rgb = vec3(yy*0.5+xx*0.5);
}
// endGLSL
`);

// Chains
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
    // uv *= 2.;
    float ax = floor(uv.x*4.);
    float ay = floor(uv.y*4.);
    float xx = (mod(ax, 2.) == 0.) ? 0. : 1.;
    float yy = (mod(ay, 2.) == 0.) ? 0. : 1.;
    uv = fract(uv*4.);
    float c0 = length(uv - vec2(1., yy));
    c0 = abs((c0 - 0.85) * 7.) * -1. + 1.;
    c0 = smoothstep(0., 1., c0);
    float c = length(uv - vec2(0., yy));
    c = abs((c - 0.85) * 7.) * -1. + 1.;
    c = smoothstep(0., 1., c);
    if (yy == 0.) {
        c0 *= smoothstep(0.4, 0.5, c0);
        c0 = mix(c0, c, smoothstep(0.4, 0.5, c));
        c = c0;
    } else {
        c *= smoothstep(0.4, 0.5, c);
        c = mix(c, c0, smoothstep(0.4, 0.5, c0));
    }
    float grid = floor(1.0-abs(uv.x)+0.01) + floor(1.0-abs(uv.y)+0.01);
    gl_FragColor = vec4(vec3(c+grid*1.), 1.0);
    // gl_FragColor.rgb = vec3(yy*0.5+xx*0.5);
}
// endGLSL
`);

// Chainmail, faulty
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
    uv *= 1.5;
    // uv.y *= -1.;
    // uv = uv.yx;
    float ax = floor(uv.x*4.);
    float ay = floor(uv.y*4.);
    float xx = (mod(ax, 2.) == 0.) ? 0. : 1.;
    float yy = (mod(ay, 2.) == 0.) ? 0. : 1.;
    uv = fract(uv*4.);
    float c0 = length(uv - vec2(1., yy));
    c0 = abs((c0 - 0.85) * 7.) * -1. + 1.;
    c0 = smoothstep(0., 1., c0);
    float c = length(uv - vec2(0., yy));
    c = abs((c - 0.85) * 7.) * -1. + 1.;
    c = smoothstep(0., 1., c);
    float c1 = length(uv - vec2(0., 1.-yy));
    c1 = abs((c1 - 0.85) * 7.) * -1. + 1.;
    c1 = smoothstep(0., 1., c1);
    float c2 = length(uv - vec2(1., 1.-yy));
    c2 = abs((c2 - 0.85) * 7.) * -1. + 1.;
    c2 = smoothstep(0., 1., c2);
    if (yy == 0.) {
        if (xx == 0.) {
            float a = smoothstep(0.4, 0.5, c0);
            float b = smoothstep(0.4, 0.5, c2);
            c0 *= a;
            c2 *= b;
            c0 = mix(c0, c2, b);
            c = mix(c0, c, smoothstep(0.4, 0.5, c));
            // c = 1.;
        } else {
            float a = smoothstep(0.4, 0.5, c0);
            float b = smoothstep(0.4, 0.5, c1);
            c0 *= a;
            c1 *= b;
            c1 = mix(c1, c0, a);
            c = mix(c1, c, smoothstep(0.4, 0.5, c));
            // c = 1.;
        }
    } else {
        if (xx == 1.) {
            // c1 *= 0.5;
            float a = smoothstep(0.4, 0.5, c1);
            float b = smoothstep(0.4, 0.5, c0);
            c1 *= a;
            c0 *= b;
            c0 = mix(c0, c1, a);
            c *= smoothstep(0.4, 0.5, c);
            c = mix(c, c0, max(a,b));
            // c = 1.;
        } else {
            float a = smoothstep(0.4, 0.5, c0);
            float b = smoothstep(0.4, 0.5, c2);
            c0 *= a;
            c2 *= b;
            c2 = mix(c2, c0, a);
            c *= smoothstep(0.4, 0.5, c);
            c = mix(c, c2, max(a,b));
            // c = 1.;
        }
        // c = 0.;
    }
    float grid = floor(1.0-abs(uv.x)+0.01) + floor(1.0-abs(uv.y)+0.01);
    gl_FragColor = vec4(vec3(c+grid*0.), 1.0);
}
// endGLSL
`);

// Chainmail, faulty
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
    uv *= 1.5;
    uv = rotateUV(uv, pi * 0.5, 0.0);
    // uv.y *= -1.;
    // uv = uv.yx;
    float ax = floor(uv.x*4.);
    float ay = floor(uv.y*4.);
    float xx = (mod(ax, 2.) == 0.) ? 0. : 1.;
    float yy = (mod(ay, 2.) == 0.) ? 0. : 1.;
    uv = fract(uv*4.);
    float c0 = length(uv - vec2(1., yy));
    c0 = abs((c0 - 0.85) * 5.) * -1. + 1.;
    c0 = smoothstep(0., 1., c0);
    float c = length(uv - vec2(0., yy));
    c = abs((c - 0.85) * 5.) * -1. + 1.;
    c = smoothstep(0., 1., c);
    float c1 = length(uv - vec2(0. + 0., 1.-yy));
    c1 = abs((c1 - 0.85) * 5.) * -1. + 1.;
    c1 = smoothstep(0., 1., c1);
    float c2 = length(uv - vec2(1. + 0., 1.-yy));
    c2 = abs((c2 - 0.85) * 5.) * -1. + 1.;
    c2 = smoothstep(0., 1., c2);
    if (yy == 0.) {
        if (xx == 0.) {
            float a = smoothstep(0.4, 0.5, c0);
            float b = smoothstep(0.4, 0.5, c2);
            c0 *= a;
            c2 *= b;
            c0 = mix(c0, c2, b);
            c = mix(c0, c, smoothstep(0.4, 0.5, c));
            // c = 1.;
        } else {
            float a = smoothstep(0.4, 0.5, c0);
            float b = smoothstep(0.4, 0.5, c1);
            c0 *= a;
            c1 *= b;
            c1 = mix(c1, c0, a);
            c *= smoothstep(0.4, 0.5, c);
            c = mix(c, c1, max(a,b));
            // c = 1.;
        }
    } else {
        if (xx == 1.) {
            // c1 *= 0.5;
            float a = smoothstep(0.4, 0.5, c1);
            float b = smoothstep(0.4, 0.5, c0);
            c1 *= a;
            c0 *= b;
            c0 = mix(c0, c1, a);
            c *= smoothstep(0.4, 0.5, c);
            c = mix(c, c0, max(a,b));
             // c = 1.;
        } else {
            float a = smoothstep(0.4, 0.5, c0);
            float b = smoothstep(0.4, 0.5, c2);
            c0 *= a;
            c2 *= b;
            c2 = mix(c2, c0, a);
            c *= smoothstep(0.4, 0.5, c);
            c = mix(c, c2, max(a,b));
            // c = 1.;
        }
        // c = 0.;
    }
    float grid = floor(1.0-abs(uv.x)+0.01) + floor(1.0-abs(uv.y)+0.01);
    gl_FragColor = vec4(vec3(c+grid*1.), 1.0);
}
// endGLSL
`);
    

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
    uv = rotateUV(uv, pi * 0.5, 0.0);
    // uv.y *= -1.;
    // uv = uv.yx;
    float ax = floor(uv.x*4.);
    float ay = floor(uv.y*4.);
    float xx = (mod(ax, 2.) == 0.) ? 0. : 1.;
    float yy = (mod(ay, 2.) == 0.) ? 0. : 1.;
    uv = fract(uv*4.);
    float c0 = length(uv - vec2(1., yy));
    c0 = abs((c0 - 0.85) * 5.) * -1. + 1.;
    c0 = smoothstep(0., 1., c0);
    float c = length(uv - vec2(0., yy));
    c = abs((c - 0.85) * 5.) * -1. + 1.;
    c = smoothstep(0., 1., c);
    float c1 = length(uv - vec2(0. + 0., 1.-yy));
    c1 = abs((c1 - 0.85) * 5.) * -1. + 1.;
    c1 = smoothstep(0., 1., c1);
    float c2 = length(uv - vec2(1. + 0., 1.-yy));
    c2 = abs((c2 - 0.85) * 5.) * -1. + 1.;
    c2 = smoothstep(0., 1., c2);
    float cOri = c;
    if (xx == 0.) {
        if (yy == 0.) {
            c = (uv.x < uv.y) ? 1. : 0.;
            if (c == 1.) {
                c2 *= smoothstep(0.4, 0.5, c2);
                cOri = mix(c2, cOri, smoothstep(0.4, 0.5, cOri));
                c = cOri;
            } else {
                cOri *= smoothstep(0.4, 0.5, cOri);
                cOri = mix(cOri, c2, smoothstep(0.4, 0.5, c2));
                c = cOri;
            }
        } else {
            c = (uv.x > uv.y * -1. + 1.) ? 0. : 1.;
            if (c == 1.) {
                c2 *= smoothstep(0.4, 0.5, c2);
                cOri = mix(c2, cOri, smoothstep(0.4, 0.5, cOri));
                c = cOri;
            } else {
                cOri *= smoothstep(0.4, 0.5, cOri);
                cOri = mix(cOri, c2, smoothstep(0.4, 0.5, c2));
                c = cOri;
            }
        }
    } else {
        if (yy == 1.) {
            c = (uv.x < uv.y) ? 0. : 1.;
            if (c == 1.) {
                c0 *= smoothstep(0.4, 0.5, c0);
                c1 = mix(c0, c1, smoothstep(0.4, 0.5, c1));
                c = c1;
            } else {
                c1 *= smoothstep(0.4, 0.5, c1);
                c0 = mix(c1, c0, smoothstep(0.4, 0.5, c0));
                c = c0;
            }
        } else {
            c = (uv.x > uv.y * -1. + 1.) ? 1. : 0.;
            if (c == 1.) {
                c0 *= smoothstep(0.4, 0.5, c0);
                c1 = mix(c0, c1, smoothstep(0.4, 0.5, c1));
                c = c1;
            } else {
                c1 *= smoothstep(0.4, 0.5, c1);
                c0 = mix(c1, c0, smoothstep(0.4, 0.5, c0));
                c = c0;
            }
        }
    }
    // c = c;
    float grid = floor(1.0-abs(uv.x)+0.01) + floor(1.0-abs(uv.y)+0.01);
    gl_FragColor = vec4(vec3(c+grid*1.), 1.0);
}
// endGLSL
`);

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
    float rando = rand(uv+time * 1e-2);
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

// Chainmail, correct, shaking
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
    uv += -1.+vec2(1.0-(cos(uv.y*2. + time*0.25)*0.5+0.5)*-0.025, 1.0-(sin(uv.x*2. + time*2e-1)*0.5+0.5)*0.);
    // uv += -1.+vec2(1.0-(cos(uv.y*0.1 + time)*0.5+0.5)*-0.001, 1.0-(sin(uv.x*2. + time*2e-1)*0.5+0.5)*0.);
    float fl = (sin(uv.y * 8. + time*0.125))* 0.015 * 0.;
    float rando = rand(uv+time*1e-3);
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
    float shake = time*0.5;
    float c0 = length(uv - vec2(1.+0.015*sin(shake), yy-0.015*cos(-shake)));
    c0 = abs((c0 - 0.85 + fl) * 4.) * -1. + 1.;
    c0 = smoothstep(0., 1., c0);
    float c = length(uv - vec2(0.+0.015*sin(shake), yy-0.015*cos(-shake)));
    c = abs((c - 0.85 + fl) * 4.) * -1. + 1.;
    c = smoothstep(0., 1., c);
    float c1 = length(uv - vec2(0. + 0.+0.015*cos(shake), 1.-yy-0.015*cos(-shake)));
    c1 = abs((c1 - 0.85 - fl) * 4.) * -1. + 1.;
    c1 = smoothstep(0., 1., c1);
    float c2 = length(uv - vec2(1. + 0.+0.015*cos(shake), 1.-yy-0.015*cos(-shake)));
    c2 = abs((c2 - 0.85 - fl) * 4.) * -1. + 1.;
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

// Chains
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
    vec2 ov = uv;
    uv *= 3.;
    uv *= 1.0-(length(uv)*length(uv))*0.125;
    
    // uv.x += time * 1e-2;
    uv.y -= time * 1e-2;
    float ax = floor(uv.x*4.);
    float ay = floor(uv.y*4.);
    float xx = (mod(ax, 2.) == 0.) ? 0. : 1.;
    float yy = (mod(ay, 2.) == 0.) ? 0. : 1.;
    uv = fract(uv*4.);
    float c0 = length(uv - vec2(1., yy));
    c0 = abs((c0 - 0.8) * 4.) * -1. + 1.;
    c0 = smoothstep(0., 1., c0);
    float c = length(uv - vec2(0., yy));
    c = abs((c - 0.8) * 4.) * -1. + 1.;
    c = smoothstep(0., 1., c);
    if (yy == 0.) {
        c0 *= smoothstep(0.2, 0.6, c0);
        c0 = mix(c0, c, smoothstep(0.2, 0.6, c));
        c = c0;
    } else {
        c *= smoothstep(0.2, 0.6, c);
        c = mix(c, c0, smoothstep(0.2, 0.6, c0));
    }
    float grid = floor(1.0-abs(uv.x)+0.01) + floor(1.0-abs(uv.y)+0.01);
    gl_FragColor = vec4(vec3(c+grid*0.), 1.0);
    float vignette = 1.0-length(ov)*1.5;
    vignette = smoothstep(0., 1., vignette);
    vignette = smoothstep(0., 1., vignette);
    gl_FragColor.rgb *= vignette;
    float r = gl_FragColor.r;
    gl_FragColor.rgb = vec3(r, pow(max(0., r), 4.)*0.5, pow(max(0., r), 2.)*0.5);
    // gl_FragColor.rgb = vec3(yy*0.5+xx*0.5);
}
// endGLSL
`);

}