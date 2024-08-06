let smoothDots = new ShaderProgram("smooth-dots");

smoothDots.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute vec3 position;
    attribute vec4 color;
    attribute float index;
    attribute float index2;
    uniform vec2 resolution;
    uniform float time;
    varying vec4 c;
    varying float i;
    varying float i2;
    varying float t;
    vec2 rotateUV(vec2 uv, float rotation, float mid) {
        return vec2(
          cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
          cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
        );
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
        i = index;
        i2 = index2;
        t = time;
        float z = map(index, 0., 60000., 10., 0.);
        vec4 pos = vec4(position.xy, 0., 1.);
        // pos.xy *= 0.25;
        
        pos.xy = rotateUV(pos.xy, t*4e-3, 0.);        
        pos.xy += vec2(
            cos(pos.x*pos.y*4.*(1.0-length(pos.xy)*0.5)+time*0.1), 
            sin(pos.x*pos.y*4.*(1.0-length(pos.xy)*0.5)+time*0.1))*0.03;
        pos = translate(0.0, 0.0, 2.0) * pos;
        
        pos.x *= ratio;
        gl_Position = vec4(pos.xy, 0.0, pos.z);
        gl_PointSize = 0.;
        gl_PointSize += map(sin(i*1e-4-t*1e-1), -1., 1., 0., 24.);
        if (gl_PointSize < 5.0) {
            gl_PointSize = 0.0;
        }
        c = color;
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying float t;
    varying float i;
    ${blendingMath}
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float center = 1.0 - dot(pos - 0.5, pos - 0.5) * 32.;
        float point = 1.0 - dot(pos - 0.5, pos - 0.5) * 256.;
        point = smoothstep(0., 1.0, point);
        float halo = 1.0 - dot(pos - 0.5, pos - 0.5) * 3.;
        // center = pow(center, 4.);
        float alpha = c.a * 3.;
        alpha *= (max(0., center) + max(0., halo) * 0.1) * 0.5;
        if (alpha < 0.01) {
            discard;
        }
        // alpha += ;
        vec3 col0 = vec3(0.0, 0.0, 1.0);
        vec3 col1 = vec3(1.0, 0.0, 0.0);
        float mixer = map(i, 0., 30000., 0., 1.);
        mixer = smoothstep(0., 1., mixer);
        mixer = smoothstep(0., 1., mixer);
        vec3 col = mix(col0, col1, mixer);
        // col = mix(col0, col1, sin(i*1e-4-t*2e-1)*0.5+0.5);
        // col.g = c.g * 0.125;
        col = Desaturate(col, (1. - mixer)*0.25).rgb;
        col = mix(col, vec3(1.0), max(0., point)*0.65);
        // alpha += max(0.0, halo) * 0.001 * c.a * 3.;
        // alpha *= map(sin(i*2e-4-t*1e-1), -1., 1., 0., 1.);
        gl_FragColor = vec4(col, alpha);
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

smoothDots.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute vec3 position;
    attribute vec4 color;
    attribute float index;
    attribute float index2;
    uniform vec2 resolution;
    uniform float time;
    varying vec4 c;
    varying float i;
    varying float i2;
    varying float t;
    vec2 rotateUV(vec2 uv, float rotation, float mid) {
        return vec2(
          cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
          cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
        );
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
        i = index;
        i2 = index2;
        t = time;
        float z = map(index, 0., 60000., 10., 0.);
        
        float i2i = map(index, 0., 50000., 0., 1.);
        i2i = pow(i2i, 2.);
        vec4 pos = vec4(position.xy, 0., 1.);
        // pos.xy *= 0.25;
        
        pos.xy = rotateUV(pos.xy, t*4e-3, 0.);        
        pos.xy += vec2(
            cos(pos.x*pos.y*1.*(1.0-length(pos.xy)*0.5)+time*0.1+i2*10.*i2i), 
            sin(pos.x*pos.y*1.*(1.0-length(pos.xy)*0.5)+time*0.1+i2*10.*i2i))*0.03;
        pos = translate(0.0, 0.0, 2.0) * pos;
        
        pos.x *= ratio;
        gl_Position = vec4(pos.xy, 0.0, pos.z);
        gl_PointSize = 0.;
        gl_PointSize += map(sin(i*1e-4-t*1e-1), -1., 1., 0., 24.);
        if (gl_PointSize < 5.0) {
            gl_PointSize = 0.0;
        }
        c = color;
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying float t;
    varying float i;
    ${blendingMath}
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float center = 1.0 - dot(pos - 0.5, pos - 0.5) * 32.;
        float point = 1.0 - dot(pos - 0.5, pos - 0.5) * 256.;
        point = smoothstep(0., 1.0, point);
        float halo = 1.0 - dot(pos - 0.5, pos - 0.5) * 3.;
        // center = pow(center, 4.);
        float alpha = c.a * 3.;
        alpha *= (max(0., center) + max(0., halo) * 0.1) * 0.5;
        if (alpha < 0.01) {
            discard;
        }
        // alpha += ;
        vec3 col0 = vec3(0.0, 0.0, 1.0);
        vec3 col1 = vec3(1.0, 0.0, 0.0);
        float mixer = map(i, 0., 30000., 0., 1.);
        mixer = smoothstep(0., 1., mixer);
        mixer = smoothstep(0., 1., mixer);
        vec3 col = mix(col0, col1, mixer);
        // col = mix(col0, col1, sin(i*1e-4-t*2e-1)*0.5+0.5);
        // col.g = c.g * 0.125;
        col = Desaturate(col, (1. - mixer)*0.25).rgb;
        col = mix(col, vec3(1.0), max(0., point)*0.65);
        // alpha += max(0.0, halo) * 0.001 * c.a * 3.;
        // alpha *= map(sin(i*2e-4-t*1e-1), -1., 1., 0., 1.);
        gl_FragColor = vec4(col, alpha);
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

smoothDots.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute vec3 position;
    attribute vec4 color;
    attribute float index;
    attribute float index2;
    uniform vec2 resolution;
    uniform float time;
    varying vec4 c;
    varying float i;
    varying float i2;
    varying float t;
    vec2 rotateUV(vec2 uv, float rotation, float mid) {
        return vec2(
          cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
          cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
        );
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
        i = index;
        i2 = index2;
        t = time;
        float z = map(index, 0., 60000., 10., 0.);
        
        float i2i = map(index, 0., 50000., 0.75, 1.);
        i2i = pow(i2i, 2.);
        vec4 pos = vec4(position.xy, 0., 1.);
        // pos.xy *= 0.25;
        
        pos.xy = rotateUV(pos.xy, t*4e-3, 0.);        
        pos.xy += vec2(
            cos(pos.x*pos.y*1.*(1.0-length(pos.xy)*0.5)+time*0.1+i2*1.*i2i), 
            sin(pos.x*pos.y*1.*(1.0-length(pos.xy)*0.5)+time*0.1+i2*1.*i2i))*0.03;
        // pos.xy += vec2(cos(i2*2.), sin(i2*2.));
        // pos = translate(cos(i2*0.01-time*1e-2*0.), sin(i2*0.01-time*1e-2*0.), 0.0) * pos;
        pos = translate(0.0, 0.0, 2.0) * pos;
        // pos = zRotate(sin(i2*10.-time*1e-2)*0.18*i2i) * pos;
        // pos = zRotate(sin(i2*10.*i2i-time*1e-2)*0.2) * pos;
        pos.x *= ratio;
        // pos.xy *= 0.5;
        gl_Position = vec4(pos.xy, 0.0, pos.z);
        gl_PointSize = 0.;
        gl_PointSize += map(sin(i*1e-4-t*1e-1), -1., 1., 0., 24.);
        if (gl_PointSize < 5.0) {
            gl_PointSize = 0.0;
        }
        c = color;
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying float t;
    varying float i;
    ${blendingMath}
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float center = 1.0 - dot(pos - 0.5, pos - 0.5) * 32.;
        float point = 1.0 - dot(pos - 0.5, pos - 0.5) * 256.;
        point = smoothstep(0., 1.0, point);
        float halo = 1.0 - dot(pos - 0.5, pos - 0.5) * 3.;
        // center = pow(center, 4.);
        float alpha = c.a * 3.;
        alpha *= (max(0., center) + max(0., halo) * 0.1) * 0.5;
        if (alpha < 0.01) {
            discard;
        }
        // alpha += ;
        vec3 col0 = vec3(0.0, 0.0, 1.0);
        vec3 col1 = vec3(1.0, 0.0, 0.0);
        float mixer = map(i, 0., 30000., 0., 1.);
        mixer = smoothstep(0., 1., mixer);
        mixer = smoothstep(0., 1., mixer);
        vec3 col = mix(col0, col1, mixer);
        // col = mix(col0, col1, sin(i*1e-4-t*2e-1)*0.5+0.5);
        // col.g = c.g * 0.125;
        col = Desaturate(col, (1. - mixer)*0.25).rgb;
        col = mix(col, vec3(1.0), max(0., point)*0.65);
        // alpha += max(0.0, halo) * 0.001 * c.a * 3.;
        // alpha *= map(sin(i*2e-4-t*1e-1), -1., 1., 0., 1.);
        gl_FragColor = vec4(col, alpha);
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

smoothDots.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute vec3 position;
    attribute vec4 color;
    attribute float index;
    attribute float index2;
    uniform vec2 resolution;
    uniform float time;
    varying vec4 c;
    varying float i;
    varying float i2;
    varying float t;
    varying vec2 posUnit;
    varying vec3 c2;
    ${blendingMath}
    vec2 rotateUV(vec2 uv, float rotation, float mid) {
        return vec2(
          cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
          cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
        );
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
        i = index;
        i2 = index2;
        t = time;
        float z = map(index, 0., 60000., 10., 0.);
        
        float i2i = map(index, 0., 50000., 0.75, 1.);
        i2i = pow(i2i, 2.);
        vec4 pos = vec4(position.xy, 0., 1.);
        // pos.xy *= 0.25;
        
        pos.xy = rotateUV(pos.xy, t*4e-3, 0.);        
        pos.xy += vec2(
            cos(pos.x*pos.y*1.*(1.0-length(pos.xy)*0.5)+time*0.1+i2*1.*i2i), 
            sin(pos.x*pos.y*1.*(1.0-length(pos.xy)*0.5)+time*0.1+i2*1.*i2i))*0.03;
        // pos.xy += vec2(cos(i2*2.), sin(i2*2.));
        // pos = translate(cos(i2*0.01-time*1e-2*0.), sin(i2*0.01-time*1e-2*0.), 0.0) * pos;
        pos = translate(0.0, 0.0, 2.0) * pos;
        // pos = zRotate(sin(i2*10.-time*1e-2)*0.18*i2i) * pos;
        // pos = zRotate(sin(i2*10.*i2i-time*1e-2)*0.2) * pos;
        pos.x *= ratio;
        // pos.xy *= 0.5;
        posUnit = pos.xy;
        gl_Position = vec4(pos.xy, 0.0, pos.z);
        gl_PointSize = 0.;
        gl_PointSize += map(sin(i*1e-4-t*1e-1), -1., 1., 0., 24.);
        if (gl_PointSize < 5.0) {
            gl_PointSize = 0.0;
        }
        c = color;
        vec3 col0 = vec3(0.0, 0.0, 1.0);
        vec3 col1 = vec3(1.0, 0.0, 0.0);
        float mixer = map(i, 0., 30000., 0., 1.);
        mixer = smoothstep(0., 1., mixer);
        mixer = smoothstep(0., 1., mixer);
        vec3 col = mix(col0, col1, mixer);
        // col = mix(col0, col1, sin(i*1e-4-t*2e-1)*0.5+0.5);
        // col.g = c.g * 0.125;
        col = Desaturate(col, (1. - mixer)*0.25).rgb;
        // col = mix(col, hueShift(col, i2*0.25-8.), 0.125);
        // col = hueShift(col, 2.99);
        c2 = col;
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying float t;
    varying float i;
    varying float i2;
    varying vec2 posUnit;
    varying vec3 c2;
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        // gl_PointCoord is the local pixel position within the point.
        vec2 pos = gl_PointCoord;
        float center = 1.0 - dot(pos - 0.5, pos - 0.5) * 32.;
        float point = 1.0 - dot(pos - 0.5, pos - 0.5) * 256.;
        point = smoothstep(0., 1.0, point);
        float halo = 1.0 - dot(pos - 0.5, pos - 0.5) * 3.;
        // center = pow(center, 4.);
        float alpha = c.a * 3.;
        alpha *= (max(0., center) + max(0., halo) * 0.1) * 0.5;
        if (alpha < 0.01) {
            discard;
        }
        // alpha += ;
        vec3 col = mix(c2, vec3(1.0), max(0., point)*0.65);
        // col = hueShift2(col, 2.5);
        // col = hueShift2(col, abs(atan(posUnit.y, posUnit.x))*2.);
        // alpha += max(0.0, halo) * 0.001 * c.a * 3.;
        // alpha *= map(sin(i*2e-4-t*1e-1), -1., 1., 0., 1.);
        gl_FragColor = vec4(col, alpha);
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
