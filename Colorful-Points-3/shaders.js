let smoothDots = new ShaderProgram("smooth-dots");

smoothDots.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute vec3 position;
    attribute vec4 color;
    uniform float time;
    varying vec4 c;
    varying float l;
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
        vec4 pos = vec4(position.x, position.y, position.z, 1.0);
        float a = pi * -0.5;
        pos = translate(0.0, 0.0, 2.25) * pos;
        pos = translate(0.0, 0.0, 2.25) * xRotate(a) * translate(0.0, 0.0, -2.25) * pos;
        pos = translate(0.0, 0.0, 2.25) * yRotate(time*-1e-2) * translate(0.0, 0.0, -2.25) * pos;
        // pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, pos.z - 1., pos.z);
        // gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_PointSize = 6.;
        c = color;
        l = length((translate(0.0, 0.0, -24.25) * pos) - pos);
        // l = 0.1;
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    uniform vec2 resolution;
    varying vec4 c;
    varying float l;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        gl_FragColor = vec4(c.r, c.g, c.b, c.a * distSquared * (l * 0.02));
        // if (gl_FragColor.a < 0.5) {
        //     discard;
        // }
    }
    // endGLSL
`;
smoothDots.vertText = smoothDots.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots.fragText = smoothDots.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots.init();
if (shadersReadyToInitiate) {
    currentProgram = smoothDots.program;
    gl.useProgram(currentProgram);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
}

if (false) {

// Defining the colors of the dots inside the vertex shader.
smoothDots.vertText = `
    // beginGLSL
    attribute vec3 position;
    attribute vec4 color;
    varying vec4 c;
    void main(void) {
        gl_Position = vec4(position, 1.0);
        gl_PointSize = 6.;
        vec2 pos = gl_Position.xy + vec2(0.5);
        c = vec4(pos.x, pos.y, 1.0 - pos.x, 1.0);
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        gl_FragColor = vec4(c.r, c.g, c.b, c.a * distSquared);
    }
    // endGLSL
`;
smoothDots.vertText = smoothDots.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots.fragText = smoothDots.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots.init();
currentProgram = smoothDots.program;
gl.useProgram(currentProgram);
resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);

// Defining the colors of the dots inside the vertex shader.
smoothDots.vertText = `
    // beginGLSL
    precision mediump float;
    #define pi 3.1415926535897932384626433832795
    attribute vec3 position;
    attribute vec4 color;
    uniform vec2 resolution;
    varying vec4 c;
    void main(void) {
        gl_Position = vec4(position, 1.0);
        gl_PointSize = 6.;
        vec2 pos = gl_Position.xy;
        float ratio = (resolution.y / resolution.x);
        pos.x /= ratio;
        c = vec4(vec3(0.0), 1.0);
        c.r = 1.0 - length(pos);
        c.g = abs(atan(pos.y, pos.x) / pi);
        c.b = sin(c.r * 19. + 3.) * 0.5 + 0.5;
        c.r *= 1.125;
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        gl_FragColor = vec4(c.r, c.g, c.b, c.a * distSquared);
    }
    // endGLSL
`;
smoothDots.vertText = smoothDots.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots.fragText = smoothDots.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots.init();
currentProgram = smoothDots.program;
gl.useProgram(currentProgram);
resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);

}

smoothDots.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute vec3 position;
    attribute vec4 color;
    uniform float time;
    varying vec4 c;
    varying float l;
    const mat2 mr = mat2 (
        0.84147,  0.54030,
        0.54030, -0.84147
    );
    float hash(in float n) {
      return fract(sin(n)*43758.5453);
    }
    float noise(in vec2 x) {
        vec2 p = floor(x);
        vec2 f = fract(x);
        f = f*f*(3.0-2.0*f);  
        float n = p.x + p.y*57.0;
        float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
              mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
        return res;
    }
    float fbm( in vec2 p ) {
        float f;
        f  = 0.5000*noise( p ); p = mr*p*2.02;
        f += 0.2500*noise( p ); p = mr*p*2.33;
        f += 0.1250*noise( p ); p = mr*p*2.01;
        f += 0.0625*noise( p ); p = mr*p*5.21;
        return f/(0.9375)*smoothstep( 260., 768., p.y ); // flat at beginning
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
        vec4 pos = vec4(position.x, position.y, position.z, 1.0);
        // pos.z = pos.z + fbm((vec2(pos.x, pos.y) + 10.0) * 1. + 5990. * 0.0625e-1) * 1. - 0.;
        float a = pi * -0.5;
        pos = translate(0.0, 0.0, 2.) * pos;
        c = color;
        // float lightZ = map(sin(time * 0.5e-1), -1., 1., 1., 3.);
        // float lightX = map(sin(time * 2e-1), -1., 1., 1., 3.);
        // l = 1.0 - (length(vec4(0., 0., lightZ, 1.) - pos));
        // pos = translate(0.0, 0.0, 2.25) * xRotate(a) * translate(0.0, 0.0, -2.25) * pos;
        // pos = translate(0.0, 0.0, 2.25) * yRotate(time*-1e-2) * translate(0.0, 0.0, -2.25) * pos;
        // pos = translate(0.0, (sin(pos.x * 2e2) *0.5 + 0.5) * 0.1, 0.0) * pos;
        // pos = translate(0.0, 0.0, 2.25) * xRotate(time*-1e-2) * translate(0.0, 0.0, -2.25) * pos;
        // pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, pos.z - 1., pos.z);
        // gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_PointSize = 4.;
}
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    uniform vec2 resolution;
    varying vec4 c;
    varying float l;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        distSquared = max(0.0, distSquared);
        gl_FragColor = vec4(c.r, c.g, c.b, c.a * distSquared);
        // if (gl_FragColor.a < 0.5) {
        //     discard;
        // }
    }
    // endGLSL
`;
smoothDots.vertText = smoothDots.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots.fragText = smoothDots.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots.init();
if (shadersReadyToInitiate) {
    currentProgram = smoothDots.program;
    gl.useProgram(currentProgram);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
}

