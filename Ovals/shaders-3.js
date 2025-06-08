if (false) {

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
    
    float rando = rand(uv) * 0.075;
    float c = 1.0-length(uv*1.5);
    float c2 = c;
    c2 = smoothstep(0., 1., c2);
    c = smoothstep(0.5, 0.515, c);
    float m = smoothstep(0.,1.,clamp(uv.x * 96.,0.,1.));
    // c *= m;
    gl_FragColor = vec4(vec3(c*m, 0., 1.-m-c-c2)-rando, 1.);
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
float rings(vec2 u) {
    float o = length(u*1.5);
    float c = 1.0-o;
    float cy = fract(c*15.+time*1e-1);
    float cx = floor(c*15.+time*1e-1);
    float waves = sin((atan(u.y, u.x)+cx+time*5e-2)*4.)*0.5+0.5;
    c = sin(cy*pi);
    c = pow(c, 17.) + (c * 0.75);
    c *= rand(vec2(cx));
    c *= waves;
    c *= pow(o, 0.5);
    c *= smoothstep(0., 0.5, 1.0-length(u));
    return c;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float n = rand(uv) * 0.025;
    float c = rings(uv + vec2(0.2,0.5));
    c += rings(uv + vec2(0.5, -0.4)) * (1.-c);
    c += rings(uv - vec2(1.2, 0.4))*0.5 * (1.-c);
    c += rings(uv - vec2(0.5, 1.0))*0.5 * (1.-c);
    c += rings(uv - vec2(0.5, -0.5))*0.5 * (1.-c);
    float g = pow(c, 7.)*0.2;
    gl_FragColor = vec4(vec3(c*0.5,0., c)+g-n, 1.);
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
float rings(vec2 u, float t) {
    float o = length(u*1.5);
    float c = 1.0-o;
    float cy = fract(c*10.+t*1e-1);
    float cx = floor(c*10.+t*1e-1);
    float waves = sin((atan(u.y, u.x)+cx+t*5e-2)*4.)*0.5+0.5;
    c = sin(cy*pi);
    // c = pow(c, 7.) + (c * 0.75);
    c *= rand(vec2(cx));
    c *= waves;
    c *= pow(o, 0.5);
    c *= smoothstep(0., 0.75, 1.0-length(u));
    return c;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float n = rand(uv) * 0.025;
    float c = rings(uv + vec2(0.25,0.4), time);
    c += rings(uv + vec2(0.5, -0.4), time + 1e1) * (1.-c);
    c += rings(uv - vec2(1.2, 0.4), time + 1.25e2)*0.5 * (1.-c);
    c += rings(uv - vec2(0.5, 1.0), time + 2e3)*0.5 * (1.-c);
    c += rings(uv - vec2(0.5, -0.25), time + 3.234e3)*0.5 * (1.-c);
    gl_FragColor = vec4(vec3(c*0.5,0., c)-n, 1.);
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
float rings(vec2 u, float t) {
    float o = length(u*1.5);
    float c = 1.0-o;
    float cy = fract(c*10.+t*1e-1);
    float cx = floor(c*10.+t*1e-1);
    float waves = sin((atan(u.y, u.x)+cx+t*5e-2)*4.)*0.5+0.5;
    c = sin(cy*pi);
    // c = pow(c, 7.) + (c * 0.75);
    // c = pow(c, 7.);
    c *= rand(vec2(cx));
    c *= waves;
    c *= pow(o, 0.5);
    c *= smoothstep(0., 0.75, 1.0-length(u));
    return c;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float n = rand(uv) * 0.025;
    float c = rings(uv + vec2(0.25,0.4), time);
    float c2 = rings(uv + vec2(0.5, -0.4), time + 1e1);
    float c3 = rings(uv - vec2(1.2, 0.4), time + 1.25e2)*0.5;
    float c4 = rings(uv - vec2(0.5, 1.0), time + 2e3)*0.5;
    float c5 = rings(uv - vec2(0.5, -0.25), time + 3.234e3)*0.5;
    // c = BlendScreenf(c, c2);
    c = c + c2*(1.-c);
    c = c + c3*(1.-c);
    c = c + c4*(1.-c);
    c = c + c5*(1.-c);
    // vec3 col = BlendScreen(vec3(c*0.5,0., c), vec3(c2*0.5,0., c2));
    gl_FragColor = vec4(vec3(c*0.5,0., c)-n, 1.);
    // gl_FragColor = vec4(col-n, 1.);
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
float sdMoon(vec2 p, float d, float ra, float rb ) {
    p.y = abs(p.y);
    float a = (ra*ra - rb*rb + d*d)/(2.0*d);
    float b = sqrt(max(ra*ra-a*a,0.0));
    if( d*(p.x*b-p.y*a) > d*d*max(b-p.y,0.0) )
          return length(p-vec2(a,b));
    return max( (length(p          )-ra),
               -(length(p-vec2(d,0))-rb));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    
    float rando = rand(uv) * 0.025;
    float c = sdMoon(uv*8., 0.5, 1.3, 1.);
    c = 1.-c;
    c = mix(c, smoothstep(0.8, 1., c),0.65);
    c = max(0., c);
    float c2 = pow(c,7.)*0.4;
    c2 = smoothstep(0., 1., c2);
    c2 = smoothstep(0., 1., c2);
    gl_FragColor = vec4(vec3(c, c2*0.75, c2)-rando, 1.);
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
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    
    float rando = rand(uv) * 0.025;
    float x = length(uv*20.25);
    float a = 16.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
    x = min(abs(b),sign(b))*sign(b)+floor(x);
    x *= 0.1;
    gl_FragColor = vec4(vec3(1.0-x, 0., 0.)-rando, 1.);
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
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    
    float rando = rand(uv) * 0.025;
    float x = length(uv*20.25);
    float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 16.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
    x = min(abs(b),sign(b))*sign(b)+floor(x);
    x *= 0.05;
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = vec3(0., 1., 1.);
    vec3 c3 = mix(c2, c1, x);
    gl_FragColor = vec4(c3*(1.-x)-rando, 1.);
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
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    
    float rando = rand(uv) * 0.025;
    float x = length(uv*20.25);
    float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 16.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
    x = min(abs(b),sign(b))*sign(b)+floor(x);
    x *= 0.05;
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = vec3(0., 1., 1.).gbr;
    vec3 c3 = mix(c2, c1, x);
    gl_FragColor = vec4(c3*(1.-x)-rando, 1.);
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
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    
    float rando = rand(uv) * 0.025;
    float x = length(uv*20.25);
    float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 16.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
    x = min(abs(b),sign(b))*sign(b)+floor(x);
    x *= 0.05;
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = mix(
        vec3(0., 1., 1.).gbr,
        vec3(0., 1., 1.),
        atan(uv.y, uv.x)
    );
    vec3 c3 = mix(c2, c1, x);
    gl_FragColor = vec4(c3*(1.-x)-rando, 1.);
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
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    
    float rando = rand(uv) * 0.025;
    float x = length(uv*20.25);
    float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 16.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
    x = min(abs(b),sign(b))*sign(b)+floor(x);
    x *= 0.05;
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = mix(
        vec3(0., 1., 1.).gbr,
        vec3(0., 1., 1.),
        // abs(map(atan(uv.y, uv.x), -pi, pi, -2., 2.))
        smoothstep(0., 2., map(sin(atan(uv.y, uv.x)+(pi*-1.)+time*1e-1*0.), -1., 1., 0., 1.*(10.*x)))*1.65
    );
    vec3 c3 = mix(c2, c1, x);
    gl_FragColor = vec4(c3*(1.-x)-rando, 1.);
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
${blendingMath}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    
    float rando = rand(uv) * 0.025;
    float x = length(uv*20.25);
    float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 16.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
    x = min(abs(b),sign(b))*sign(b)+floor(x);
    x *= 0.1;
    x = min(1., x);
    x = max(0.1, x);
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = mix(
        vec3(0., 1., 1.).gbr,
        vec3(0., 1., 1.),
        // abs(map(atan(uv.y, uv.x), -pi, pi, -2., 2.))
        smoothstep(0., 5., map(sin(atan(uv.y, uv.x)+(pi*-1.)+time*1e-1*0.), -1., 1., 0., 1.*(10.*x)))*1.65
    );
    vec3 c3 = mix(c2, c1, x);
    gl_FragColor = vec4(c3*(1.-x)-rando, 1.);
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
${blendingMath+rotateUV}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    
    uv = rotateUV(uv,-time*1e-1,0.);
    
    float rando = rand(uv) * 0.025;
    float x = length(uv*20.25);
    float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 16.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
    x = min(abs(b),sign(b))*sign(b)+floor(x);
    x *= 0.1;
    x = min(1., x);
    x = max(0.1, x);
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = mix(
        vec3(0., 0., 1.).gbr,
        vec3(1., 0., 1.),
        // abs(map(atan(uv.y, uv.x), -pi, pi, -2., 2.))
        smoothstep(0., 5., map(sin(atan(uv.y, uv.x)+(pi*-1.)+time*1e-1*0.), -1., 1., 0., 1.*(10.*x)))*1.
    );
    vec3 c3 = mix(c2, c1, x);
    gl_FragColor = vec4(c3*(1.-x)-rando, 1.);
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
${blendingMath+rotateUV+sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv+time*1e-2) * 0.025;
    float x = length(uv*20.25);
    x = sdEllipse(uv * 20., vec2(3., 1.5));
    float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 16.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
    x = min(abs(b),sign(b))*sign(b)+floor(x);
    x *= 0.1;
    x = min(1., x);
    x = max(0.1, x);
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = mix(
        vec3(0., 0., 1.).gbr,
        vec3(1., 0., 1.),
        // abs(map(atan(uv.y, uv.x), -pi, pi, -2., 2.))
        smoothstep(0., 5., map(sin(atan(uv.y, uv.x)+(pi*-2.)+time*1e-1*1.), -1., 1., 0., 1.*(10.*x)))*1.
    );
    vec3 c3 = mix(c2, c1, x);
    gl_FragColor = vec4(c3*(1.-x)-rando, 1.);
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
${blendingMath+rotateUV+sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    uv = rotateUV(uv, time*6e-2, 0.);
    float rando = rand(uv+time*1e-2) * 0.025;
    float x = length(uv*20.25);
    x = sdEllipse(uv * 20., vec2(3., 1.5+5.*(sin(time*1e-1)*0.5+0.5)));
    float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 6.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
    float c = min(abs(b),sign(b))*sign(b);
    c = smoothstep(0., 1., c);
    c = smoothstep(0., 1., c);
    c = smoothstep(0., 1., c);
    x = c+floor(x);
    x *= 0.1;
    x = min(1., x);
    x = max(0.1, x);
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = mix(
        vec3(0., 1., 1.).gbr,
        vec3(0., 1., 1.),
        // abs(map(atan(uv.y, uv.x), -pi, pi, -2., 2.))
        smoothstep(0., 5., map(sin(atan(uv.y, uv.x)+(pi*-2.)+time*2e-1*1.), -1., 1., 0., 1.*(10.*x)))*3.
    );
    vec3 c3 = mix(c2, c1, x);
    gl_FragColor = vec4(c3*(1.-x)-rando, 1.);
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
${blendingMath+rotateUV+sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    // uv = rotateUV(uv, time*6e-2, 0.);
    float rando = rand(uv+time*1e-2) * 0.025;
    float x = length(uv*20.25);
    x = sdEllipse(uv * 30., vec2(3., 1.5));
    float ox = x;
    float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 6.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
    float c = min(abs(b),sign(b))*sign(b);
    c = smoothstep(0., 1., c);
    c = smoothstep(0., 1., c);
    c = smoothstep(0., 1., c);
    x = c+floor(x);
    x *= 0.1;
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = mix(
        vec3(0., 1., 1.).gbr,
        vec3(0., 1., 1.),
        // abs(map(atan(uv.y, uv.x), -pi, pi, -2., 2.))
        smoothstep(0., 5., map(sin(atan(uv.y, uv.x)+(pi*-2.)+time*2e-1*0.), -1., 1., 0., 1.*(10.*x)))*3.
    );
    vec3 c3 = mix(c2, c1, x);
    c3 = ContrastSaturationBrightness(c3, 1., 0.5, 3.);
    gl_FragColor = vec4((1.0-(1.0-c3)*x)-rando, 1.);
    gl_FragColor.rgb *= 1.0-vec3(smoothstep(0.8,0.81,ox*0.1));
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
${blendingMath+rotateUV+sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    float rando = rand(uv+time*1e-2) * 0.025;
    float x = length(uv*20.25);
    x = sdEllipse(uv * 20., vec2(3., 1.5));
    float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 16.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
    x = min(abs(b),sign(b))*sign(b)+floor(x);
    x *= 0.1;
    x = min(1., x);
    x = max(0.1, x);
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = mix(
        vec3(0., 0., 1.).gbr,
        vec3(1., 0., 1.),
        // abs(map(atan(uv.y, uv.x), -pi, pi, -2., 2.))
        smoothstep(0., 5., map(sin(atan(uv.y, uv.x)+(pi*-2.)+time*1e-1*1.), -1., 1., 0., 1.*(10.*x)))*1.
    );
    vec3 c3 = mix(c2, c1, x);
    c3 = ContrastSaturationBrightness(c3, 2., 1.4, 0.5);
    gl_FragColor = vec4(c3*(1.-x)-rando, 1.);
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
${blendingMath}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    
    float rando = rand(uv+time*1e-1) * 0.025;
    float x = length(uv*20.25);
    float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 16.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
    x = min(abs(b),sign(b))*sign(b)+floor(x);
    x *= 0.1;
    x = min(1., x);
    x = max(0.1, x);
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = mix(
        vec3(0., 1., 1.).gbr,
        vec3(0., 1., 1.),
        // abs(map(atan(uv.y, uv.x), -pi, pi, -2., 2.))
        smoothstep(0., 5., map(sin(atan(uv.y, uv.x)+(pi*-1.)+time*1e-1*1.), -1., 1., 0., 1.*(10.*x)))*1.65
    );
    vec3 c3 = mix(c2, c1, x);
    c3 = ContrastSaturationBrightness(c3, 2.2, 1.9, 0.5);
    gl_FragColor = vec4(c3*(1.-x)-rando, 1.);
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
${blendingMath}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    
    float rando = rand(uv+time*1e-2) * 0.025;
    float x = length(uv*10.25);
    float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 32.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
    float c = min(abs(b),sign(b))*sign(b);
    c = smoothstep(0., 1., c);
    c = smoothstep(0., 1., c);
    c = smoothstep(0., 1., c);
    float p = fract(x-(1./(2.*a)));
    // p = fract(x+0.4);
    p = sin(p*pi);
    p = pow(p, 2.);
    // p = smoothstep(0., 1., p);
    // p = smoothstep(0., 1., p);
    x = c+floor(x);
    x *= 0.1;
    // x = min(1., x);
    // x = max(0.1, x);
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(0., 0., 1.);
    vec3 c2 = mix(
        vec3(0., 1., 1.).gbr,
        vec3(0., 1., 1.),
        // abs(map(atan(uv.y, uv.x), -pi, pi, -2., 2.))
        smoothstep(0., 5., map(sin(atan(uv.y, uv.x)+(pi*-1.)+time*0.5e-1), -1., 1., 0., 3.))*(1.-x)
    );
    vec3 c3 = mix(c2, c1, x);
    // c3 = c1;
    // c3 *= map(sin(atan(uv.y, uv.x)+x*8.+(pi*-1.)+time*0.5e-1*1.), -1., 1., 0., pow(x,0.5))*smoothstep(0., 0.8,x);
    // c3 = mix(c3, ContrastSaturationBrightness(c3, 15.2, 1.9, 0.5), 1.0-x);
    gl_FragColor = vec4(hueShift(c3*1.0-(p*-0.5), 2.)*(1.-x)-rando, 1.);
    gl_FragColor.rgb = c3*(1.0-x);
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
${blendingMath+sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    
    float rando = rand(uv+time*1e-2) * 0.025;
    // uv = vec2( uv.x, max(0.,abs(uv.y)-0.1)*sign(uv.y));
    float x = length(uv*20.25);
        x = sdEllipse(uv * 20., vec2(3., 1.5));
float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 8.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
        float c = min(abs(b),sign(b))*sign(b);
    c = smoothstep(0., 1., c);
    c = smoothstep(0., 1., c);
    c = smoothstep(0., 1., c);
    x = c+floor(x);
    x *= 0.05;
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = mix(
        vec3(0., 1., 1.).gbr,
        vec3(0., 1., 1.),
        // abs(map(atan(uv.y, uv.x), -pi, pi, -2., 2.))
        smoothstep(0., 2., map(sin(atan(uv.y, uv.x)+(pi*-1.)+time*1e-1*0.), -1., 1., 0., 1.*(10.*x)))*1.65
    );
    vec3 c3 = mix(c2, c1, x);
    c3 = c3*(1.-x);
        c3 = mix(c3, ContrastSaturationBrightness(c3, 1.1, 1.3, 1.), 1.0-x);
    gl_FragColor = vec4(c3-rando, 1.);
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
${blendingMath+sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    
    float rando = rand(uv+time*1e-2) * 0.025;
    // uv = vec2( uv.x, max(0.,abs(uv.y)-0.1)*sign(uv.y));
    uv.y+=0.5;
    float x = length(uv*20.25);
        x = sdEllipse(uv * 20., vec2(3., 1.5));
float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 8.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
        float c = min(abs(b),sign(b))*sign(b);
    c = smoothstep(0., 1., c);
    c = smoothstep(0., 1., c);
    c = smoothstep(0., 1., c);
    x = c+floor(x);
    x *= 0.05;
    x = max(0., abs(x-0.5)+0.5);
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = mix(
        vec3(0., 1., 1.).gbr,
        vec3(0., 1., 1.),
        // abs(map(atan(uv.y, uv.x), -pi, pi, -2., 2.))
        smoothstep(0., 2., map(sin(atan(uv.y, uv.x)+(pi*-1.)+time*1e-1*0.), -1., 1., 0., 1.*(10.*x)))*1.65
    );
    vec3 c3 = mix(c2, c1, x);
    c3 = c3*(1.-x);
        c3 = mix(c3, ContrastSaturationBrightness(c3, 2.4, 1., 1.5), 1.0-x);
    gl_FragColor = vec4(c3-rando, 1.);
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
float rings(vec2 u) {
    float o = length(u*1.5);
    float c = 1.0-o;
    float cy = fract(c*15.+time*1e-1);
    float cx = floor(c*15.+time*1e-1);
    float waves = sin((atan(u.y, u.x)+cx+time*5e-2)*4.)*0.5+0.5;
    c = sin(cy*pi);
    c = pow(c, 17.) + (c * 0.75);
    c *= rand(vec2(cx));
    c *= waves;
    c *= pow(o, 0.5);
    c *= smoothstep(0., 0.5, 1.0-length(u));
    return c;
}
vec3 makeRings(vec2 uv) {
    float n = rand(uv) * 0.025;
    float c = rings(uv + vec2(0.2,0.5));
    c += rings(uv + vec2(0.5, -0.4)) * (1.-c);
    c += rings(uv - vec2(1.2, 0.4))*0.5 * (1.-c);
    c += rings(uv - vec2(0.5, 1.0))*0.5 * (1.-c);
    c += rings(uv - vec2(0.5, -0.5))*0.5 * (1.-c);
    float g = pow(c, 7.)*0.2;
    return vec3(c*0.5,0., c)+g-n;
}
${blendingMath+sdEllipse}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    uv = uv - 0.5;
    uv.x *= 1280./720.;
    
    float rando = rand(uv+time*1e-2) * 0.025;
    // uv = vec2( uv.x, max(0.,abs(uv.y)-0.1)*sign(uv.y));
    // uv.y+=0.5;
    vec3 rr = makeRings(uv) * 0.3 * (1.0-gl_FragColor.rgb);
    uv = vec2(uv.x+rr.x*0.2, uv.y+rr.y*0.2);
    float x = length(uv*20.25);
        x = sdEllipse(uv * 20., vec2(3., 1.5));
float x2 = mod(x + time*1e-1*sign(x), 30.);
    float a = 4.;
    float b = mod(x * a - a*0.5, a) - (a*0.5);
        float c = min(abs(b),sign(b))*sign(b);
    c = smoothstep(0., 1., c);
    c = smoothstep(0., 1., c);
    // c = smoothstep(0., 1., c);
    x = c+floor(x);
    x *= 0.05;
    x = max(0., abs(x-0.5)+0.5);
    // x = smoothstep(0., 1., x);
    vec3 c1 = vec3(1., 0., 0.);
    vec3 c2 = mix(
        vec3(0., 1., 1.).gbr,
        vec3(0., 1., 1.),
        // abs(map(atan(uv.y, uv.x), -pi, pi, -2., 2.))
        smoothstep(0., 2., map(sin(atan(uv.y, uv.x)+(pi*-1.)+time*1e-1*0.), -1., 1., 0., 1.*(10.*x)))*1.65
    );
    vec3 c3 = mix(c2, c1, x);
    c3 = c3*(1.-x);
        c3 = mix(c3, ContrastSaturationBrightness(c3, 2.4, 1., 1.5), 1.0-x);
    gl_FragColor = vec4(c3-rando, 1.);
        // uv.y+=0.5;
    gl_FragColor.rgb += rr;
}
// endGLSL
`);



}




