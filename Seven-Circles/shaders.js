let smoothDots = new ShaderProgram("smooth-dots");

smoothDots.vertText = `
    // beginGLSL
    attribute vec3 position;
    attribute vec4 color;
    varying vec4 c;
    void main(void) {
        gl_Position = vec4(position, 1.0);
        gl_PointSize = 256.;
        c = color;
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    uniform vec2 resolution;
    uniform float time;
    varying vec4 c;
    ${mapFunction}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        vec2 uv = gl_FragCoord.xy / resolution;
        uv -= vec2(0.5);
        uv.x *= resolution.x / resolution.y;
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float noise = rand(pos) * 0.025;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        float l = length(pos - vec2(0.5)) * 1.5;
        l = abs(l - 0.5) + 0.5;
        l = 1. - l;
        l = smoothstep(0., 1., l);
        l = smoothstep(0., 1., l);
        l = smoothstep(0., 1., l);
        l = pow(l, 2.) * 4.;
        vec3 col = c.rgb;
        col = mix(col, vec3(1.0), pow(l, 19.)*0.25);
        gl_FragColor = vec4(col, l * min(1.,c.a*25.) - noise);
        gl_FragColor.a *= map(sin(uv.y * 50. + time * 0.25), -1., 1., 0.75, 1.0);
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

let smoothDots2 = new ShaderProgram("smooth-dots-2");

smoothDots2.vertText = `
    // beginGLSL
    attribute vec3 position;
    attribute vec4 color;
    varying vec4 c;
    void main(void) {
        gl_Position = vec4(position, 1.0);
        gl_PointSize = 256.;
        c = color;
    }
    // endGLSL
`;
smoothDots2.fragText = `
    // beginGLSL
    precision mediump float;
    uniform vec2 resolution;
    uniform float time;
    varying vec4 c;
    ${mapFunction}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 uv = gl_FragCoord.xy / resolution;
        vec2 pos = gl_PointCoord;
        float noise = rand(pos) * 0.025;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        float l = length(pos - vec2(0.5)) * 1.5;
        // l = abs(l - 0.5) + 0.5;
        l = 1. - l;
        l = smoothstep(0., 1., l);
        l = smoothstep(0., 1., l);
        l = smoothstep(0., 1., l);
        l = pow(l, 2.) * 4.;
        vec3 col = c.rgb;
        col = mix(col, vec3(1.0, 1., 1.0), pow(l, 1.)*0.05);
        gl_FragColor = vec4(col, l * c.a - noise);
        gl_FragColor.a *= map(sin(uv.y * 10. + time * 0.5), -1., 1., 0.75, 1.0);
        float wave = map(sin(length(pos-vec2(0.5)) * 200. * (pow(c.a, 0.25)) + sin(c.a*10.)), -1., 1., 0.65, 1.0);
        wave = smoothstep(0., 1., wave);
                wave = smoothstep(0., 1., wave);
        gl_FragColor.a -= wave;
    }
    // endGLSL
`;
smoothDots2.vertText = smoothDots2.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots2.fragText = smoothDots2.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots2.init();
if (shadersReadyToInitiate) {
    currentProgram = smoothDots2.program;
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
