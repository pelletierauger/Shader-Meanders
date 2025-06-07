if (false) {

// A beautiful RGB twirl
setBothShaders(`
// beginGLSL
precision mediump float;
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
// https://gist.github.com/ayamflow/c06bc0c8a64f985dd431bd0ac5b557cd
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float ndot(vec2 a, vec2 b ) {return a.x*b.x - a.y*b.y;}
float sdRhombus(vec2 p, vec2 b) {
    p = abs(p);
    float h = clamp( ndot(b-2.0*p,b)/dot(b,b), -1.0, 1.0 );
    float d = length( p-0.5*b*vec2(1.0-h,1.0+h) );
    return d * sign( p.x*b.y + p.y*b.x - b.x*b.y );
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
        uv.x *= 1280./720.;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float r = sdRhombus(uv*2.25, vec2(1.9, 1.));
    float r2 = abs(r*1.-0.1);
    
    r2 = 1.0-max(0.,min(1., r2));
    r = abs(r*16.-0.9);
    r = 1.-max(0.,min(1., r));
    // r = min(1., r*r+r2*r2*0.25*(1.-r*r));
    r = smoothstep(0., 1., r);
    // r = r2-r;
    // r = r2;
    // r = pow(r, 1.5)*1.;
    gl_FragColor = vec4(vec3(r, pow(r,7.)*0.15,pow(r,7.)*0.35), 1.0);
}
// endGLSL
`);

// A beautiful RGB twirl
setBothShaders(`
// beginGLSL
precision mediump float;
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
// https://gist.github.com/ayamflow/c06bc0c8a64f985dd431bd0ac5b557cd
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float ndot(vec2 a, vec2 b ) {return a.x*b.x - a.y*b.y;}
float sdRhombus(vec2 p, vec2 b) {
    p = abs(p);
    float h = clamp( ndot(b-2.0*p,b)/dot(b,b), -1.0, 1.0 );
    float d = length( p-0.5*b*vec2(1.0-h,1.0+h) );
    return d * sign( p.x*b.y + p.y*b.x - b.x*b.y );
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
        uv.x *= 1280./720.;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float r = sdRhombus(uv*2.25, vec2(1.9, 1.)*0.5);
    r = abs(r*2.-0.5)+10.;
    r = sin(r*40.)*0.5+0.5;
    // r = smoothstep(0., 1., r);
    // r = r2-r;
    // r = r2;
    // r = pow(r, 1.5)*1.;
    gl_FragColor = vec4(vec3(r, pow(r,7.)*0.15,pow(r,7.)*0.35), 1.0);
}
// endGLSL
`);

// Fluctuating ellipse
setBothShaders(`
// beginGLSL
precision mediump float;
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
${sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv) * 0.05;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(10., 10.), vec2(3., 1.5));
    r = 1.0-abs(r - 0.5);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2;
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    r *= sin(uv.y*5.+time*1.);
    gl_FragColor = vec4(vec3(0., 0., r) - rando, 1.0);
}
// endGLSL
`);


// Fluctuating ellipse
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv) * 0.05;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(20., 20.)*ramp, vec2(3., 1.5));
    r = 1.0-abs(r - 0.5);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2;
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    // r *= sin(uv.y*5.+time*1.);
    r *= map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*7e-1), -1., 1., 0., 1.);
    r *= ramp;
    gl_FragColor = vec4(vec3(0., 0., r) - rando, 1.0);
}
// endGLSL
`);

// Ellipses, circles, triangles
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse+smoothTriangle+rotateUV}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv + time * 1e-4) * 0.025;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(7., 7.), vec2(3., 1.5));
    r = 0.55-abs(r - 0.5);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2;
    r = pow(r, 3.)*3.;
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    // r *= sin(uv.y*5.+time*1.);
    // r *= map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*2e-1), -1., 1., 0., 1.);
    // r *= ramp;
    float y = 1.0/(length(uv*15.)+0.95);
    float y2 = y;
    y = smoothstep(0.3, 0.5, y);
    y = smoothstep(0., 1., y);
    y = smoothstep(0., 1., y);
    // y = smoothstep(0., 1., y);
    // y = y + r;
    float red = 1.0-length(uv*3.);
    red = 0.65-abs(red-0.35);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    
    red = pow(red*1.1, 7.);
    gl_FragColor = vec4(vec3(pow(y,3.)*0.75+pow(r,7.)*0.5,y+pow(r,7.)*0.85+r, max(y,r)) - rando, 1.0);
    gl_FragColor.r = max(gl_FragColor.r, red);
    gl_FragColor.g = max(gl_FragColor.g, pow(red,7.)*0.25);
    gl_FragColor.b = max(gl_FragColor.b, pow(red,7.)*0.75);
    uv = rotateUV(uv, -time*0.5e-1, 0.);
    
        vec2 v0 = vec2(0.1, -0.2);
    vec2 v1 = vec2(0.25, 0.25);
    vec2 v2 = vec2(-0.1, 0.25);
    vec2 muv = vec2(
        fract(abs(uv.x*0.9)),
        fract(abs(uv.y*0.9))
    );    
    float a = smoothTriangle(muv+vec2(0.125,-0.125), v0, v1, v2, 0.025);
    a = smoothstep(0., 1., a);
    gl_FragColor.r = gl_FragColor.r+a*(1.-gl_FragColor.r);
    gl_FragColor.g = gl_FragColor.g+pow(a,7.)*0.1*(1.-gl_FragColor.g);
    gl_FragColor.b = gl_FragColor.b+pow(a,7.)*0.1*(1.-gl_FragColor.b);
    // gl_FragColor = vec4(vec3(muv.x*muv.y), 1.);
}
// endGLSL
`);

