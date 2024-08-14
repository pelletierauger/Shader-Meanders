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
        pos0 += vec2(
            cos(pos0.x*pos0.y*4.+time*0.1*sign(pos0.x*pos0.y*4.)), 
            sin(pos1.x*pos1.y*4.+time*0.1*sign(pos1.x*pos1.y*4.)))*0.01;
        pos1 += vec2(
            cos(pos0.x*pos0.y*4.+time*0.1*sign(pos0.x*pos0.y*4.)), 
            sin(pos1.x*pos1.y*4.+time*0.1*sign(pos1.x*pos1.y*4.)))*0.01;
        pos0 += vec2(
            cos(pos0.x*pos0.y*400.+time*1.1*sign(pos.x*pos0.y*400.)), 
            sin(pos1.x*pos1.y*400.+time*1.1*sign(pos.x*pos0.y*400.)))*0.0025;
        pos1 += vec2(
            cos(pos0.x*pos0.y*400.+time*1.1*sign(pos.x*pos1.y*400.)), 
            sin(pos1.x*pos1.y*400.+time*1.1*sign(pos.x*pos1.y*400.)))*0.0025;
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
        float rando = rand(pos);
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
                col = mix(pow(col, 10.)*0.2, col, sin(t*0.1+pos.y*0.5e1)*0.5+0.5);
        gl_FragColor = vec4(c.rgb, c.a * (max(col, 0.) - (rando * 0.05)));
        gl_FragColor.g = pow(col, 2.) *  0.2;
        gl_FragColor.b = pow(col, 2.) *  0.2;
        gl_FragColor.a = min(1., gl_FragColor.a + pow(col, 2.) *  0.25);
        gl_FragColor.rgb = gl_FragColor.gbr;
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
        gl_PointSize = 12.;
        // gl_PointSize += (sin((coordinates.y*0.02+time*2e-1))*0.5+0.5)*4.;
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
        // l = mix(pow(l, 10.), l, (sin(t*0.1+gl_FragCoord.y*1e-2)*0.5+0.5));
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.75, 0.25), l+halo-noise);
        // gl_FragColor.a *= (sin(t*0.1+gl_FragCoord.y*1e-2)*0.5+0.5);
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
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
    void main(void) {
        vec2 pos = coordinates.xy;
        pos += vec2(
            cos(pos.x*pos.y*400.+time*0.1), 
            sin(pos.x*pos.y*400.+time*0.1))*0.025;
                pos += vec2(
            cos(pos.x*pos.y*40.+time*0.1), 
            sin(pos.x*pos.y*40.+time*0.1))*0.05;
        // pos += vec2(
        //     cos(pos.x*pos.y*400.+time*1.1*sign(pos.x*pos.y*400.)), 
        //     sin(pos.x*pos.y*400.+time*1.1*sign(pos.x*pos.y*400.)))*0.0025;
        
            pos = rotateUV(pos, time*2e-2, 0.0);
        pos.x *= resolution.y / resolution.x;
        pos.x -= sin(time*2e-2) * 0.5;
        // pos.x -= fract(time*2e-3) * 0.5 * 6. - 1.3;
        gl_Position = vec4(pos.x, pos.y, 0.0, 1.0);
        gl_PointSize = 20.;
        // gl_PointSize += (sin((coordinates.y*0.02+time*2e-1))*0.5+0.5)*8.;
        // gl_PointSize += (sin(time*2e-1)*0.5+0.5)*8.;
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    ${blendingMath}
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
        l = smoothstep(0., 1., l);
        
        l = smoothstep(0., 1., l);
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.5, 0.25), (l+halo-noise)*0.5);
        // gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 0.08);
        // gl_FragColor.rgb *= 1.2;
    }
    // endGLSL
