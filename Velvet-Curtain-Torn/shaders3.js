if (false) {

// Purple diamonds
smoothDotsVertex.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float vertexID;
    uniform vec2 resolution;
    uniform float time;
    varying float t;
    varying float z;
    varying float osc;
    varying vec2 posUnit;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = resolution.y / resolution.x;
        float i = vertexID;
        float s = 360.;
        float x = fract(i / s);
        float y = floor(i / s) / s;
        x = map(x, 0., 1., -1., 1.);
        y = map(y, 0., 1., -1., 1.);
        float a = time * 1e-1;
        vec4 pos = vec4(x, y, 1.0, 1.0);
        pos.x += rand(pos.xy) * 0.005;
        pos.y += rand(pos.xy) * 0.005;
        vec4 ropo = pos;
        ropo.x *= 4.0;
        ropo.x += 0.0;
        ropo = zRotate(pi*-0.25) * ropo;
        // ropo.x *= 4.;
        float zigzag = 1.;
        if (abs(sin(ropo.y*16.)*0.5+0.5) < 0.1) {
            zigzag = 0.0;
        }
        if (abs(sin(ropo.x*16.)*0.5+0.5) < 0.1) {
            zigzag = 0.0;
        }
        if (abs(cos(pi*0.5+ropo.x*16.)*0.5+0.5) < 0.4 && 
            abs(cos(pi*0.5+ropo.y*16.)*0.5+0.5) < 0.4) {
            zigzag = 0.0;
        }
        // if (abs(cos(pi*0.5+ropo.x*16.)*0.5+0.5) < 0.1 && 
        //     abs(cos(pi*0.5+ropo.y*16.)*0.5+0.5) < 0.1) {
        //     zigzag = 1.0;
        // }
        // if (pos.x < 0.0) {
        //     pos = yRotate(-0.1) * pos;
        // } else {
        //     pos = yRotate(0.1) * pos;
        // }
        
        pos = translate(0.0, 0.0, sin(pos.x*10.)*0.1) * pos;
        osc = (sin(pos.z * 3e1 + a + sin(pos.y*1.)*0.2) *0.5 + 0.5) * 0.1;
        pos = translate(0.0, 0.0, osc) * pos;
        pos = xRotate(-0.2) * pos;
        // pos = translate(0.0, 0.0, sin(pos.x*1.)*0.4) * pos;
        pos = translate(0.0, 0.0, sin(pos.y*1.+time*1e-1)*0.1) * pos;
        
        // pos = yRotate(0.4) * pos;
        // pos = translate(0.0, (sin(pos.x * 2e1 + a) *0.5 + 0.5) * 0.1, 0.0) * pos;
        pos.xy *= 1.5;
        pos.x *= ratio;
        pos.x = pos.x * 1.2;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
                gl_Position.y += 0.1;
        // gl_Position.x += cos(time*4e-3+729.99) * 2.;
        gl_Position.y += 0.3;
        gl_PointSize = 4./pos.z;
        gl_PointSize += (cos(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*2.;
        if (abs(pos.x) < 0.105) {
            gl_PointSize = 0.0;
        }
        gl_PointSize *= zigzag;
        // vec4 ropo = zRotate(pi*-0.25) * pos;
        // if (abs(sin(ropo.y*10.+abs(fract(ropo.x*5.)-0.5)*6.)*0.5+0.5) < 0.1) {
        //     gl_PointSize = 0.0;
        // }
        z = pos.z;
        posUnit = pos.xy;
        t = time;
    }
    // endGLSL
`;
smoothDotsVertex.fragText = `
    // beginGLSL
    precision mediump float;
    varying float t;
    varying float z;
    varying float osc;
    varying vec2 posUnit;
    ${blendingMath}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        distSquared = smoothstep(0., 1., distSquared);
        float hl = pow(distSquared, 8.)* 0.5;
        gl_FragColor = vec4(vec3(1.0, hl,hl), distSquared * 0.75 - pow(z, 12.) * 0.1);
        gl_FragColor.a -= (sin(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*0.2;
        vec2 posU = posUnit;
        // posU.x += cos(t*4e-3+729.99) * 2.;
        float light = 1.0 - length((posU - vec2(0., -0.5))*vec2(16./9., 1.)) * 0.4;
        light = smoothstep(0., 1., light) * 0.3;
        gl_FragColor.a += light;
        gl_FragColor.a *= light / 0.3;
        if (gl_FragColor.a < 0.01) {
            discard;
        }
        gl_FragColor.rgb = gl_FragColor.bgr;
        // des = min(0.6, pow(des, 0.5));
        // des = 1.0 - exp( -des );
        // des = pow(des, vec3(0.4545));
                float des = osc * 4.;
        // des = pow(des, 0.95);
        // des = smoothstep(0., 1., des);
        gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, des).rgb;
        gl_FragColor.a *= 1.0 - min(0.7, des * 2.);
        gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 0.3);
        // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, -0.45);
        
        // gl_FragColor.a *= floor(sin(t) + 1.);
        // gl_FragColor.a = 1.0 - exp( -gl_FragColor.a );
    }
    // endGLSL
`;
smoothDotsVertex.vertText = smoothDotsVertex.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDotsVertex.fragText = smoothDotsVertex.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDotsVertex.init();
if (shadersReadyToInitiate) {
    currentProgram = smoothDotsVertex.program;
    gl.useProgram(currentProgram);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
}

// Red animal pattern, softer lighting
smoothDotsVertex.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float vertexID;
    uniform vec2 resolution;
    uniform float time;
    varying float t;
    varying float z;
    varying float osc;
    varying vec2 posUnit;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
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
    void main(void) {
        float ratio = resolution.y / resolution.x;
        float i = vertexID;
        float s = 360.;
        float x = fract(i / s);
        float y = floor(i / s) / s;
        x = map(x, 0., 1., -1., 1.);
        y = map(y, 0., 1., -1., 1.);
        float a = time * 1e-1;
        vec4 pos = vec4(x, y, 1.0, 1.0);
        pos.x += rand(pos.xy) * 0.005;
        pos.y += rand(pos.xy) * 0.005;
        float torn = noise(pos.xy*20.);
        pos = translate(0.0, 0.0, sin(pos.x*10.)*0.1) * pos;
        osc = (sin(pos.z * 3e1 + a + sin(pos.y*1.)*0.2) *0.5 + 0.5) * 0.1;
        pos = translate(0.0, 0.0, osc) * pos;
        pos = xRotate(-0.2) * pos;
        // pos = translate(0.0, 0.0, sin(pos.x*1.)*0.4) * pos;
        pos = translate(0.0, 0.0, sin(pos.y*1.+time*1e-1)*0.1) * pos;
        
        // pos = yRotate(0.4) * pos;
        // pos = translate(0.0, (sin(pos.x * 2e1 + a) *0.5 + 0.5) * 0.1, 0.0) * pos;
        pos.xy *= 1.5;
        pos.x *= ratio;
        pos.x = pos.x * 1.2;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
                gl_Position.y += 0.1;
        // gl_Position.x += cos(time*4e-3+729.99) * 2.;
        gl_Position.y += 0.3;
        gl_PointSize = 3.5/pos.z;
        gl_PointSize += (cos(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*2.;
        if (abs(pos.x) < 0.1) {
            gl_PointSize = 0.0;
        }
        gl_PointSize *= floor(torn * 0.5 + 1.);
        // vec4 ropo = zRotate(pi*-0.25) * pos;
        // if (abs(sin(ropo.y*10.+abs(fract(ropo.x*5.)-0.5)*6.)*0.5+0.5) < 0.1) {
        //     gl_PointSize = 0.0;
        // }
        z = pos.z;
        posUnit = pos.xy;
        t = time;
    }
    // endGLSL
`;
smoothDotsVertex.fragText = `
    // beginGLSL
    precision mediump float;
    varying float t;
    varying float z;
    varying float osc;
    varying vec2 posUnit;
    ${blendingMath}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        distSquared = smoothstep(0., 1., distSquared);
        float hl = pow(distSquared, 8.)* 0.4;
        gl_FragColor = vec4(vec3(1.0, hl,hl), distSquared * 0.75 - pow(z, 12.) * 0.1);
        gl_FragColor.a -= (sin(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*0.2;
        float light = 1.0 - length((posUnit - vec2(0., -1.))*vec2(16./9., 1.)) * 0.2;
        light = smoothstep(0., 1., light) * 0.3;
        gl_FragColor.a += light;
        gl_FragColor.a *= light / 0.3 * 0.5;
        // gl_FragColor.rgb = gl_FragColor.bgr;
        gl_FragColor.a = pow(max(0., gl_FragColor.a), 2.) * 2.;
        if (gl_FragColor.a < 0.01) {
            discard;
        }
                        float des = osc * 4.;
        // des = pow(des, 0.95);
        // des = smoothstep(0., 1., des);
        gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, des).rgb;
        gl_FragColor.a *= 1.0 - min(0.7, des * 2.-light);
        // gl_FragColor.a = 1.0 - exp( -gl_FragColor.a );
    }
    // endGLSL
`;
smoothDotsVertex.vertText = smoothDotsVertex.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDotsVertex.fragText = smoothDotsVertex.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDotsVertex.init();
if (shadersReadyToInitiate) {
    currentProgram = smoothDotsVertex.program;
    gl.useProgram(currentProgram);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
}

// Blue Zig Zag, the original
smoothDotsVertex.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float vertexID;
    uniform vec2 resolution;
    uniform float time;
    varying float t;
    varying float z;
    varying float osc;
    varying vec2 posUnit;
    varying float stain;
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
float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = resolution.y / resolution.x;
        float i = vertexID;
        float s = 360.;
        float x = fract(i / s);
        float y = floor(i / s) / s;
        x = map(x, 0., 1., -1., 1.);
        y = map(y, 0., 1., -1., 1.);
        float a = time * 1e-1;
        vec4 pos = vec4(x, y, 1.0, 1.0);
        pos.x += rand(pos.xy) * 0.005;
        pos.y += rand(pos.xy) * 0.005;
                // vec4 ropo = zRotate(pi*-0.25*0.) * pos;
        float zigzag = 1.;
        if (abs(sin(pos.y*10.+abs(fract(pos.x*10.)-0.5)*6.)*0.5+0.5) < 0.1) {
            zigzag = 0.0;
        }
                if (abs(cos(pi*0.5+pos.y*10.+abs(fract(pos.x*10.)-0.5)*6.)*0.5+0.5) < 0.1) {
            zigzag = 0.0;
        }
        // if (pos.x < 0.0) {
        //     pos = yRotate(-0.1) * pos;
        // } else {
        //     pos = yRotate(0.1) * pos;
        // }
        
        pos = translate(0.0, 0.0, sin(pos.x*10.)*0.1) * pos;
        osc = (sin(pos.z * 3e1 + a + sin(pos.y*1.)*0.2) *0.5 + 0.5) * 0.1;
        pos = translate(0.0, 0.0, osc) * pos;
        pos = xRotate(-0.2) * pos;
        // pos = translate(0.0, 0.0, sin(pos.x*1.)*0.4) * pos;
        pos = translate(0.0, 0.0, sin(pos.y*1.+time*1e-1)*0.1) * pos;
        
        // pos = yRotate(0.4) * pos;
        // pos = translate(0.0, (sin(pos.x * 2e1 + a) *0.5 + 0.5) * 0.1, 0.0) * pos;
        pos.xy *= 1.5;
        pos.x *= ratio;
        pos.x = pos.x * 1.2;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
                gl_Position.y += 0.1;
        // gl_Position.x += cos(time*4e-3+729.99) * 2.;
        gl_Position.y += 0.3;
        gl_PointSize = 4./pos.z;
        gl_PointSize += (cos(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*2.;
        if (abs(pos.x) < 0.1) {
            gl_PointSize = 0.0;
        }
        gl_PointSize *= zigzag;
        // vec4 ropo = zRotate(pi*-0.25) * pos;
        // if (abs(sin(ropo.y*10.+abs(fract(ropo.x*5.)-0.5)*6.)*0.5+0.5) < 0.1) {
        //     gl_PointSize = 0.0;
        // }
        z = pos.z;
        posUnit = pos.xy;
        t = time;
        stain = cloudEffect(pos.xy * vec2(30.,2.) + vec2(1.5, 0.)).r;
    }
    // endGLSL
`;
smoothDotsVertex.fragText = `
    // beginGLSL
    precision mediump float;
    varying float t;
    varying float z;
    varying float osc;
    varying vec2 posUnit;
    varying float stain;
    ${blendingMath}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        distSquared = smoothstep(0., 1., distSquared);
        float hl = pow(distSquared, 8.)* 0.4;
        gl_FragColor = vec4(vec3(1.0, hl,hl), distSquared * 0.75 - pow(z, 12.) * 0.1);
        gl_FragColor.a -= (sin(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*0.2;
        vec2 posU = posUnit;
        // posU.x += cos(t*4e-3+729.99) * 2.;
        float light = 1.0 - length((posU - vec2(0., -0.5))*vec2(16./9., 1.)) * 0.4;
        light = smoothstep(0., 1., light) * 0.3;
        gl_FragColor.a += light;
        gl_FragColor.a *= light / 0.3;
        if (gl_FragColor.a < 0.01) {
            discard;
        }
        gl_FragColor.rgb = gl_FragColor.bgr;
        // des = min(0.6, pow(des, 0.5));
        // des = 1.0 - exp( -des );
        // des = pow(des, vec3(0.4545));
                float des = osc * 4.;
        // des = pow(des, 0.95);
        // des = smoothstep(0., 1., des);
        gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, des).rgb;
        gl_FragColor.a *= 1.0 - min(0.7, des * 2.);
        // gl_FragColor.a -= stain * 0.2;
        // gl_FragColor.a *= floor(sin(t) + 1.);
        // gl_FragColor.a = 1.0 - exp( -gl_FragColor.a );
    }
    // endGLSL
`;
smoothDotsVertex.vertText = smoothDotsVertex.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDotsVertex.fragText = smoothDotsVertex.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDotsVertex.init();
if (shadersReadyToInitiate) {
    currentProgram = smoothDotsVertex.program;
    gl.useProgram(currentProgram);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
}

}

// Stained and damaged
smoothDotsVertex.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float vertexID;
    uniform vec2 resolution;
    uniform float time;
    varying float t;
    varying float z;
    varying float osc;
    varying vec2 posUnit;
    varying float stain;
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
float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = resolution.y / resolution.x;
        float i = vertexID;
        float s = 360.;
        float x = fract(i / s);
        float y = floor(i / s) / s;
        x = map(x, 0., 1., -1., 1.);
        y = map(y, 0., 1., -1., 1.);
        float a = time * 1e-1;
        vec4 pos = vec4(x, y, 1.0, 1.0);
        pos.x += rand(pos.xy) * 0.005;
        pos.y += rand(pos.xy) * 0.005;
        vec4 ropo = pos;
        ropo *= 2.5;
        // ropo.x += 0.0;
        ropo = zRotate(pi*-0.25) * ropo;
        // ropo.x *= 4.;
        float zigzag = 1.;
        if (sin(length(fract((ropo.xy*sin(ropo.x*10.)))-vec2(0.5))*30.) > 0.9) {
            // zigzag = 0.0;
        }
        // if (abs(cos(pi*0.5+ropo.x*16.)*0.5+0.5) < 0.1 && 
        //     abs(cos(pi*0.5+ropo.y*16.)*0.5+0.5) < 0.1) {
        //     zigzag = 1.0;
        // }
        // if (pos.x < 0.0) {
        //     pos = yRotate(-0.1) * pos;
        // } else {
        //     pos = yRotate(0.1) * pos;
        // }
        
        pos = translate(0.0, 0.0, sin(pos.x*10.)*0.1) * pos;
        osc = (sin(pos.z * 3e1 + a + sin(pos.y*1.)*0.2) *0.5 + 0.5) * 0.1;
        pos = translate(0.0, 0.0, osc) * pos;
        pos = xRotate(-0.2) * pos;
        // pos = translate(0.0, 0.0, sin(pos.x*1.)*0.4) * pos;
        pos = translate(0.0, 0.0, sin(pos.y*1.+time*1e-1)*0.1) * pos;
        
        // pos = yRotate(0.4) * pos;
        // pos = translate(0.0, (sin(pos.x * 2e1 + a) *0.5 + 0.5) * 0.1, 0.0) * pos;
        pos.xy *= 1.5;
        pos.x *= ratio;
        pos.x = pos.x * 1.2;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
                gl_Position.y += 0.1;
        // gl_Position.x += cos(time*4e-3+729.99) * 2.;
        gl_Position.y += 0.3;
        gl_PointSize = 4./pos.z;
        gl_PointSize += (cos(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*2.;
        if (abs(pos.x) < 0.105) {
            gl_PointSize = 0.0;
        }
        gl_PointSize *= zigzag;
        // vec4 ropo = zRotate(pi*-0.25) * pos;
        // if (abs(sin(ropo.y*10.+abs(fract(ropo.x*5.)-0.5)*6.)*0.5+0.5) < 0.1) {
        //     gl_PointSize = 0.0;
        // }
        z = pos.z;
        posUnit = pos.xy;
        t = time;
        
        stain = cloudEffect(pos.xy * vec2(30.,2.) + vec2(1.5, 0.)).r;
    }
    // endGLSL
`;
smoothDotsVertex.fragText = `
    // beginGLSL
    precision mediump float;
    varying float t;
    varying float z;
    varying float osc;
    varying vec2 posUnit;
    varying float stain;
    ${blendingMath}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        distSquared = smoothstep(0., 1., distSquared);
        float hl = pow(distSquared, 8.)* 0.5;
        gl_FragColor = vec4(vec3(1.0, hl,hl), distSquared * 0.75 - pow(z, 12.) * 0.1);
        gl_FragColor.a -= (sin(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*0.2;
        vec2 posU = posUnit;
        // posU.x += cos(t*4e-3+729.99) * 2.;
        float light = 1.0 - length((posU - vec2(0., -0.5))*vec2(16./9., 1.)) * 0.4;
        light = smoothstep(0., 1., light) * 0.3;
        gl_FragColor.a += light;
        gl_FragColor.a *= light / 0.3;
        if (gl_FragColor.a < 0.01) {
            discard;
        }
        gl_FragColor.rgb = gl_FragColor.bgr;
        // des = min(0.6, pow(des, 0.5));
        // des = 1.0 - exp( -des );
        // des = pow(des, vec3(0.4545));
                float des = osc * 4.;
        // des = pow(des, 0.95);
        // des = smoothstep(0., 1., des);
        gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, des).rgb;
        gl_FragColor.a *= 1.0 - min(0.7, des * 2.);
        // gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 2.);
        // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 1.3);
        
        gl_FragColor.a -= stain * 0.7;
        // gl_FragColor.a *= floor(sin(t) + 1.);
        // gl_FragColor.a = 1.0 - exp( -gl_FragColor.a );
    }
    // endGLSL
`;
smoothDotsVertex.vertText = smoothDotsVertex.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDotsVertex.fragText = smoothDotsVertex.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDotsVertex.init();
if (shadersReadyToInitiate) {
    currentProgram = smoothDotsVertex.program;
    gl.useProgram(currentProgram);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
}

// Torn, stained and damaged
smoothDotsVertex.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float vertexID;
    uniform vec2 resolution;
    uniform float time;
    varying float t;
    varying float z;
    varying float osc;
    varying vec2 posUnit;
    varying float stain;
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
float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = resolution.y / resolution.x;
        float i = vertexID;
        float s = 360.;
        float x = fract(i / s);
        float y = floor(i / s) / s;
        x = map(x, 0., 1., -1., 1.);
        y = map(y, 0., 1., -1., 1.);
        float a = time * 1e-1;
        vec4 pos = vec4(x, y, 1.0, 1.0);
        pos.x += rand(pos.xy) * 0.005;
        pos.y += rand(pos.xy) * 0.005;
        vec4 ropo = pos;
        ropo *= 2.5;
        // ropo.x += 0.0;
        ropo = zRotate(pi*-0.25) * ropo;
        // ropo.x *= 4.;
        float zigzag = 1.;
        if (sin(length(fract((ropo.xy*sin(ropo.x*10.)))-vec2(0.5))*30.) > 0.9) {
            // zigzag = 0.0;
        }
        // if (abs(cos(pi*0.5+ropo.x*16.)*0.5+0.5) < 0.1 && 
        //     abs(cos(pi*0.5+ropo.y*16.)*0.5+0.5) < 0.1) {
        //     zigzag = 1.0;
        // }
        // if (pos.x < 0.0) {
        //     pos = yRotate(-0.1) * pos;
        // } else {
        //     pos = yRotate(0.1) * pos;
        // }
        stain = cloudEffect(pos.xy * vec2(30.,2.) + vec2(1.5, 0.)).r;
        
        pos = translate(0.0, 0.0, sin(pos.x*10.)*0.1) * pos;
        osc = (sin(pos.z * 3e1 + a + sin(pos.y*1.)*0.2) *0.5 + 0.5) * 0.1;
        pos = translate(0.0, 0.0, osc) * pos;
        pos = xRotate(-0.2) * pos;
        // pos = translate(0.0, 0.0, sin(pos.x*1.)*0.4) * pos;
        pos = translate(0.0, 0.0, sin(pos.y*1.+time*1e-1)*0.1) * pos;
        
        // pos = yRotate(0.4) * pos;
        // pos = translate(0.0, (sin(pos.x * 2e1 + a) *0.5 + 0.5) * 0.1, 0.0) * pos;
        pos.xy *= 1.5;
        pos.x *= ratio;
        pos.x = pos.x * 1.2;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
                gl_Position.y += 0.1;
        // gl_Position.x += cos(time*4e-3+729.99) * 2.;
        gl_Position.y += 0.3;
        gl_PointSize = 4./pos.z;
        gl_PointSize += (cos(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*2.;
        if (abs(pos.x) < 0.105) {
            gl_PointSize = 0.0;
        }
        gl_PointSize *= zigzag;
        // vec4 ropo = zRotate(pi*-0.25) * pos;
        // if (abs(sin(ropo.y*10.+abs(fract(ropo.x*5.)-0.5)*6.)*0.5+0.5) < 0.1) {
        //     gl_PointSize = 0.0;
        // }
        z = pos.z;
        posUnit = pos.xy;
        t = time;
        
        if (stain > 0.1) {
            gl_PointSize = 0.0;
        }
    }
    // endGLSL
`;
smoothDotsVertex.fragText = `
    // beginGLSL
    precision mediump float;
    varying float t;
    varying float z;
    varying float osc;
    varying vec2 posUnit;
    varying float stain;
    ${blendingMath}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        distSquared = smoothstep(0., 1., distSquared);
        float hl = pow(distSquared, 8.)* 0.5;
        gl_FragColor = vec4(vec3(1.0, hl,hl), distSquared * 0.75 - pow(z, 12.) * 0.1);
        gl_FragColor.a -= (sin(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*0.2;
        vec2 posU = posUnit;
        // posU.x += cos(t*4e-3+729.99) * 2.;
        float light = 1.0 - length((posU - vec2(0., -0.5))*vec2(16./9., 1.)) * 0.4;
        light = smoothstep(0., 1., light) * 0.3;
        gl_FragColor.a += light;
        gl_FragColor.a *= light / 0.3;
        if (gl_FragColor.a < 0.01) {
            discard;
        }
        gl_FragColor.rgb = gl_FragColor.bgr;
        // des = min(0.6, pow(des, 0.5));
        // des = 1.0 - exp( -des );
        // des = pow(des, vec3(0.4545));
                float des = osc * 4.;
        // des = pow(des, 0.95);
        // des = smoothstep(0., 1., des);
        gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, des).rgb;
        gl_FragColor.a *= 1.0 - min(0.7, des * 2.);
        // gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 2.);
        // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 1.3);
        
        gl_FragColor.a -= stain * 0.7;
        // gl_FragColor.a *= floor(sin(t) + 1.);
        // gl_FragColor.a = 1.0 - exp( -gl_FragColor.a );
    }
    // endGLSL
`;
smoothDotsVertex.vertText = smoothDotsVertex.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDotsVertex.fragText = smoothDotsVertex.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDotsVertex.init();
if (shadersReadyToInitiate) {
    currentProgram = smoothDotsVertex.program;
    gl.useProgram(currentProgram);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
}

let smoothDots3D = new ShaderProgram("smooth-dots-3D");

smoothDots3D.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float t;
    varying vec4 pos;
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    void main(void) {
        float ratio = resolution.y / resolution.x;
        pos = vec4(coordinates.xyz, 1.);
        // pos = translate(0.0, 0., 0.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -0.5) * pos;
        pos = translate(0.0, 0.0, 2.0) * xRotate(cos(time*1e-1)*0.05) * yRotate(sin(time*1e-1)*0.05) * translate(0.0, 0.0, -2.0)  * pos;
        // pos = translate(0.0, 0.0, 2.0) * zRotate((time*1e-1)) * translate(0.0, 0.0, -2.0)  * pos;
        // pos =  * pos;
        pos.z += 0.5;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_PointSize = 25. * coordinates.w;
        t = time;
        // gl_PointSize += (sin((length(coordinates*20.)*0.2-time*2e-1))*0.5+0.5)*14.;
    }
    // endGLSL
`;
smoothDots3D.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    varying vec4 pos;
    ${mapFunction}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        vec2 uv = gl_PointCoord;
        float distSquared = 1.0 - dot(uv - 0.5, uv - 0.5) * 0.5;
        float l = 1.0 - length(uv - vec2(0.5)) * 4.;
        // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // l += distSquared * 0.25;
        distSquared -= 1.2;
        l += (distSquared - (l * distSquared));
        float halo = (1.0 - length(uv - vec2(0.5)) * 2.)*0.5;
        l = smoothstep(0., 1., l);
        l = pow(l, 3.);
        float scan = map(sin(pos.y*2.+t*0.5), -1., 1., 0.2, 1.0);
        float noise = rand(uv - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.75, 0.25), (l+halo-noise)*0.5);
        // gl_FragColor.rgb = gl_FragColor.gbr;
    }
    // endGLSL
`;
smoothDots3D.vertText = smoothDots3D.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots3D.fragText = smoothDots3D.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots3D.init();

if (false) {

// A version of smoothDots3D that adjusts the dot size according to its Z value
smoothDots3D.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float t;
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = resolution.y / resolution.x;
        vec4 pos = vec4(coordinates.xyz, 1.);
        // pos = translate(0.0, 0., 0.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -0.5) * pos;
        // pos.xyz *= map(sin(time *1e-1+pos.y*2.), -1., 1., 0.95, 1.0);
        // pos = yRotate(-time*0.5e-2) * pos;
        // pos = xRotate(-time*0.5e-2) * pos;
        // pos = translate(0.0, 0.0, 1.5) * pos;
        // pos = rotate()
        pos = zRotate(time*0.5e-2) * pos;
        pos = translate(0.5, 0.0, 0.0) * pos;
        pos.x *= ratio;
        // pos.xy *= 0.05;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_PointSize = 45. / pos.z * coordinates.w;
        // gl_PointSize += (sin((length(coordinates*20.)*0.2-time*2e-1))*0.5+0.5)*14.;
    }
    // endGLSL
`;
smoothDots3D.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 0.5;
        float l = 1.0 - length(pos - vec2(0.5)) * 4.;
        // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // l += distSquared * 0.25;
        distSquared -= 1.2;
        l += (distSquared - (l * distSquared));
        float halo = (1.0 - length(pos - vec2(0.5)) * 2.)*0.5;
        l = smoothstep(0., 1., l);
        l = pow(l, 3.);
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.25, 0.25), (l+halo-noise)*0.5);
        // gl_FragColor.rgb = gl_FragColor.bgr;
    }
    // endGLSL
`;
smoothDots3D.vertText = smoothDots3D.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots3D.fragText = smoothDots3D.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots3D.init();

}