// Ellipses, circles, triangles
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse}
${smoothTriangle+blendingMath+rotateUV}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv + time * 1e-4) * 0.025;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(7., 7.), vec2(3., 1.5));
    r = 0.55-abs(r - 0.5);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2;
    r = pow(r, 3.)*3.;
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    // r *= sin(uv.y*5.+time*1.);
    // r *= map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*2e-1), -1., 1., 0., 1.);
    // r *= ramp;
    float y = 1.0/(length(uv*15.)+0.95);
    float y2 = y;
    y = smoothstep(0.3, 0.5, y);
    y = smoothstep(0., 1., y);
    y = smoothstep(0., 1., y);
    // y = smoothstep(0., 1., y);
    // y = y + r;
    float red = 1.0-length(uv*3.);
    red = 0.65-abs(red-0.35);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    
    red = pow(red*1.1, 7.);
    red *= sin(fract(map(atan(uv.y, uv.x)+time*5e-2,-pi,pi, 0.,3.))*pi);
    gl_FragColor = vec4(vec3(pow(y,3.)*0.75+pow(r,7.)*0.5,y+pow(r,7.)*0.85+r, max(y,r)) - rando, 1.0);
    gl_FragColor.r = max(gl_FragColor.r, red);
    gl_FragColor.g = max(gl_FragColor.g, pow(red,7.)*0.25);
    gl_FragColor.b = max(gl_FragColor.b, pow(red,7.)*0.75);
    // uv = rotateUV(uv, time*1e-1, 0.);
    
        vec2 v0 = vec2(0.1+0.65, -0.05);
    vec2 v1 = vec2(0.3+0.65, 0.3);
    vec2 v2 = vec2(-0.1+0.65, 0.3);
    vec2 muv = vec2(
        fract(abs(uv.x*1.)),
        fract(abs(uv.y*1.))
    );    
    float a = smoothTriangle(muv+vec2(0.125,-0.125), v0, v1, v2, 0.025);
    // a = 1.0-abs(a-0.5)-0.5;
    
    a *= sin(abs(uv.y)*pi*2.+time);
    a = smoothstep(0., 1., a);
    // a *= sin(fract(map(atan(uv.y, uv.x)+time*5e-2,-pi,pi, 0.,3.))*pi);
    gl_FragColor.r = gl_FragColor.r+a*(1.-gl_FragColor.r);
    gl_FragColor.g = gl_FragColor.g+pow(a,7.)*0.1*(1.-gl_FragColor.g);
    gl_FragColor.b = gl_FragColor.b+pow(a,7.)*0.1*(1.-gl_FragColor.b);
    // gl_FragColor = vec4(vec3(muv.x*muv.y), 1.);
    // gl_FragColor.a = 0.5;
    
}
// endGLSL
`);

// Ellipses, circles, triangles
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse+smoothTriangle+rotateUV}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv + time * 1e-4) * 0.025;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(7., 7.), vec2(3., 1.5));
    r = 0.55-abs(r - 0.5);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2;
    r = pow(r, 3.)*3.;
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    // r *= sin(uv.y*5.+time*1.);
    // r *= map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*2e-1), -1., 1., 0., 1.);
    // r *= ramp;
    float y = 1.0/(length(uv*15.)+0.95);
    float y2 = y;
    y = smoothstep(0.3, 0.5, y);
    y = smoothstep(0., 1., y);
    y = smoothstep(0., 1., y);
    // y = smoothstep(0., 1., y);
    // y = y + r;
    float red = 1.0-length(uv*3.);
    red = 0.65-abs(red-0.35);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    
    red = pow(red*1.1, 7.);
    gl_FragColor = vec4(vec3(pow(y,3.)*0.75+pow(r,7.)*0.5,y+pow(r,7.)*0.85+r, max(y,r)) - rando, 1.0);
    gl_FragColor.r = max(gl_FragColor.r, red);
    gl_FragColor.g = max(gl_FragColor.g, pow(red,7.)*0.25);
    gl_FragColor.b = max(gl_FragColor.b, pow(red,7.)*0.75);
    vec2 ruv = rotateUV(uv, -time*0.5e-1, 0.);
    
        vec2 v0 = vec2(0.1, -0.2);
    vec2 v1 = vec2(0.25, 0.25);
    vec2 v2 = vec2(-0.1, 0.25);
    vec2 muv = vec2(
        fract(abs(ruv.x*0.9)),
        fract(abs(ruv.y*0.9))
    );    
    float a = smoothTriangle(muv+vec2(0.125,-0.125), v0, v1, v2, 0.025);
    a = smoothstep(0., 1., a);
    // gl_FragColor.r = gl_FragColor.r+a*(1.-gl_FragColor.r);
    // gl_FragColor.g = gl_FragColor.g+pow(a,7.)*0.1*(1.-gl_FragColor.g);
    // gl_FragColor.b = gl_FragColor.b+pow(a,7.)*0.1*(1.-gl_FragColor.b);
    // gl_FragColor = vec4(vec3(muv.x*muv.y), 1.);
    float c = abs(uv.y) * 4.-sin((uv.x*0.75+0.5)*pi);
    c = 0.48-abs(c - 0.14);
    c = smoothstep(0.3 , 0.5, c);
    c = smoothstep(0., 1., c);
    c *= (abs(uv.y)+0.1) * 3.;
    gl_FragColor.rgb += vec3(c*0.5, 0., c*0.75)*0.75+(pow(c, 7.)*0.25) * (1.-gl_FragColor.rgb);
}
// endGLSL
`);