`;
smoothDots.vertText = smoothDots.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots.fragText = smoothDots.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots.init();


let verticalLine = new ShaderProgram("vertical-line");

verticalLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute float x;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying float w;
    varying vec4 c;
    varying vec2 uvs;
    varying float t;
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(x, 0.);
        w = width * 0.5;
        if (index == 0.) {
            pos.x -= w;            
            pos.y = 1.0;
        } else if (index == 1.) {
            pos.x += w;           
            pos.y = 1.0;
        } else if (index == 2.) {
            pos.x += w;
            pos.y = -1.0;
        } else if (index == 3.) {
            pos.x -= w;
            pos.y = -1.0;
        }
        float w1 = 1./w;
        pos.x += sin(time * 20.*w) * 8e-2 * w;
        pos.x *= ratio;
        gl_Position = vec4(pos, 0.0, 1.0);
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
verticalLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying float w;
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
        float noise = rand(pos) * 0.125;
        float a = abs((uvs.x - 0.5) * 2.0)  * -1. + 1.;
        a = max(smoothstep(0., 1., a) * 0.5, pow(a, 8.0));
        // a = smoothstep(0., 1., a);
        float y = uvs.x * 1.;
        float x = 10. + uvs.y;
        float osc = 20.* sin(t*1e-2);
        float f = 0.5 + 0.005/x + 0.01*x/(x-1.0) + 0.1*sin(x*osc);
        float d = abs(f-y);
        float fy = -0.005/(x*x) - 0.01/((x-1.0)*(x-1.0)) + 0.1*osc*cos(osc*x);
        fy = min(abs(fy), (osc*2.));
        
        // distance estimation
        // d /= sqrt(1.0 + fy * fy);
        d *= 0.707107;
        // a = 1.0-d*10.;
        // float thickness = 0.0001;
        // a = mix(0.0, 1.0, smoothstep((thickness + 2.0) * w, thickness * w, d));
        gl_FragColor = vec4(c.rgb, min(c.a, 1.0) * (a - noise));
    }
    // endGLSL
`;
verticalLine.vertText = verticalLine.vertText.replace(/[^\x00-\x7F]/g, "");
verticalLine.fragText = verticalLine.fragText.replace(/[^\x00-\x7F]/g, "");
verticalLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("vertical-line");
    gl.useProgram(currentProgram);
}


verticalLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute float x;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying float w;
    varying vec4 c;
    varying vec2 uvs;
    varying float t;
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(x, 0.);
        w = width * 0.5;
        if (index == 0.) {
            pos.x -= w;            
            if (color.b == 1.0){
            pos.x += 16./9. * 0.5;
            } else {
                pos.x -= 16./9. * 0.5;
            }
            pos.y = 1.0;
        } else if (index == 1.) {
            pos.x += w;           
            if (color.b == 1.0){
            pos.x += 16./9. * 0.5;
            } else {
                pos.x -= 16./9. * 0.5;
            }
            pos.y = 1.0;
        } else if (index == 2.) {
            pos.x += w;
            if (color.b == 1.0){
            pos.x -= 16./9. * 0.5;
            } else {
                pos.x += 16./9. * 0.5;
            }
            pos.y = -1.0;
        } else if (index == 3.) {
            pos.x -= w;
            if (color.b == 1.0){
            pos.x -= 16./9. * 0.5;
            } else {
                pos.x += 16./9. * 0.5;
            }
            pos.y = -1.0;
        }
        float w1 = 1./w;
        pos.x += sin(time * 20.*w) * 8e-2 * w;
        pos.x *= ratio;
        gl_Position = vec4(pos, 0.0, 1.0);
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
verticalLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying float w;
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
        float noise = rand(pos) * 0.125;
        float a = abs((uvs.x - 0.5) * 2.0)  * -1. + 1.;
        a = max(smoothstep(0., 1., a) * 0.5, pow(a, 8.0));
        // a = smoothstep(0., 1., a);
        float y = uvs.x * 1.;
        float x = 10. + uvs.y;
        float osc = 20.* sin(t*1e-2);
        float f = 0.5 + 0.005/x + 0.01*x/(x-1.0) + 0.1*sin(x*osc);
        float d = abs(f-y);
        float fy = -0.005/(x*x) - 0.01/((x-1.0)*(x-1.0)) + 0.1*osc*cos(osc*x);
        fy = min(abs(fy), (osc*2.));
        
        // distance estimation
        // d /= sqrt(1.0 + fy * fy);
        d *= 0.707107;
        // a = 1.0-d*10.;
        // float thickness = 0.0001;
        // a = mix(0.0, 1.0, smoothstep((thickness + 2.0) * w, thickness * w, d));
        gl_FragColor = vec4(c.rgb, min(c.a, 1.0) * (a - noise));
        // gl_FragColor.a *= 1.5;
    }
    // endGLSL
