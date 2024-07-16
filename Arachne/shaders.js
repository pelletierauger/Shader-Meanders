let smoothLine = new ShaderProgram("smooth-line");

smoothLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute vec4 coordinates;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(0., 0.);
        vec2 pos0 = coordinates.xy;
        vec2 pos1 = coordinates.zw;
        // pos0 += vec2(
        //     cos(pos0.x*pos0.y*4.+time*0.1*sign(pos0.x*pos0.y*4.)), 
        //     sin(pos1.x*pos1.y*4.+time*0.1*sign(pos1.x*pos1.y*4.)))*0.01;
        // pos1 += vec2(
        //     cos(pos0.x*pos0.y*4.+time*0.1*sign(pos0.x*pos0.y*4.)), 
        //     sin(pos1.x*pos1.y*4.+time*0.1*sign(pos1.x*pos1.y*4.)))*0.01;
        // pos0 += vec2(
        //     cos(pos0.x*pos0.y*400.+time*1.1*sign(pos.x*pos0.y*400.)), 
        //     sin(pos1.x*pos1.y*400.+time*1.1*sign(pos.x*pos0.y*400.)))*0.0025;
        // pos1 += vec2(
        //     cos(pos0.x*pos0.y*400.+time*1.1*sign(pos.x*pos1.y*400.)), 
        //     sin(pos1.x*pos1.y*400.+time*1.1*sign(pos.x*pos1.y*400.)))*0.0025;
        float a = atan(pos1.y - pos0.y, pos1.x - pos0.x);
        float pi75 = pi * 0.75;
        float pi25 = pi * 0.25;
        if (index == 0.) {
            pos = pos0 + vec2(cos(a + pi75), sin(a + pi75)) * width;
        } else if (index == 1.) {
            pos = pos0 + vec2(cos(a - pi75), sin(a - pi75)) * width;
        } else if (index == 2.) {
            pos = pos1 + vec2(cos(a - pi25), sin(a - pi25)) * width;
        } else if (index == 3.) {
            pos = pos1 + vec2(cos(a + pi25), sin(a + pi25)) * width;
        }
        pos.x *= ratio;
        gl_Position = vec4(pos, 0.0, 1.0);
        wh = vec2(width * sin(pi75), length(pos1 - pos0));
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
smoothLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    void main(void) {
        vec2 fc = gl_FragCoord.xy;
        vec2 pos = gl_PointCoord;
        float rando = rand(pos+wh);
        vec2 fwh = vec2(wh.x*2., wh.y+(wh.x*2.));
        vec2 uv = uvs * fwh;
        uv -= fwh * 0.5;
        float radius = wh.x;
        vec2 size = fwh * 0.5 - radius;
        radius *= 2.;
        float col = length(max(abs(uv), size) - size) - radius;
        col = min(col * -1. * (1. / radius), 1.0);
        col = pow(col, 3.) * 0.75 + pow(col, 43.);
        col = smoothstep(0., 1., col);
        // col = mix(pow(col, 10.)*0.25, col, sin(time*0.1+pos.y*0.5e1)*0.5+0.5);
                col = mix(pow(col, 2.)*0.5, col, sin(t*0.1+pos.y*0.5e1)*0.5+0.5);
               // col = mix(pow(col, 10.)*0.2, col, sin(t*0.1+pos.y*0.5e1)*0.5+0.5);
        gl_FragColor = vec4(c.rgb, c.a * (max(col, 0.) - (rando * 0.075)));
        gl_FragColor.g = pow(col, 2.) *  0.2;
        gl_FragColor.b = pow(col, 2.) *  0.3;
        // gl_FragColor.a = min(1., gl_FragColor.a + pow(col, 2.) *  0.25);
        // gl_FragColor.rgb = gl_FragColor.gbr;
    }
    // endGLSL
`;
smoothLine.vertText = smoothLine.vertText.replace(/[^\x00-\x7F]/g, "");
smoothLine.fragText = smoothLine.fragText.replace(/[^\x00-\x7F]/g, "");
smoothLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("smooth-line");
    gl.useProgram(currentProgram);
}


let smoothDots = new ShaderProgram("smooth-dots");

// Spatially fluctuating smoothDots
smoothDots.vertText = `
    // beginGLSL
    attribute vec2 coordinates;
    uniform float time;
    varying float t;
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.0);
        gl_PointSize = 24.;
        gl_PointSize += (sin((coordinates.y*0.02+time*2e-1))*0.5+0.5)*4.;
    // gl_PointSize *= (sin(time*0.1+gl_Position.y*1e-2)*0.5+0.5);
        t = time;
        }
    // endGLSL
`;
smoothDots.fragText = `
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
        l = mix(pow(l, 10.), l, (sin(t*0.1+gl_FragCoord.y*1e-2)*0.5+0.5));
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.75, 0.25), l+halo-noise);
        gl_FragColor.a *= (sin(t*0.1+gl_FragCoord.y*1e-2)*0.5+0.5);
    }
    // endGLSL
`;
smoothDots.vertText = smoothDots.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots.fragText = smoothDots.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots.init();

smoothDots.vertText = `
    // beginGLSL
    attribute vec2 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float t;
    varying vec2 posxy;
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        vec2 pos = coordinates.xy;
        // pos += vec2(
        //     cos(pos.x*pos.y*2.+time*0.1), 
        //     sin(pos.x*pos.y*2.+time*0.1)
        //     )*0.01;
        // pos += vec2(
        //     cos(pos.x*pos.y*400.+time*1.1*sign(pos.x*pos.y*400.)), 
        //     sin(pos.x*pos.y*400.+time*1.1*sign(pos.x*pos.y*400.)))*0.0025;
        pos.x *= resolution.y / resolution.x;
        gl_Position = vec4(pos.x, pos.y, 0.0, 1.0);
        gl_PointSize = 20.;
        // gl_PointSize += (sin((coordinates.y*0.02+time*2e-1))*0.5+0.5)*4.;
        posxy = gl_Position.xy;
        t = time;
        
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    varying vec2 posxy;
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
        // l = smoothstep(0., 1., l);
                // l = mix(pow(l, 10.)*0.0001, l, sin(t*0.1+posxy.y*0.125e1)*0.5+0.5);
                // l = mix(pow(l, 10.)*0.0001, l, sin(t*0.1+posxy.y*0.125e1)*0.5+0.5);
        
        float instability = sin(t*0.1+posxy.y*0.25e1)*0.5+0.5;
        float vanish = length((posxy-vec2(0.0, -0.4))*4.);
        // vanish = floor(vanish);
        vanish = min(pow(vanish, 2.0)*2.5, 1.);
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.75, 0.25)-instability, (l+halo-noise)*0.5*vanish);
    }
    // endGLSL
`;
smoothDots.vertText = smoothDots.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots.fragText = smoothDots.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots.init();