// Ellipses, circles, triangles
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse+smoothTriangle+rotateUV}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv + time * 1e-4) * 0.025;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(7., 7.), vec2(3., 1.5));
    r = 0.55-abs(r - 0.5);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2;
    r = pow(r, 3.)*3.;
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    // r *= sin(uv.y*5.+time*1.);
    // r *= map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*2e-1), -1., 1., 0., 1.);
    // r *= ramp;
    float y = 1.0/(length(uv*15.)+0.95);
    float y2 = y;
    y = smoothstep(0.3, 0.5, y);
    y = smoothstep(0., 1., y);
    y = smoothstep(0., 1., y);
    // y = smoothstep(0., 1., y);
    // y = y + r;
    float red = 1.0-length(uv*3.);
    red = 0.65-abs(red-0.35);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    
    red = pow(red*1.1, 7.);
    gl_FragColor = vec4(vec3(pow(y,3.)*0.75+pow(r,7.)*0.5,y+pow(r,7.)*0.85+r, max(y,r)) - rando, 1.0);
    gl_FragColor.r = max(gl_FragColor.r, red);
    gl_FragColor.g = max(gl_FragColor.g, pow(red,7.)*0.25);
    gl_FragColor.b = max(gl_FragColor.b, pow(red,7.)*0.75);
    vec2 ruv = rotateUV(uv, -time*0.5e-1, 0.);
    
        vec2 v0 = vec2(0.1, -0.2);
    vec2 v1 = vec2(0.25, 0.25);
    vec2 v2 = vec2(-0.1, 0.25);
    vec2 muv = vec2(
        fract(abs(ruv.x*0.9)),
        fract(abs(ruv.y*0.9))
    );    
    float a = smoothTriangle(muv+vec2(0.125,-0.125), v0, v1, v2, 0.025);
    a = smoothstep(0., 1., a);
    // gl_FragColor.r = gl_FragColor.r+a*(1.-gl_FragColor.r);
    // gl_FragColor.g = gl_FragColor.g+pow(a,7.)*0.1*(1.-gl_FragColor.g);
    // gl_FragColor.b = gl_FragColor.b+pow(a,7.)*0.1*(1.-gl_FragColor.b);
    // gl_FragColor = vec4(vec3(muv.x*muv.y), 1.);
    float c = abs(uv.y) * 4.-sin((uv.x*0.75+0.5)*pi);
    c = 0.48-abs(c - 0.14);
    c = smoothstep(0.3 , 0.5, c);
    c = smoothstep(0., 1., c);
    c *= (abs(uv.y)+0.1) * 3.;
    gl_FragColor.rgb += vec3(c*0.5, 0., c*0.75)*0.75+(pow(c, 7.)*0.25) * (1.-gl_FragColor.rgb);
    float d = fract(abs(uv.y)*20.*0.125-time*0.5e-1+length(uv*16.*0.125));
    // d = 0.48-abs(d - 0.14);
    d = sin(d*pi) * length(uv);
    // d = smoothstep(0.3 , 0.5, d);
    d = smoothstep(0., 1., d);
    d *= (abs(uv.y)+0.1) * 1.5;
    gl_FragColor.rgb += vec3(d*0.5, 0.0, d*0.75)*0.75+(pow(d, 7.)*0.25) * (1.-gl_FragColor.rgb);
}
// endGLSL
`);

// Ellipses, circles, triangles
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse+smoothTriangle+rotateUV}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv + time * 1e-4) * 0.025;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(7., 7.), vec2(3., 1.5));
    r = 0.55-abs(r - 0.5);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2;
    r = pow(r, 3.)*3.;
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    // r *= sin(uv.y*5.+time*1.);
    // r *= map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*2e-1), -1., 1., 0., 1.);
    // r *= ramp;
    float y = 1.0/(length(uv*15.)+0.95);
    float y2 = y;
    y = smoothstep(0.3, 0.5, y);
    y = smoothstep(0., 1., y);
    y = smoothstep(0., 1., y);
    // y = smoothstep(0., 1., y);
    // y = y + r;
    float red = 1.0-length(uv*3.);
    red = 0.65-abs(red-0.35);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    
    red = pow(red*1.1, 7.);
    gl_FragColor = vec4(vec3(pow(y,3.)*0.75+pow(r,7.)*0.5,y+pow(r,7.)*0.85+r, max(y,r)) - rando, 1.0);
    gl_FragColor.r = max(gl_FragColor.r, red);
    gl_FragColor.g = max(gl_FragColor.g, pow(red,7.)*0.25);
    gl_FragColor.b = max(gl_FragColor.b, pow(red,7.)*0.75);
    vec2 ruv = rotateUV(uv, -time*0.5e-1, 0.);
    
        vec2 v0 = vec2(0.1, -0.2);
    vec2 v1 = vec2(0.25, 0.25);
    vec2 v2 = vec2(-0.1, 0.25);
    vec2 muv = vec2(
        fract(abs(ruv.x*0.9)),
        fract(abs(ruv.y*0.9))
    );    
    float a = smoothTriangle(muv+vec2(0.125,-0.125), v0, v1, v2, 0.025);
    a = smoothstep(0., 1., a);
    // gl_FragColor.r = gl_FragColor.r+a*(1.-gl_FragColor.r);
    // gl_FragColor.g = gl_FragColor.g+pow(a,7.)*0.1*(1.-gl_FragColor.g);
    // gl_FragColor.b = gl_FragColor.b+pow(a,7.)*0.1*(1.-gl_FragColor.b);
    // gl_FragColor = vec4(vec3(muv.x*muv.y), 1.);
    float c = abs(uv.y) * 4.-sin((uv.x*0.75+0.5)*pi);
    c = 0.48-abs(c - 0.14);
    c = smoothstep(0.3 , 0.5, c);
    c = smoothstep(0., 1., c);
    c *= (abs(uv.y)+0.05) * 3.;
    gl_FragColor.rgb += vec3(c*0.5, 0., c*0.75)*0.75+(pow(c, 7.)*0.25) * (1.-gl_FragColor.rgb);
    float d = fract(abs(uv.y)*20.*0.75-time*0.5e-1*0.+length(uv*16.*0.75));
    // d = 0.48-abs(d - 0.14);
    d = sin(d*pi) * length(uv*0.85);
    float ri = rand(vec2(floor(abs(uv.y)*20.*0.75-time*0.5e-1*0.+length(uv*16.*0.75)))+2.);
    d *= map(sin(atan(uv.y,uv.x)*5.*map(ri,0.,10.,1.,4.)+(ri*200.)+time*5e-1),-1.,1.,0.,1.);
    // d = smoothstep(0.3 , 0.5, d);
    // d = pow(d*1.5, 3.);
    d = smoothstep(0., 1., d);
    d *= (abs(uv.y)) * 2.;
    gl_FragColor.rgb += vec3(d*0.5, 0.0, d*0.75)*0.75+(pow(d, 7.)*0.25) * (1.-gl_FragColor.rgb);
}
// endGLSL
`);