`;
verticalLine.vertText = verticalLine.vertText.replace(/[^\x00-\x7F]/g, "");
verticalLine.fragText = verticalLine.fragText.replace(/[^\x00-\x7F]/g, "");
verticalLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("vertical-line");
    gl.useProgram(currentProgram);
}


let textureShader = new ShaderProgram("textu");

// Bloody dawn over the mountains
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
// Passed in from the vertex shader.
uniform float time;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
${blendingMath}
void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
}
// endGLSL
`;
textureShader.vertText = textureShader.vertText.replace(/[^\x00-\x7F]/g, "");
textureShader.fragText = textureShader.fragText.replace(/[^\x00-\x7F]/g, "");
textureShader.init();


if (false) {

// Twin Peaks carpet, morphed
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
// Passed in from the vertex shader.
uniform float time;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
${blendingMath}
void main() {
    vec2 uv = gl_FragCoord.xy / vec2(2560., 1440.) * 2.;
    vec2 uv2 = gl_FragCoord.xy / vec2(2560., 1440.) * 2.;
    uv += vec2(cos(-time)*0., time);
    uv.y *= -1.;
    vec2 pos = uv2;
    float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 3.5;
    // uv *= cos(uv.x * 1e-1);
    uv += vec2(smoothstep(0.2, 1.0, cos(distSquared*1e-2)*40.), smoothstep(0.2, 1.0, sin(distSquared*1e-2)*40.))*3.;
    float noise = rand(uv) * 0.05;
    float wave = abs(fract((uv.y-0.5)*3.) - 0.5) * 3.;
    float a = fract(uv.x*20.+wave);
    a = abs((a - 0.5) * 2.0)  * -1. + 1.;
    // a = smoothstep(0., 1., a) * 0.2 + a * 0.9;
    // distSquared = smoothstep(0.2, 0.5, distSquared);
    float blue = a;
    a *= distSquared;
    // float l = 1.0 - length(pos - vec2(0.5)) * 0.5;
    // l = smoothstep(0.5, 0.8, l);
    // a *= l;
        // wave = 1.0 - abs(wave - 0.1);
        // a = abs((uv.x+wave - 0.5) * 2.0)  * -1. + 1.;
        // a = max(smoothstep(0., 1., a) * 0.5, pow(a, 8.0));
    // uv.x = sin(uv.x*200.);
   vec4 tex = texture2D(u_texture, v_texcoord);
   gl_FragColor = vec4(vec3(1., pow(blue,5.)*0.25, pow(blue,5.)*0.5), a - noise);
    // gl_FragColor = mix(tex, gl_FragColor, sin(length(vec2(0.))*10.-time*10.));
}
// endGLSL
`;
textureShader.vertText = textureShader.vertText.replace(/[^\x00-\x7F]/g, "");
textureShader.fragText = textureShader.fragText.replace(/[^\x00-\x7F]/g, "");
textureShader.init();

// Twin Peaks carpet, better
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
// Passed in from the vertex shader.
uniform float time;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${blendingMath}
void main() {
    vec2 uv = gl_FragCoord.xy / vec2(2560., 1440.) * 2.;
    vec2 ov = gl_FragCoord.xy / vec2(2560., 1440.) * 2.;
    vec2 uv2 = gl_FragCoord.xy / vec2(2560., 1440.) * 2.;
    uv.y *= -2.;
    float mappy = map(ov.y, 1., 0., 3., 1.);
    uv.x = (uv.x-0.5) * mappy;
    uv.y *= uv.y * 0.5;
    uv.y += time;
    vec2 pos = uv2;
    float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 5.5;
    float noise = rand(uv) * 0.05;
    float wave = abs(fract((uv.y-0.5)*3.) - 0.5) * 3.;
    float a = fract(uv.x*10.+wave);
    a = abs((a - 0.5) * 2.0* (1.0 - distSquared * 0.7))  * -1. + 1.;
    a = max(smoothstep(0., 1., a) * 0.75, pow(a, 8.0)*1.1);
    float blue = a;
    a *= distSquared;
    vec4 tex = texture2D(u_texture, v_texcoord);
    gl_FragColor = vec4(vec3(1., pow(blue,5.)*0.25, pow(blue,5.)*0.5), a - noise);
    // gl_FragColor = vec4(0.0, 0.0, ov.y, 1.0);
    // gl_FragColor = mix(tex, gl_FragColor, sin(length(vec2(0.))*10.-time*10.));
}
// endGLSL
`;
textureShader.vertText = textureShader.vertText.replace(/[^\x00-\x7F]/g, "");
textureShader.fragText = textureShader.fragText.replace(/[^\x00-\x7F]/g, "");
textureShader.init();

// Twin Peaks carpet, better lighting
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
// Passed in from the vertex shader.
uniform float time;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${blendingMath}
void main() {
    vec2 uv = gl_FragCoord.xy / vec2(2560., 1440.) * 2.;
    vec2 ov = gl_FragCoord.xy / vec2(2560., 1440.) * 2.;
    vec2 uv2 = gl_FragCoord.xy / vec2(2560., 1440.) * 2.;
    uv.y *= -2.;
    float mappy = map(ov.y, 1., 0., 3., 1.);
    uv.x = (uv.x-0.5) * mappy;
    uv.y *= uv.y * 0.5;
    uv.y += time;
    vec2 pos = uv2;
    float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 5.5;
    float noise = rand(uv) * 0.05;
    float wave = abs(fract((uv.y-0.5)*3.) - 0.5) * 3.;
    float a = fract(uv.x*10.+wave);
    a = abs((a - 0.5) * 2.0* (1.0 - distSquared * 0.7))  * -1. + 1.;
    a = max(smoothstep(0., 1., a) * 0.75, pow(a, 8.0)*1.1);
    float blue = a;
    a *= distSquared;
    vec4 tex = texture2D(u_texture, v_texcoord);
    vec3 col = vec3(1., pow(blue,5.)*0.25, pow(blue,5.)*0.5);
    vec3 blender = BlendSoftLight(col, vec3(1.0, 0.0, 0.0));
    col = mix(col, blender, 0.75);
    a = max(a, smoothstep(0., 1., a*1.1));
    gl_FragColor = vec4(col, a * 1. - noise);
    // gl_FragColor = vec4(0.0, 0.0, ov.y, 1.0);
    // gl_FragColor = mix(tex, gl_FragColor, sin(length(vec2(0.))*10.-time*10.));
}
// endGLSL
`;
textureShader.vertText = textureShader.vertText.replace(/[^\x00-\x7F]/g, "");
textureShader.fragText = textureShader.fragText.replace(/[^\x00-\x7F]/g, "");
textureShader.init();

// Twin Peaks carpet, better lighting, lower framing
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
// Passed in from the vertex shader.
uniform float time;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${blendingMath}
void main() {
    vec2 uv = (gl_FragCoord.xy / vec2(2560., 1440.) + vec2(0., 0.2)) * 2.;
    vec2 ov = (gl_FragCoord.xy / vec2(2560., 1440.) + vec2(0., 0.2)) * 2.;
    vec2 uv2 = (gl_FragCoord.xy / vec2(2560., 1440.) + vec2(0., 0.2)) * 2.;
    // uv.y += 0.5;
    uv.y *= -2.;
    float mappy = map(ov.y, 1., 0., 3., 1.);
    uv.x = (uv.x-0.5) * mappy;
    uv.y *= uv.y * 0.5;
    uv.y += time;
    vec2 pos = uv2;
    float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 5.5;
    float noise = rand(uv) * 0.05;
    float wave = abs(fract((uv.y-0.5)*3.) - 0.5) * 3.;
    float a = fract(uv.x*10.+wave);
    a = abs((a - 0.5) * 2.0* (1.0 - distSquared * 0.7))  * -1. + 1.;
    a = max(smoothstep(0., 1., a) * 0.75, pow(a, 8.0)*1.1);
    float blue = a;
    a *= distSquared;
    vec4 tex = texture2D(u_texture, v_texcoord);
    vec3 col = vec3(1., pow(blue,5.)*0.25, pow(blue,5.)*0.5);
    vec3 blender = BlendSoftLight(col, vec3(1.0, 0.0, 0.0));
    col = mix(col, blender, 0.75);
    a = max(a, smoothstep(0., 1., a*1.1));
    gl_FragColor = vec4(col, a * 1. - noise);
    // gl_FragColor = vec4(0.0, 0.0, ov.y, 1.0);
    // gl_FragColor = mix(tex, gl_FragColor, sin(length(vec2(0.))*10.-time*10.));
}
// endGLSL
`;
textureShader.vertText = textureShader.vertText.replace(/[^\x00-\x7F]/g, "");
textureShader.fragText = textureShader.fragText.replace(/[^\x00-\x7F]/g, "");
textureShader.init();

// -------------------------------------------------
// Vertical, wavy
// -------------------------------------------------
verticalLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute float x;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying float w;
    varying vec4 c;
    varying vec2 uvs;
    varying float t;
    varying vec2 posxy;
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(x, 0.);
        w = width * 0.5;
        if (index == 0.) {
            pos.x -= w;            
            pos.y = 1.0;
        } else if (index == 1.) {
            pos.x += w;           
            pos.y = 1.0;
        } else if (index == 2.) {
            pos.x += w;
            pos.y = -1.0;
        } else if (index == 3.) {
            pos.x -= w;
            pos.y = -1.0;
        }
        float w1 = 1./w;
        pos.x += sin(time * 20.*w) * 8e-2 * w;
        pos.x *= ratio;
        gl_Position = vec4(pos, 0.0, 1.0);
        c = color;
        uvs = uv;
        t = time;
        posxy = pos;
    }
    // endGLSL
