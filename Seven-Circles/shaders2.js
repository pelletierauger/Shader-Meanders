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
        float l2 = l;
        l = smoothstep(0., 1., l);
        l2 = smoothstep(0., 1., l2);
        l2 = smoothstep(0., 1., l2);
        l2 = smoothstep(0., 1., l2);
        l = mix(l, l2, c.a*2.);
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