// Ellipses, circles, triangles
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse+smoothTriangle+rotateUV+blendingMath}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv + time * 1e-4) * 0.025;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(7., 7.), vec2(3., 1.5));
    r = 0.55-abs(r - 0.5);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2;
    r = pow(r, 3.)*3.;
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    // r *= sin(uv.y*5.+time*1.);
    // r *= map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*2e-1), -1., 1., 0., 1.);
    // r *= ramp;
    float y = 1.0/(length(uv*15.)+0.95);
    float y2 = y;
    y = smoothstep(0.3, 0.5, y);
    y = smoothstep(0., 1., y);
    y = smoothstep(0., 1., y);
    // y = smoothstep(0., 1., y);
    // y = y + r;
    float red = 1.0-length(uv*3.);
    red = 0.65-abs(red-0.35);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    
    red = pow(red*1.1, 7.);
    gl_FragColor = vec4(vec3(pow(y,3.)*0.75+pow(r,7.)*0.5,y+pow(r,7.)*0.85+r, max(y,r)) - rando, 1.0);
    gl_FragColor.r = max(gl_FragColor.r, red);
    gl_FragColor.g = max(gl_FragColor.g, pow(red,7.)*0.25);
    gl_FragColor.b = max(gl_FragColor.b, pow(red,7.)*0.75);
    vec2 ruv = rotateUV(uv, -time*0.5e-1, 0.);
    
        vec2 v0 = vec2(0.1, -0.2);
    vec2 v1 = vec2(0.25, 0.25);
    vec2 v2 = vec2(-0.1, 0.25);
    vec2 muv = vec2(
        fract(abs(ruv.x*0.9)),
        fract(abs(ruv.y*0.9))
    );    
    float a = smoothTriangle(muv+vec2(0.125,-0.125), v0, v1, v2, 0.025);
    a = smoothstep(0., 1., a);
    gl_FragColor.r = gl_FragColor.r+a*(1.-gl_FragColor.r);
    gl_FragColor.g = gl_FragColor.g+pow(a,7.)*0.1*(1.-gl_FragColor.g);
    gl_FragColor.b = gl_FragColor.b+pow(a,7.)*0.1*(1.-gl_FragColor.b);
    // gl_FragColor = vec4(vec3(muv.x*muv.y), 1.);
    float c = abs(uv.y) * 4.-sin((uv.x*0.75+0.5)*pi);
    c = 0.48-abs(c - 0.14);
    c = smoothstep(0.3 , 0.5, c);
    c = smoothstep(0., 1., c);
    c *= (abs(uv.y)+0.1) * 3.;
    gl_FragColor.rgb += vec3(c*0.5, 0., c*0.75)*0.75+(pow(c, 7.)*0.25) * (1.-gl_FragColor.rgb);
    // gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 4.);
}
// endGLSL
`);

// Ellipses, circles, triangles
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse+smoothTriangle+rotateUV+blendingMath}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv + time * 1e-4) * 0.025;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(7., 7.), vec2(3., 1.5));
    r = 0.55-abs(r - 0.5);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2;
    r = pow(r, 3.)*3.;
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    // r *= sin(uv.y*5.+time*1.);
    // r *= map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*2e-1), -1., 1., 0., 1.);
    // r *= ramp;
    float y = 1.0/(length(uv*15.)+0.95);
    float y2 = y;
    y = smoothstep(0.3, 0.5, y);
    y = smoothstep(0., 1., y);
    y = smoothstep(0., 1., y);
    // y = smoothstep(0., 1., y);
    // y = y + r;
    float red = 1.0-length(uv*3.);
    red = 0.65-abs(red-0.35);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    
    red = pow(red*1.1, 7.);
    gl_FragColor = vec4(vec3(pow(y,3.)*0.75+pow(r,7.)*0.5,y+pow(r,7.)*0.85+r, max(y,r)) - rando, 1.0);
    gl_FragColor.r = max(gl_FragColor.r, red);
    gl_FragColor.g = max(gl_FragColor.g, pow(red,7.)*0.25);
    gl_FragColor.b = max(gl_FragColor.b, pow(red,7.)*0.75);
    vec2 ruv = rotateUV(uv, -time*0.5e-1, 0.);
    
        vec2 v0 = vec2(0.1, -0.2);
    vec2 v1 = vec2(0.4, 0.5);
    vec2 v2 = vec2(-0.1, 0.5);
    vec2 muv = vec2(
        fract(abs(ruv.x*0.9)),
        fract(abs(ruv.y*0.9))
    );    
    float a = smoothTriangle(muv+vec2(0.125,-0.125), v0, v1, v2, 0.025);
    a = smoothstep(0., 1., a);
    a *= sin(length(uv*120.)-time*4e-1)*0.5+0.5;
    a *= smoothstep(1.2, 1.5, 1.0-length(uv)+0.75);
    gl_FragColor.r = gl_FragColor.r+a*(1.-gl_FragColor.r);
    gl_FragColor.g = gl_FragColor.g+pow(a,7.)*0.2*(1.-gl_FragColor.g);
    gl_FragColor.b = gl_FragColor.b+pow(a,7.)*0.3*(1.-gl_FragColor.b);
    // gl_FragColor = vec4(vec3(muv.x*muv.y), 1.);
    float c = abs(uv.y) * 4.-sin((uv.x*0.75+0.5)*pi);
    c = 0.48-abs(c - 0.14);
    c = smoothstep(0.3 , 0.5, c);
    c = smoothstep(0., 1., c);
    c *= (abs(uv.y)+0.05) * 3.;
    gl_FragColor.rgb += vec3(c*0.5, 0., c*0.75)*0.75+(pow(c, 7.)*0.25) * (1.-gl_FragColor.rgb);
    // gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 4.);
}
// endGLSL
`);
    