`;
verticalLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying float w;
    varying float t;
    varying vec2 posxy;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    void main(void) {
        vec2 fc = gl_FragCoord.xy;
        vec2 pos = gl_PointCoord;
        float noise = rand(pos) * 0.125;
        float a = abs((uvs.x - 0.5) * 2.0)  * -1. + 1.;
        a = max(smoothstep(0., 1., a) * 0.5, pow(a, 8.0));
        // a = smoothstep(0., 1., a);
        float y = uvs.y;
        float x = uvs.x;
        float osc = 40. * sin(y*2.+t*1e-1);
        float wi = 0.2;
        float f = 0.5 + sin(y*osc + posxy.x * 10.)*wi;
        float d = abs(f-x) * 3.;
        float thickness = 5.;
        a = smoothstep(0., 1., 1.0 - d);
        a = smoothstep(0., 1., a);
        gl_FragColor = vec4(c.rgb, min(c.a, 1.0) * (a - noise));
    }
    // endGLSL
`;
verticalLine.vertText = verticalLine.vertText.replace(/[^\x00-\x7F]/g, "");
verticalLine.fragText = verticalLine.fragText.replace(/[^\x00-\x7F]/g, "");
verticalLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("vertical-line");
    gl.useProgram(currentProgram);
}


// -------------------------------------------------
// Oblique, wavy
// -------------------------------------------------
verticalLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute float x;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying float w;
    varying vec4 c;
    varying vec2 uvs;
    varying float t;
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(x, 0.);
        w = width * 0.5;
        if (index == 0.) {
            pos.x -= w;            
            if (color.b == 1.0){
            pos.x += 16./9. * 0.5;
            } else {
                pos.x -= 16./9. * 0.5;
            }
            pos.y = 1.0;
        } else if (index == 1.) {
            pos.x += w;           
            if (color.b == 1.0){
            pos.x += 16./9. * 0.5;
            } else {
                pos.x -= 16./9. * 0.5;
            }
            pos.y = 1.0;
        } else if (index == 2.) {
            pos.x += w;
            if (color.b == 1.0){
            pos.x -= 16./9. * 0.5;
            } else {
                pos.x += 16./9. * 0.5;
            }
            pos.y = -1.0;
        } else if (index == 3.) {
            pos.x -= w;
            if (color.b == 1.0){
            pos.x -= 16./9. * 0.5;
            } else {
                pos.x += 16./9. * 0.5;
            }
            pos.y = -1.0;
        }
        float w1 = 1./w;
        pos.x += sin(time * 20.*w) * 8e-2 * w;
        pos.x *= ratio;
        gl_Position = vec4(pos, 0.0, 1.0);
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
verticalLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying float w;
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
        float noise = rand(pos) * 0.125;
        float a = abs((uvs.x - 0.5) * 2.0)  * -1. + 1.;
        a = max(smoothstep(0., 1., a) * 0.5, pow(a, 8.0));
        // a = smoothstep(0., 1., a);
        float y = uvs.y;
        float x = uvs.x;
        float osc = 5. * sin(y*2.+t*1e-1) * w * 2.;
        float wi = 0.2;
        float f = 0.5 + sin(y*osc * 10.)*wi;
        float d = abs(f-x) * 3.;
        float thickness = 5.;
        a = smoothstep(0., 1., 1.0 - d);
        a = smoothstep(0., 1., a);
        // a = 1.0-d*10.;
        // float thickness = 0.0001;
        // a = mix(0.0, 1.0, smoothstep((thickness + 2.0) * w, thickness * w, d));
        gl_FragColor = vec4(c.rgb, min(c.a, 1.0) * (a - noise) * 0.25);
        // gl_FragColor.a *= 1.5;
    }
    // endGLSL
