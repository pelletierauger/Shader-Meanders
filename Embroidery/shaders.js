let resetShader = false;
let smoothDots = new ShaderProgram("smooth-dots");

smoothDots.vertText = `
    // beginGLSL
    attribute vec2 coordinates;
    uniform float time;
    varying vec4 pos;
    varying float t;
    varying float osc;
    varying float hole;
    ${mapFunction}
    ${matrixTransforms}
const float TURBULENCE = 0.009;
//noise function from iq: https://www.shadertoy.com/view/Msf3WH
vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x);
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
}
const mat2 m2 = mat2(1.6,  1.2, -1.2,  1.6);
float fbm(vec2 p) {
    float amp = 0.5;
    float h = 0.0;
    for (int i = 0; i < 8; i++) {
        float n = noise(p);
        h += amp * n;
        amp *= 0.5;
        p = m2 * p;
    }
    return  0.5 + 0.5 * h;
}
vec3 cloudEffect(vec2 uv) {
    vec3 col = vec3(0.0, 0.0, 0.0);
    // time scale
    float v = 0.0002;
    vec3 smoke = vec3(1.0);
    vec2 scale = uv * 0.5;
    vec2 turbulence = TURBULENCE * vec2(noise(uv));
    scale += turbulence;
    float n1 = fbm(scale);
    col = mix(col, smoke, smoothstep(0.35, 0.9, n1));
    col = clamp(col, vec3(0.0), vec3(1.0));
    return col;
}    
void main(void) {
        t = time;
        // pos = coordinates;
        pos = vec4(coordinates, 1.0, 1.0);
        
        pos.xy *= 1.5e-2;
        pos.xy -= vec2(2.5, 1.);
        // float hole = 1.0;
        //     float ii = float(i);
        //     float x = cos(ii-time*1e-2) * ii * 1e-1;
        //     float y = sin(ii-time*1e-2) * ii * 1e-1;
        //         if (length(pos.xy + vec2(x,y)) < 0.25) {
        //         hole = 0.0;
        //     }
        // }
        osc = (sin(pos.x * 1e1 + t * 2e-1 + sin(pos.y*1.)*0.1) *0.5 + 0.5) * 0.05;
        pos = translate(0.0, 0.0, osc) * pos;
        pos = xRotate(-0.2) * pos;
        // pos = translate(0.0, 0.0, sin(t)*1e-1) * pos;
        pos = translate(0.0, 0.0, sin(pos.y*1.+t*1e-1)*0.1) * pos;
        pos.x *= (9./16.);
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
            vec3 col = cloudEffect(pos.xy * vec2(30.,2.) + vec2(1.5, 0.));
        // for (int i = 0; i < 20; i++) {
        hole = col.r;
        // gl_Position.xy *= 10.;
        gl_PointSize = 18./pos.z;
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    varying float t;
    varying vec4 pos;
    varying float osc;
    varying float hole;
    ${blendingMath}
    float rand(vec2 co) {
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness);
    }
    void main(void) {
        vec2 uv = gl_PointCoord;
        float distSquared = 1.0 - dot(uv - 0.5, uv - 0.5) * 4.;
        float l = 1.0 - length(uv - vec2(0.5)) * 4.;
        // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // l += distSquared * 0.25;
        // distSquared -= 1.7;
        // l += (distSquared - (l * distSquared));
        float halo = (1.0 - length(uv - vec2(0.5)) * 2.)*0.8;
        l = smoothstep(0., 1., l);
        l = pow(l, 3.);
        float noise = rand(uv - vec2(cos(t), sin(t))) * 0.0625;
        float a = (l+halo-noise)*1./max(1.,pow(pos.z, 8.));
        if (a < 0.01) {
            discard;
        }
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.25, 0.25), a * 0.75 - hole * 0.4);
        gl_FragColor.rgb = gl_FragColor.bgr;
                                float des = osc * 8.;
        // des = pow(des, 0.95);
        // des = smoothstep(0., 1., des);
        gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, hole*0.5).rgb;
        gl_FragColor.rgb = hueShift(gl_FragColor.rgb, -0.5);
        // gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, 1.0/pos.z).rgb;
    }
    // endGLSL
`;
smoothDots.vertText = smoothDots.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots.fragText = smoothDots.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots.init();
if (resetShader){
    currentProgram = getProgram("smooth-dots");
    gl.useProgram(currentProgram);
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
}
resetShader = true;