// Ellipses, circles, triangles
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse+smoothTriangle+rotateUV+blendingMath}
void main() {
    float fog = map(sin(time*5e-1), -1., 1., 0.01, 1.);
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    uv *= map(fog, 0., 1., 0.98, 1.);
    float rando = rand(uv + time * 1e-4) * 0.025;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(7., 7.), vec2(3., 1.5));
    r = 0.55*1.-abs(r - 0.5*1.);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2;
    r = pow(r, 3.*fog)*3.*map(fog,0.,1.,0.01,0.8);
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    // r *= sin(uv.y*5.+time*1.);
    // r *= map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*2e-1), -1., 1., 0., 1.);
    // r *= ramp;
    float y = 1.0/(length(uv*15.)+0.95);
    float y2 = y;
    y = mix(smoothstep(0., 0.5, y), smoothstep(0.3, 0.5, y), pow(fog, 0.5));
    y = smoothstep(0., 1., y);
    y = smoothstep(0., 1., y);
    // y = smoothstep(0., 1., y);
    // y = y + r;
    float red = 1.0-length(uv*3.);
    red = 0.65-abs(red-0.35);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    
    red = mix(red, pow(red*1.1, 7.*fog)*fog*1.1, fog);
    gl_FragColor = vec4(vec3(pow(y,3.)*0.75+pow(r,7.)*0.5,y+pow(r,7.)*0.85+r, max(y,r)) - rando, 1.0);
    gl_FragColor.r = max(gl_FragColor.r, red);
    gl_FragColor.g = max(gl_FragColor.g, pow(red,7.)*0.25);
    gl_FragColor.b = max(gl_FragColor.b, pow(red,7.)*0.75);
    vec2 ruv = rotateUV(uv, -time*0.5e-1, 0.);
    
        vec2 v0 = vec2(0.1, -0.2);
    vec2 v1 = vec2(0.4, 0.5);
    vec2 v2 = vec2(-0.1, 0.5);
    vec2 muv = vec2(
        fract(abs(ruv.x*0.9)),
        fract(abs(ruv.y*0.9))
    );    
    float a = smoothTriangle(muv+vec2(0.125,-0.125), v0, v1, v2, mix(0.1, 0.025, fog));
    a = smoothstep(0., 1., a);
    a *= mix(1., sin(length(uv*120.)-time*4e-1)*0.5+0.5, min(1.,fog+0.1));
    a *= smoothstep(1.2, 1.5, 1.0-length(uv)+0.75) * pow(fog, 0.25);
    gl_FragColor.r = gl_FragColor.r+a*(1.-gl_FragColor.r);
    gl_FragColor.g = gl_FragColor.g+pow(a,7.)*0.2*(1.-gl_FragColor.g);
    gl_FragColor.b = gl_FragColor.b+pow(a,7.)*0.3*(1.-gl_FragColor.b);
    // gl_FragColor = vec4(vec3(muv.x*muv.y), 1.);
    float c = abs(uv.y) * 4.-sin((uv.x*0.75+0.5)*pi);
    c = 0.48-abs(c - 0.14);
    c = mix(c*2., smoothstep(0.3 , 0.5, c), fog);
    c = smoothstep(0., 1., c);
    c *= (abs(uv.y)+0.05) * 3.;
    gl_FragColor.rgb += vec3(c*0.5, 0., c*0.75)*0.75+(pow(c, 7.)*0.25) * (1.-gl_FragColor.rgb);
    // gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 1.*fog);
    gl_FragColor.rgb *= pow(fog, 0.5);
}
// endGLSL
`);

// Ellipses, circles, triangles
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse+smoothTriangle+rotateUV}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv + time * 1e-4) * 0.025;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(7., 7.), vec2(3., 1.5));
    r = 0.55-abs(r - 0.5);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2;
    r = pow(r, 3.)*3.;
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    // r *= sin(uv.y*5.+time*1.);
    // r *= map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*2e-1), -1., 1., 0., 1.);
    // r *= ramp;
    float y = 1.0/(length(uv*15.)+0.95);
    float y2 = y;
    y = smoothstep(0.3, 0.5, y);
    y = smoothstep(0., 1., y);
    y = smoothstep(0., 1., y);
    // y = smoothstep(0., 1., y);
    // y = y + r;
    float red = 1.0-length(uv*3.);
    red = 0.65-abs(red-0.35);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    
    red = pow(red*1.1, 7.);
    gl_FragColor = vec4(vec3(pow(y,3.)*0.75+pow(r,7.)*0.5,y+pow(r,7.)*0.85+r, max(y,r)) - rando, 1.0);
    gl_FragColor.r = max(gl_FragColor.r, red);
    gl_FragColor.g = max(gl_FragColor.g, pow(red,7.)*0.25);
    gl_FragColor.b = max(gl_FragColor.b, pow(red,7.)*0.75);
    vec2 ruv = rotateUV(uv, -time*0.5e-1, 0.);
    
        vec2 v0 = vec2(0.1, -0.2);
    vec2 v1 = vec2(0.25, 0.25);
    vec2 v2 = vec2(-0.1, 0.25);
    vec2 muv = vec2(
        fract(abs(ruv.x*0.9)),
        fract(abs(ruv.y*0.9))
    );    
    float a = smoothTriangle(muv+vec2(0.125,-0.125), v0, v1, v2, 0.025);
    a = smoothstep(0., 1., a);
    // gl_FragColor.r = gl_FragColor.r+a*(1.-gl_FragColor.r);
    // gl_FragColor.g = gl_FragColor.g+pow(a,7.)*0.1*(1.-gl_FragColor.g);
    // gl_FragColor.b = gl_FragColor.b+pow(a,7.)*0.1*(1.-gl_FragColor.b);
    // gl_FragColor = vec4(vec3(muv.x*muv.y), 1.);
    float c = abs(uv.y) * 4.-sin((uv.x*0.75+0.5)*pi);
    float cc = c;
    c = 0.48-abs(c - 0.14);
    c = smoothstep(0.3 , 0.5, c);
    c = smoothstep(0., 1., c);
    c *= (abs(uv.y)+0.05) * 3.;
    gl_FragColor.rgb += vec3(c*0.5, 0., c*0.75)*0.75+(pow(c, 7.)*0.25) * (1.-gl_FragColor.rgb);
    float d = fract(abs(uv.y)*20.*0.75-time*0.5e-1*0.+length(uv*16.*0.75));
    // d = 0.48-abs(d - 0.14);
    d = sin(d*pi) * length(uv*0.85);
    float ri = rand(vec2(floor(abs(uv.y)*20.*0.75-time*0.5e-1*0.+length(uv*16.*0.75)))+2.);
    d *= map(sin(atan(uv.y,uv.x)*5.*map(ri,0.,10.,1.,4.)+(ri*200.)+time*5e-1),-1.,1.,0.,1.);
    // d = smoothstep(0.3 , 0.5, d);
    // d = pow(d*1.5, 3.);
    d = smoothstep(0., 1., d);
    d *= (abs(uv.y)) * 2.;
    gl_FragColor.rgb += vec3(d*0.5, 0.0, d*0.75)*0.75+(pow(d, 7.)*0.25) * (1.-gl_FragColor.rgb);
    // gl_FragColor.rgb += vec3(pow(cc,1.5)*0.15-rando*5., 0., pow(cc,1.5)*0.05-rando*1.).bgr*0.5;
}
// endGLSL
`);