`;
verticalLine.vertText = verticalLine.vertText.replace(/[^\x00-\x7F]/g, "");
verticalLine.fragText = verticalLine.fragText.replace(/[^\x00-\x7F]/g, "");
verticalLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("vertical-line");
    gl.useProgram(currentProgram);
}

// Film noir B&W
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
// Passed in from the vertex shader.
uniform float time;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
${blendingMath}
void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
   gl_FragColor.rgb = max(gl_FragColor.rrr, gl_FragColor.bbb);
        // vec3 blender = BlendSoftLight(gl_FragColor.rgb, vec3(1.0, 0.0, 0.0));
    // vec3 blend = mix(gl_FragColor.rgb, blender, 0.5);
    // gl_FragColor.rgb = blender * vec3(1., 0.2, 0.2);
}
// endGLSL
`;
textureShader.vertText = textureShader.vertText.replace(/[^\x00-\x7F]/g, "");
textureShader.fragText = textureShader.fragText.replace(/[^\x00-\x7F]/g, "");
textureShader.init();

// Cramoisi
textureShader.vertText = `
    // beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  vec4 positionVec4 = vec4(a_position, 1.0);
  // gl_Position = a_position;
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
// Passed in from the vertex shader.
uniform float time;
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
${blendingMath}
void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
   gl_FragColor.rgb = max(gl_FragColor.rrr, gl_FragColor.bbb);
        vec3 blender = BlendSoftLight(gl_FragColor.rgb, vec3(1.0, 0.5, 0.0));
    // vec3 blend = mix(gl_FragColor.rgb, blender, 0.5);
    gl_FragColor.rgb = blender * vec3(1., 0.3, 0.3);
}
// endGLSL
`;
textureShader.vertText = textureShader.vertText.replace(/[^\x00-\x7F]/g, "");
textureShader.fragText = textureShader.fragText.replace(/[^\x00-\x7F]/g, "");
textureShader.init();

