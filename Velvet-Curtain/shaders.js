let smoothDotsVertex = new ShaderProgram("smooth-dots-vertex");

smoothDotsVertex.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform vec2 resolution;
    uniform float time;
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
        float s = 240.;
        float x = fract(i / s);
        float y = floor(i / s) / s;
        x = map(x, 0., 1., -1., 1.);
        y = map(y, 0., 1., -1., 1.);
        float a = time * 1e-1;
        vec4 pos = vec4(x, y, 1.0, 1.0);
        pos = translate(0.0, 0.0, 3.0) * pos;
        pos = translate(0.0, 0.0, 3.0) * yRotate(a) * translate(0.0, 0.0, -3.0) * pos;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_PointSize = 4.;
    }
    // endGLSL
`;
smoothDotsVertex.fragText = `
    // beginGLSL
    precision mediump float;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        gl_FragColor = vec4(vec3(1.0), distSquared);
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

drawCount = 0;
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
        pos.x += rand(pos.xy) * 0.01;
        pos.y += rand(pos.xy) * 0.01;
        
        pos = yRotate(0.4) * pos;
        // pos = translate(0.0, 1.1, 0.5) * xRotate(pi * 1.75) * pos;
        osc = (sin(pos.x * 3e1 + a + sin(pos.y*1.)*0.2) *0.5 + 0.5) * 0.1;
        pos = translate(0.0, 0.0, osc) * pos;
        pos = xRotate(-0.1) * pos;
        // pos = translate(0.0, 0.0, sin(pos.y*10.)) * pos;
        pos = translate(0.0, 0.0, sin(pos.y*1.+time*1e-1)*0.1) * pos;
        
        // pos = yRotate(0.4) * pos;
        // pos = translate(0.0, (sin(pos.x * 2e1 + a) *0.5 + 0.5) * 0.1, 0.0) * pos;
        pos.xy *= 1.8;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_Position.x += cos(time*4e-3+729.99) * 2.;
        gl_PointSize = 4./pos.z;
        z = pos.z;
        posUnit = pos.xy;
        t = time;
        gl_PointSize += (cos(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*2.;
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
        posU.x += cos(t*4e-3+729.99) * 2.;
        float light = 1.0 - length((posU - vec2(0., -0.5))*vec2(16./9., 1.)) * 0.4;
        light = smoothstep(0., 1., light) * 0.3;
        gl_FragColor.a += light;
        gl_FragColor.a *= light / 0.3;
        gl_FragColor.rgb = gl_FragColor.bgr;
        if (gl_FragColor.a < 0.01) {
            discard;
        }
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

drawCount = 0;
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
        
        // pos = yRotate(0.4) * pos;
        // pos = translate(0.0, 1.1, 0.5) * xRotate(pi * 1.75) * pos;
        osc = (sin(pos.x * 3e1 + a + sin(pos.y*1.)*0.2) *0.5 + 0.5) * 0.1;
        pos = translate(0.0, 0.0, osc) * pos;
        pos = xRotate(-0.1) * pos;
        // pos = translate(0.0, 0.0, sin(pos.y*10.)) * pos;
        pos = translate(0.0, 0.0, sin(pos.y*1.+time*1e-1)*0.1) * pos;
        // pos = translate(0.0, 0.0, dot((pos.xy + 0.5)*5., (pos.xy - 0.75)*5.)*0.01) * pos;
        // pos = yRotate(0.4) * pos;
        // pos = translate(0.0, (sin(pos.x * 2e1 + a) *0.5 + 0.5) * 0.1, 0.0) * pos;
        pos.xy *= 1.6;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_Position.y += cos(time*4e-3+729.99) * 2.;
        gl_PointSize = 3./pos.z;
        z = pos.z;
        posUnit = pos.xy;
        t = time;
        gl_PointSize += (cos(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*2.;
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
        float light = 1.0 - length((posUnit - vec2(0., -0.75))*vec2(16./9., 1.)) * 0.4;
        light = smoothstep(0., 1., light) * 0.3;
        gl_FragColor.a += light;
        gl_FragColor.a *= light / 0.3 * 0.5;
        // gl_FragColor.rgb = gl_FragColor.bgr;
        gl_FragColor.a = pow(max(0., gl_FragColor.a), 2.) * 4.;
        if (gl_FragColor.a < 0.01) {
            discard;
        }
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

drawCount = 0;
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
        
        pos = yRotate(0.4) * pos;
        // pos = translate(0.0, 1.1, 0.5) * xRotate(pi * 1.75) * pos;
        osc = (sin(pos.x * 3e1 + a + sin(pos.y*1.)*0.2) *0.5 + 0.5) * 0.1;
        pos = translate(0.0, 0.0, osc) * pos;
        pos = xRotate(-0.1) * pos;
        // pos = translate(0.0, 0.0, sin(pos.y*10.)) * pos;
        pos = translate(0.0, 0.0, sin(pos.y*1.+time*1e-1)*0.1) * pos;
        
        // pos = yRotate(0.4) * pos;
        // pos = translate(0.0, (sin(pos.x * 2e1 + a) *0.5 + 0.5) * 0.1, 0.0) * pos;
        pos.xy *= 1.8;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_Position.x += cos(time*4e-3+729.99) * 2.;
        gl_PointSize = 4./pos.z;
        z = pos.z;
        posUnit = pos.xy;
        t = time;
        gl_PointSize += (cos(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*2.;
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
        vec2 posU = posUnit;
        posU.x += cos(t*4e-3+729.99) * 2.;
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

drawCount = 0;
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
        
        if (pos.x < 0.0) {
            pos = yRotate(-0.9) * pos;
        } else {
            pos = yRotate(0.9) * pos;
        }
        
        // pos = translate(0.0, 1.1, 0.5) * xRotate(pi * 1.75) * pos;
        osc = (sin(pos.z * 3e1 + a + sin(pos.y*1.)*0.2) *0.5 + 0.5) * 0.1;
        pos = translate(0.0, 0.0, osc) * pos;
        pos = xRotate(-0.1) * pos;
        // pos = translate(0.0, 0.0, sin(pos.y*10.)) * pos;
        pos = translate(0.0, 0.0, sin(pos.y*1.+time*1e-1)*0.1) * pos;
        
        // pos = yRotate(0.4) * pos;
        // pos = translate(0.0, (sin(pos.x * 2e1 + a) *0.5 + 0.5) * 0.1, 0.0) * pos;
        pos.xy *= 1.5;
        pos.x *= ratio;
        // pos.x = pos.x * -1.;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
                gl_Position.y += 0.1;
        // gl_Position.x += cos(time*4e-3+729.99) * 2.;
        // gl_Position.y += 1.4;
        gl_PointSize = 4./pos.z;
        gl_PointSize += (cos(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*2.;
        if (abs(pos.x) < 0.2) {
            gl_PointSize = 0.0;
        }
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

drawCount = 0;
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
        vec4 ropo = zRotate(pi*-0.25*0.) * pos;
        if (abs(sin(ropo.y*10.+abs(fract(ropo.x*10.)-0.5)*6.)*0.5+0.5) < 0.1) {
            gl_PointSize = 0.0;
        }
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

drawCount = 0;
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
        vec4 ropo = zRotate(pi*-0.25*0.) * pos;
        if (abs(sin(ropo.y*10.+abs(fract(ropo.x*10.)-0.5)*6.)*0.5+0.5) < 0.1) {
            gl_PointSize = 0.0;
        }
                if (abs(cos(pi*0.5+ropo.y*10.+abs(fract(ropo.x*10.)-0.5)*6.)*0.5+0.5) < 0.1) {
            gl_PointSize = 0.0;
        }
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

// Blue Zig Zag, more swaying
drawCount = 0;
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
        pos = translate(0.0, 0.0, map(sin(pos.y*2.),-1., 1., 0., (pos.y-1.)*-0.1)) * pos;
        pos = translate(0.0, 0.0, map(sin(pos.y*10.+time*2e-1),-1., 1., 0., (pos.y-1.)*-0.1)*0.1) * pos;
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

// Blue Zig Zag, the original
drawCount = 0;
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

// Red animal pattern, harsher light
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
        float light = 1.0 - length((posUnit - vec2(0., -1.))*vec2(16./9., 1.)) * 0.4;
        light = smoothstep(0., 1., light) * 0.3;
        gl_FragColor.a += light;
        gl_FragColor.a *= light / 0.3 * 0.5;
        // gl_FragColor.rgb = gl_FragColor.bgr;
        gl_FragColor.a = pow(max(0., gl_FragColor.a), 2.) * 4.;
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

drawCount = 0;
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
        
        // pos = yRotate(0.4) * pos;
        // pos = translate(0.0, 1.1, 0.5) * xRotate(pi * 1.75) * pos;
        osc = (sin(pos.x * 3e1 + a + sin(pos.y*1.)*0.2) *0.5 + 0.5) * 0.1;
        pos = translate(0.0, 0.0, osc) * pos;
        pos = xRotate(-0.1) * pos;
        // pos = translate(0.0, 0.0, sin(pos.y*10.)) * pos;
        pos = translate(0.0, 0.0, sin(pos.y*1.+time*1e-1)*0.1) * pos;
        // pos = translate(0.0, 0.0, dot((pos.xy + 0.5)*5., (pos.xy - 0.75)*5.)*0.01) * pos;
        // pos = yRotate(0.4) * pos;
        // pos = translate(0.0, (sin(pos.x * 2e1 + a) *0.5 + 0.5) * 0.1, 0.0) * pos;
        pos.xy *= 1.6;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_Position.y += cos(time*4e-3+729.99) * 2. + 0.02;
        gl_PointSize = 3./pos.z;
        z = pos.z;
        posUnit = pos.xy;
        t = time;
        gl_PointSize += (cos(-t*0.0125+(posUnit.x*81e1+posUnit.y*31e1))*0.5+0.5)*2.;
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
        float light = 1.0 - length((posUnit - vec2(0., -1.))*vec2(16./9., 1.)) * 0.4;
        light = smoothstep(0., 1., light) * 0.3;
        gl_FragColor.a += light;
        gl_FragColor.a *= light / 0.3 * 0.5;
        // gl_FragColor.rgb = gl_FragColor.bgr;
        gl_FragColor.a = pow(max(0., gl_FragColor.a), 2.) * 4.;
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

if (false) {

smoothDotsVertex.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float vertexID;
    uniform vec2 resolution;
    uniform float time;
    varying float z;
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
        float s = 240.;
        float x = cos(i * 4e-2+time*1e-2) * i / pow(240., 2.);
        float y = sin(i * 4e-2+time*1e-2) * i / pow(240., 2.);
        float a = time * 1e-1;
        vec4 pos = vec4(x, y, 1.0, 1.0);
        pos = translate(0.0, 1.1, 0.1) * xRotate(pi * 1.8) * pos;
        pos = translate(0.0, ((sin(length(vec2(x,y))*4e1-(time*2e-1)))*0.5+0.5)*0.025, 0.0) * pos;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_PointSize = 4. - pow(pos.z, 3.) * 0.5;
        z = pos.z;
    }
    // endGLSL
`;
smoothDotsVertex.fragText = `
    // beginGLSL
    precision mediump float;
    varying float z;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        gl_FragColor = vec4(vec3(1.0), distSquared * 0.5 / z);
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

smoothDotsVertex.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float vertexID;
    uniform vec2 resolution;
    uniform float time;
    varying float z;
    const mat2 mr = mat2 (
        0.84147,  0.54030,
        0.54030, -0.84147
    );
    float hash(in float n) {
      return fract(sin(n) * 43758.5453);
    }
    float noise(in vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);  
        float n = p.x + p.y * 57.0;
        float res = mix(
              mix(hash(n +  0.0), hash(n +  1.0), f.x),
              mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
        return res;
    }
    float fbm( in vec2 p ) {
        float f;
        f  = 0.5000 * noise(p); p = mr * p * 2.02;
        f += 0.2500 * noise(p); p = mr * p * 2.33;
        f += 0.1250 * noise(p); p = mr * p * 2.01;
        f += 0.0625 * noise(p); p = mr * p * 5.21;
        return f / (0.9375) * smoothstep(260., 768., p.y); // flat at beginning
    }
    float rand(vec2 co){
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453 * (2.0 + sin(co.x)));
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
        float s = 240.;
        float x = fract(i / s);
        float y = floor(i / s) / s;
        x = map(x, 0., 1., -1., 1.);
        y = map(y, 0., 1., -1., 1.);
        float a = time * 1e-2;
        vec4 pos = vec4(x, y, 1.0, 1.0);
        vec4 pos2 = vec4(pos);
        pos2 = zRotate(pi * 0.25) * pos2;
        pos.z = pos.z + fbm((vec2(pos2.x, pos2.y) + a) * 2.5) * 0.5;
        pos = translate(0.0, 1.1, 0.5) * xRotate(pi * 1.75) * pos;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_PointSize = 4. - (pos.z * 0.5);
        z = pos.z;
    }
    // endGLSL
`;
smoothDotsVertex.fragText = `
    // beginGLSL
    precision mediump float;
    varying float z;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        gl_FragColor = vec4(vec3(1.0), distSquared * 0.5 / pow(z, 3.));
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