// Ellipses, circles, triangles
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse+smoothTriangle+rotateUV}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv + time * 1e-4) * 0.025;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(7., 7.), vec2(3., 1.5));
    r = 0.55-abs(r - 0.5);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2;
    r = pow(r, 3.)*3.;
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    // r *= sin(uv.y*5.+time*1.);
    // r *= map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*2e-1), -1., 1., 0., 1.);
    // r *= ramp;
    float y = 1.0/(length(uv*15.)+0.95);
    float y2 = y;
    y = smoothstep(0.3, 0.5, y);
    y = smoothstep(0., 1., y);
    y = smoothstep(0., 1., y);
    // y = smoothstep(0., 1., y);
    // y = y + r;
    float red = 1.0-length(uv*3.);
    red = 0.65-abs(red-0.35);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    red = smoothstep(0., 1., red);
    
    red = pow(red*1.1, 7.);
    gl_FragColor = vec4(vec3(pow(y,3.)*0.75+pow(r,7.)*0.5,y+pow(r,7.)*0.85+r, max(y,r)) - rando, 1.0);
    gl_FragColor.r = max(gl_FragColor.r, red);
    gl_FragColor.g = max(gl_FragColor.g, pow(red,7.)*0.25);
    gl_FragColor.b = max(gl_FragColor.b, pow(red,7.)*0.75);
    vec2 ruv = rotateUV(uv, -time*0.5e-1, 0.);
    
        vec2 v0 = vec2(0.1, -0.2);
    vec2 v1 = vec2(0.25, 0.25);
    vec2 v2 = vec2(-0.1, 0.25);
    vec2 muv = vec2(
        fract(abs(ruv.x*0.9)),
        fract(abs(ruv.y*0.9))
    );    
    float a = smoothTriangle(muv+vec2(0.125,-0.125), v0, v1, v2, 0.025);
    a = smoothstep(0., 1., a);
    // gl_FragColor.r = gl_FragColor.r+a*(1.-gl_FragColor.r);
    // gl_FragColor.g = gl_FragColor.g+pow(a,7.)*0.1*(1.-gl_FragColor.g);
    // gl_FragColor.b = gl_FragColor.b+pow(a,7.)*0.1*(1.-gl_FragColor.b);
    // gl_FragColor = vec4(vec3(muv.x*muv.y), 1.);
    float c = abs(uv.y) * 4.-sin((uv.x*0.75+0.5)*pi);
    float cc = c;
    c = 0.48-abs(c - 0.14);
    c = smoothstep(0.3 , 0.5, c);
    c = smoothstep(0., 1., c);
    c *= (abs(uv.y)+0.05) * 3.;
    gl_FragColor.rgb += vec3(c*0.5, 0., c*0.75)*0.75+(pow(c, 7.)*0.25) * (1.-gl_FragColor.rgb);
    float d = fract(abs(uv.y)*20.*0.75-time*0.5e-1*4.+length(uv*16.*0.75));
    // d = 0.48-abs(d - 0.14);
    d = sin(d*pi) * length(uv*0.85);
    float ri = rand(vec2(floor(abs(uv.y)*20.*0.75-time*0.5e-1*4.+length(uv*16.*0.75)))+2.);
    d *= map(sin(atan(uv.y,uv.x)*5.*map(ri,0.,10.,1.,4.)+(ri*200.)+time*5e-1),-1.,1.,0.,1.);
    // d = smoothstep(0.3 , 0.5, d);
    // d = pow(d*1.5, 3.);
    d = smoothstep(0., 1., d);
    d *= (abs(uv.y)) * 2.;
    gl_FragColor.rgb += vec3(d*0.5, 0.0, d*0.75)*0.75+(pow(d, 7.)*0.25) * (1.-gl_FragColor.rgb);
    // gl_FragColor.rgb += vec3(pow(cc,1.5)*0.15-rando*5., 0., pow(cc,1.5)*0.05-rando*1.).bgr*0.5;
}
// endGLSL
`);

// Fluctuating ellipse
// Works as a schematic version of an ouroboros
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv+vec2(time*1e-3)) * 0.05;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(5., 5.), vec2(3., 1.5));
    r = 1.0-abs(r*4. - 0.5);
    
    r = smoothstep(0., 1., r);
    // r = smoothstep(0., 1., r);
    // r = r2;
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    // r *= sin(uv.y*5.+time*1.);
    r *= map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*1e-1), -1., 1., 0., 1.);
    // r *= ramp;
    gl_FragColor = vec4(vec3(r, pow(r,7.)*0.25, pow(r,7.)*0.5) - rando, 1.0);
}
// endGLSL
`);