// ----------------------------------------------------
// Twin Peaks Zebra Pattern
// ----------------------------------------------------
verticalLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute float x;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying float w;
    varying vec4 c;
    varying vec2 uvs;
    varying float t;
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(x, 0.);
        w = width * 0.5;
        if (index == 0.) {
            pos.x -= w;            
            pos.y = 1.0;
        } else if (index == 1.) {
            pos.x += w;           
            pos.y = 1.0;
        } else if (index == 2.) {
            pos.x += w;
            pos.y = -1.0;
        } else if (index == 3.) {
            pos.x -= w;
            pos.y = -1.0;
        }
        float w1 = 1./w;
        pos.x += sin(time * 20.*w) * 8e-2 * w;
        pos.x *= ratio;
        gl_Position = vec4(pos, 0.0, 1.0);
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
verticalLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying float w;
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
        float noise = rand(pos) * 0.125;
        float a = abs((uvs.x - 0.5) * 2.0)  * -1. + 1.;
        float wave = abs(fract((uvs.y-0.5)*20.*sin(t*4e-2)) - 0.5) * 0.5 + 1.;
        wave = 1.0 - abs(wave - 0.1);
        a = abs((uvs.x+wave - 0.5) * 2.0)  * -1. + 1.;
        a = max(smoothstep(0., 1., a) * 0.5, pow(a, 8.0));
        gl_FragColor = vec4(c.rgb, min(c.a, 1.0) * (a - noise));
    }
    // endGLSL