// Fluctuating ellipse
// Works as a schematic version of an ouroboros
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv+vec2(time*1e-3)) * 0.05;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * vec2(5., 5.), vec2(3., 1.5));
    // r = 1.0-abs(r*4. - 0.5);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r *= map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*1e-1), -1., 1., 0., 1.);
    // r *= ramp;
    gl_FragColor = vec4(vec3(r, pow(r,3.)*0.25*2., pow(r,3.)*0.5*2.) - rando, 1.0);
}
// endGLSL
`);


// Fluctuating ellipse
// Concentric ellipses
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
${sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv+vec2(time*1e-3)) * 0.05;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * vec2(5., 5.), vec2(3., 1.5));
    // r = 1.0-abs(r*4. - 0.5);
    // r = max(-0.1, r);
    float r2 = 1.0-sdEllipse(uv * vec2(5., 5.), vec2(3., 1.5));
    r2 = smoothstep(0.5, 0.9, r2);
    r = sin(r*10.*(5.-r)-time*5e-1)*0.5+0.5;
    r *= 1.0-r2;
    // r = smoothstep(0., 1., r);
    // r = smoothstep(0., 1., r);
    // r = smoothstep(0., 1., r);
    r *= map(sin(atan(uv.y, uv.x)+(pi*-1.)+time*1e-1), -1., 1., 0., 1.);
    // r *= ramp;
    float a = 1.0-sdEllipse(uv * vec2(3.5, 3.5), vec2(3., 1.5));
    a = max(0., a);
    a = min(1.15, a);
    // a = smoothstep(0., 1., a);
    // a = smoothstep(0., 1., a);
    r *= a;
    // r  =a;
    gl_FragColor = vec4(vec3(r, pow(r,3.)*0.25*2., pow(r,3.)*0.5*2.) - rando, 1.0);
}
// endGLSL
`);

// Fluctuating ellipse
// Concentric ellipses
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
${sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv+vec2(time*1e-3)) * 0.05;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float ramp = fract(time * -1e-2);
    float r = sdEllipse(uv * vec2(5., 5.), vec2(3., 1.5));
    // r = 1.0-abs(r*4. - 0.5);
    // r = max(-0.1, r);
    float r2 = 1.0-sdEllipse(uv * vec2(5., 5.), vec2(3., 1.5));
    r2 = smoothstep(0.5, 0.9, r2);
    r = sin(r*10.*(5.-r)-time*5e-1)*0.5+0.5;
    r *= 1.0-r2;
    // r = smoothstep(0., 1., r);
    // r = smoothstep(0., 1., r);
    // r = smoothstep(0., 1., r);
    vec2 muv = rotateUV(uv, time*1e-2*1.-pi*0.5, 0.0);
    float flash = pow(map(sin(atan(muv.y, muv.x)), -1., 1., 0., 1.),20.);
    r *= flash;
    r = r+flash*(1.-r);
    // r *= ramp;
    // r += pow(map(sin(atan(muv.y, muv.x)), -1., 1., 0., 1.),20.);
    float a = 1.0-sdEllipse(uv * vec2(3.5, 3.5), vec2(3., 1.5));
    a = max(0., a);
    a = min(1.15, a);
    // a = smoothstep(0., 1., a);
    // a = smoothstep(0., 1., a);
    r *= a;
    // r  =a;
    gl_FragColor = vec4(vec3(r, pow(r,3.)*0.25*2., pow(r,3.)*0.5*2.) - rando, 1.0);
}
// endGLSL
`);

// Fluctuating ellipse
setBothShaders(`
// beginGLSL
precision mediump float;
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
${sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv) * 0.05;
    // uv = rotateUV(uv, time * -0.1, 0.5);
    float r = sdEllipse(uv * 10., vec2(2., 1.5));
    r = 1. - r;
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2-r;
    r = sdEllipse(uv * vec2(7., 7.), vec2(3., 1.5));
    r = 1.0-abs(r - 0.5);
    
    r = smoothstep(0., 1., r);
    r = smoothstep(0., 1., r);
    // r = r2;
    float b = length(uv*10.);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    b = smoothstep(0., 1., b);
    // r = pow(r, 1.5)*1.
    
    r += smoothstep(0., 1., max(0.,1.0-length(uv*6.)));
    r *= sin(uv.y*5.+time*1e-1);
    // float b = 
    gl_FragColor = vec4(vec3(r, 0., smoothstep(0., 1., pow(r, 7.))*0.5) - rando, 1.0);
}
// endGLSL
`);

// Rotating colourful grid
setBothShaders(`
// beginGLSL
precision mediump float;
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
// https://gist.github.com/ayamflow/c06bc0c8a64f985dd431bd0ac5b557cd
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
vec2 rotateUV2(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation + sin(uv.x * 1e2)) * (uv.x - mid) + sin(rotation + sin(uv.x * 1e2)) * (uv.y - mid) + mid,
      cos(rotation + cos(uv.y * 1e2)) * (uv.y - mid) - sin(rotation + sin(uv.x * 1e2)) * (uv.x - mid) + mid
    );
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = rotateUV(uv, time * -0.025, 0.5);
    uv = rotateUV2(uv, time * -0.1, 0.5);
    gl_FragColor = vec4(uv.x, uv.y, 1.0 - uv.x, 1.0);
}
// endGLSL
`);

// Melting crayons
setBothShaders(`
// beginGLSL
precision mediump float;
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
// https://gist.github.com/ayamflow/c06bc0c8a64f985dd431bd0ac5b557cd
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
vec2 rotateUV2(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation * uv.x / 50. + sin(uv.x * 3e1)) * (uv.x - mid) + sin(rotation + sin(uv.x * 3e1)) * (uv.y - mid) + mid,
      cos(rotation * uv.x / 50. + cos(uv.y * 3e1)) * (uv.y - mid) - sin(rotation + sin(uv.x * 3e1)) * (uv.x - mid) + mid
    );
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = rotateUV(uv, time * -0.025, 0.5);
    uv = rotateUV2(uv, time * -0.1, 0.5);
    gl_FragColor = vec4(uv.x, 1.0 - uv.y, sin(uv.y*1e1), 1.0);
}
// endGLSL
`);

}