`;
verticalLine.vertText = verticalLine.vertText.replace(/[^\x00-\x7F]/g, "");
verticalLine.fragText = verticalLine.fragText.replace(/[^\x00-\x7F]/g, "");
verticalLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("vertical-line");
    gl.useProgram(currentProgram);
}

// -------------------------------------------------
// Twin Peaks Zebra, Oblique
// -------------------------------------------------
verticalLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute float x;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying float w;
    varying vec4 c;
    varying vec2 uvs;
    varying float t;
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(x, 0.);
        w = width * 0.5;
        if (index == 0.) {
            pos.x -= w;            
            if (color.b == 1.0){
            pos.x += 16./9. * 0.5;
            } else {
                pos.x -= 16./9. * 0.5;
            }
            pos.y = 1.0;
        } else if (index == 1.) {
            pos.x += w;           
            if (color.b == 1.0){
            pos.x += 16./9. * 0.5;
            } else {
                pos.x -= 16./9. * 0.5;
            }
            pos.y = 1.0;
        } else if (index == 2.) {
            pos.x += w;
            if (color.b == 1.0){
            pos.x -= 16./9. * 0.5;
            } else {
                pos.x += 16./9. * 0.5;
            }
            pos.y = -1.0;
        } else if (index == 3.) {
            pos.x -= w;
            if (color.b == 1.0){
            pos.x -= 16./9. * 0.5;
            } else {
                pos.x += 16./9. * 0.5;
            }
            pos.y = -1.0;
        }
        float w1 = 1./w;
        pos.x += sin(time * 20.*w) * 8e-2 * w;
        pos.x *= ratio;
        gl_Position = vec4(pos, 0.0, 1.0);
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
verticalLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying float w;
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
        float noise = rand(pos) * 0.125;
        float a = abs((uvs.x - 0.5) * 2.0)  * -1. + 1.;
        float wave = abs(fract((uvs.y-0.5)*20.*sin(t*4e-2)) - 0.5) * 0.5 + 1.;
        wave = 1.0 - abs(wave - 0.1);
        a = abs((uvs.x+wave - 0.5) * 2.0)  * -1. + 1.;
        a = max(smoothstep(0., 1., a) * 0.5, pow(a, 8.0));
        gl_FragColor = vec4(c.rgb, min(c.a, 1.0) * (a - noise));
        // gl_FragColor.a *= 1.5;
    }
    // endGLSL
`;
verticalLine.vertText = verticalLine.vertText.replace(/[^\x00-\x7F]/g, "");
verticalLine.fragText = verticalLine.fragText.replace(/[^\x00-\x7F]/g, "");
verticalLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("vertical-line");
    gl.useProgram(currentProgram);
}

}