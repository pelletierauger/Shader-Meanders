if (false) {

// Graze
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    float c = length(uv);
    float c0 = length(uv+vec2(1.48,0.));
    float c1 = length(uv-vec2(1.48,0.));
    c0 = smoothstep(1.52, 1.5, c0);
    c1 = smoothstep(1.52, 1.5, c1);
    c = c1 * c0;
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c), 1.0);
}
// endGLSL
`);

// Basic Flame
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    uv.x *= map(uv.y, 0., -0.5, 1., 0.001);
    uv.x += sin(time * -5e-1 + uv.y * 2e1) * map(uv.y, 1., -0.3, 1., 0.) * 5e-2;
    float c = length(uv);
    float c0 = length(uv+vec2(1.48,0.));
    float c1 = length(uv-vec2(1.48,0.));
    c0 = smoothstep(1.52, 1.5, c0);
    c1 = smoothstep(1.52, 1.5, c1);
    c = c1 * c0;
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c, c*c, c*c*c), 1.0);
}
// endGLSL
`);

// Flame with some lighting
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv *= 1.95;
    uv.x *= ratio;
    vec2 ov = uv;
    uv.x *= map(uv.y, 0., -0.5, 1., 0.001);
    uv.x += sin(time * -5e-1 + uv.y * 2e1) * map(uv.y, 1., -0.3, 1., 0.) * 5e-2;
    
    // ov.x *= map(ov.y, 0., -0.5, 1., 0.35);
    ov.x += sin(time * -5e-1 + uv.y * 2e1) * map(uv.y, 1., -0.3, 1., 0.) * 2e-2;
    float c = length(uv);
    float c0 = length(uv+vec2(1.48,0.));
    float c1 = length(uv-vec2(1.48,0.));
    float o0 = c0, o1 = c1;
    c0 = smoothstep(1.52, 1.49, c0);
    c1 = smoothstep(1.52, 1.49, c1);
    c = c1 * c0;
    // c = min(c1, c0);
    c0 = smoothstep(1.55, 1.5, o0);
    c1 = smoothstep(1.55, 1.5, o1);
    c += c1 * c0 * 0.5;
    c0 = length(ov+vec2(1.48,-0.));
    c1 = length(ov-vec2(1.48,0.));
    c0 = smoothstep(1.8, 1.25, c0);
    c1 = smoothstep(1.8, 1.25, c1);
    c += c1 * c0 * 0.75;
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c*1.4, pow(c,2.)*1.4, pow(c,3.)), 1.0);
}
// endGLSL
`);

// Flames with some lighting
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    uv *= 5.5;
    // uv.x = (fract((uv.x-1.)*0.5)-0.5)*2.;
    float fluc = floor(uv.x+0.5) * 10.;
    uv.x = fract(uv.x+0.5)-0.5;
    vec2 ov = uv;
    uv.x *= map(uv.y, 0., -0.5, 1., 0.001);
    uv.x += sin(time * -5e-1 + uv.y * 2e1 + fluc) * map(uv.y, 1., -0.3, 1., 0.) * 5e-2;
    
    // ov.x *= map(ov.y, 0., -0.5, 1., 0.35);
    ov.x += sin(time * -5e-1 + uv.y * 2e1) * map(uv.y, 1., -0.3, 1., 0.) * 1e-2;
    float c = length(uv);
    float c0 = length(uv+vec2(1.48,0.));
    float c1 = length(uv-vec2(1.48,0.));
    float o0 = c0, o1 = c1;
    c0 = smoothstep(1.52, 1.49, c0);
    c1 = smoothstep(1.52, 1.49, c1);
    c = c1 * c0;
    // c = smoothstep(0., 1., c);
    // c = min(c1, c0);
    // c0 = smoothstep(1.58, 1.5, o0);
    // c1 = smoothstep(1.58, 1.5, o1);
    // c = max(c, c1 * c0 * 0.5);
    // c = smoothstep(0., 1., c);
    // c += c1 * c0 * 0.5;
    c0 = length(ov+vec2(1.48,0.));
    c1 = length(ov-vec2(1.48, 0.));
    c0 = smoothstep(1.8, 1.25, c0);
    c1 = smoothstep(1.8, 1.25, c1);
    c = max(c, c1 * c0 * 1.2);
    
    // c = smoothstep(0., 1., c);
    // c += c1 * c0 * 0.75;
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c*1.7, pow(c,2.)*1.7, pow(c,3.)), 1.0);
}
// endGLSL
`);

// Graze, vertically asymmetrical
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    float m = 0.125;
    // uv += vec2(sin(uv.y*10.-time*1e-1), cos(uv.x*10.-time*1e-1))*0.05;
    // uv.x += abs(fract((uv.y-time*1e-2) * 5.)-0.5) * 0.1;
    uv.x = mod((uv.x*1.)+(m*0.5), m)-(m*0.5);
    float c = length(uv);
    float c0 = length(uv+vec2(1.48,0.));
    float c1 = length(uv*0.7+vec2(1.5,0.));
    c0 = smoothstep(1.53, 1.5, c0);
    c1 = smoothstep(1.53, 1.5, c1);
    c = c0 - c1;
    c = smoothstep(0., 1., c);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c, pow(c,3.), pow(c,3.)*0.5)*1.75, 1.0-noise);
}
// endGLSL
`);

// Graze, vertically asymmetrical
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    float m = 0.125;
    // uv += vec2(sin(uv.y*10.-time*1e-1), cos(uv.x*10.-time*1e-1))*0.05;
    // uv.x += abs(fract((uv.y-time*1e-2) * 5.)-0.5) * 0.1;
    // uv.x = mod((uv.x*1.)+(m*0.5), m)-(m*0.5);
    float c = length(uv);
    float c0 = length(uv+vec2(1.48,0.));
    float c1 = length(uv*0.7+vec2(1.5,0.));
    c0 = smoothstep(1.53, 1.5, c0);
    c1 = smoothstep(1.53, 1.5, c1);
    c = c0 - c1;
    c = smoothstep(0., 1., c);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c, pow(c,3.), pow(c,3.)*0.5)*1.75, 1.0-noise);
}
// endGLSL
`);

// Graze, symmetrical
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    // uv *= .;
    float m = 0.125;
    // uv += vec2(sin(uv.y*10.-time*1e-1), cos(uv.x*10.-time*1e-1))*0.05;
    // uv.x += abs(fract((uv.y-time*1e-2) * 5.)-0.5) * 0.1;
    // uv.x = mod((uv.x*1.)+(m*0.5), m)-(m*0.5);
    float c = length(uv);
    uv *= 1.5;
    float size = 12.;
    float smoothness = 2e-2;
    float c0 = length(uv+vec2(size,0.));
    float c1 = length(uv-vec2(size,0.));
    float c0A = smoothstep(size + smoothness, size, c0);
    float c1A = smoothstep(size + smoothness, size, c1);
    size *= 0.7;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    float c0B = smoothstep(size + smoothness * 2., size, c0);
    float c1B = smoothstep(size + smoothness * 2., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = max((c0A * c1A), (c0B * c1B * 0.5));
    c = smoothstep(0., 1., c);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c), 1.0);
}
// endGLSL
`);

// Graze, symmetrical, red glow, beautiful but doesn't define alpha channel correctly
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    // uv *= .;
    float m = 0.125;
    // uv += vec2(sin(uv.y*10.-time*1e-1), cos(uv.x*10.-time*1e-1))*0.05;
    // uv.x += abs(fract((uv.y-time*1e-2) * 5.)-0.5) * 0.1;
    // uv.x = mod((uv.x*1.)+(m*0.5), m)-(m*0.5);
    float c = length(uv);
    uv *= 1.5;
    float size = 12.;
    float smoothness = 2e-2;
    float c0 = length(uv+vec2(size,0.));
    float c1 = length(uv-vec2(size,0.));
    float c0A = smoothstep(size + smoothness, size, c0);
    float c1A = smoothstep(size + smoothness, size, c1);
    size *= 0.7;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    float c0B = smoothstep(size + smoothness * 2., size, c0);
    float c1B = smoothstep(size + smoothness * 2., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = max((c0A * c1A), (c0B * c1B * 0.95));
    size *= 0.25;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    c0B = smoothstep(size + smoothness * 10., size, c0);
    c1B = smoothstep(size + smoothness * 10., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = smoothstep(0., 1., c);
    float halo = max((c0A * c1A), (c0B * c1B * 0.35));
    // c = max(c, halo);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c), 1.0);
    gl_FragColor = vec4(vec3(c+halo, pow(c,5.), pow(c,5.)*0.5)*0.7, 1.0-noise);
}
// endGLSL
`);

// Graze, symmetrical, red glow, attempt at defining alpha channel
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    // uv *= .;
    float m = 0.125;
    // uv += vec2(sin(uv.y*10.-time*1e-1), cos(uv.x*10.-time*1e-1))*0.05;
    // uv.x += abs(fract((uv.y-time*1e-2) * 5.)-0.5) * 0.1;
    // uv.x = mod((uv.x*1.)+(m*0.5), m)-(m*0.5);
    float c = length(uv);
    uv *= 1.5;
    float size = 12.;
    float smoothness = 2e-2;
    float c0 = length(uv+vec2(size,0.));
    float c1 = length(uv-vec2(size,0.));
    float c0A = smoothstep(size + smoothness, size, c0);
    float c1A = smoothstep(size + smoothness, size, c1);
    size *= 0.7;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    float c0B = smoothstep(size + smoothness * 2., size, c0);
    float c1B = smoothstep(size + smoothness * 2., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = max((c0A * c1A), (c0B * c1B * 0.95));
    size *= 0.25;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    c0B = smoothstep(size + smoothness * 10., size, c0);
    c1B = smoothstep(size + smoothness * 10., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = smoothstep(0., 1., c);
    float halo = max((c0A * c1A), (c0B * c1B * 0.35));
    // c = max(c, halo);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c), 1.0);
    gl_FragColor = vec4(vec3(1.0, pow(c,5.)*0.75, pow(c,5.)*0.5*0.75), (c+halo)-noise);
}
// endGLSL
`);

// Graze, symmetrical, red glow, attempt 2 at defining alpha channel
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    // uv *= .;
    float m = 0.125;
    // uv += vec2(sin(uv.y*10.-time*1e-1), cos(uv.x*10.-time*1e-1))*0.05;
    // uv.x += abs(fract((uv.y-time*1e-2) * 5.)-0.5) * 0.1;
    // uv.x = mod((uv.x*1.)+(m*0.5), m)-(m*0.5);
    float c = length(uv);
    uv *= 1.5;
    float size = 12.;
    float smoothness = 2e-2;
    float c0 = length(uv+vec2(size,0.));
    float c1 = length(uv-vec2(size,0.));
    float c0A = smoothstep(size + smoothness, size, c0);
    float c1A = smoothstep(size + smoothness, size, c1);
    size *= 0.7;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    float c0B = smoothstep(size + smoothness * 2., size, c0);
    float c1B = smoothstep(size + smoothness * 2., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = max((c0A * c1A), (c0B * c1B * 0.95));
    size *= 0.25;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    c0B = smoothstep(size + smoothness * 10., size, c0);
    c1B = smoothstep(size + smoothness * 10., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = smoothstep(0., 1., c);
    float halo = max((c0A * c1A), (c0B * c1B * 0.35));
    // c = max(c, halo);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c), 1.0);
    gl_FragColor = vec4(vec3(1.0, pow(c,5.)*0.75, pow(c,5.)*0.5*0.75), (c+halo)*0.7-noise);
}
// endGLSL
`);

// Graze, symmetrical, red glow, attempt 2 at defining alpha channel.
// Possibly the right one.
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    // uv *= .;
    float m = 0.125;
    // uv += vec2(sin(uv.y*10.-time*1e-1), cos(uv.x*10.-time*1e-1))*0.05;
    // uv.x += abs(fract((uv.y-time*1e-2) * 5.)-0.5) * 0.1;
    // uv.x = mod((uv.x*1.)+(m*0.5), m)-(m*0.5);
    float c = length(uv);
    uv *= 1.15;
    float size = 8.;
    float smoothness = 2e-2;
    float c0 = length(uv+vec2(size,0.));
    float c1 = length(uv-vec2(size,0.));
    float c0A = smoothstep(size + smoothness, size, c0);
    float c1A = smoothstep(size + smoothness, size, c1);
    size *= 0.7;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    float c0B = smoothstep(size + smoothness * 2., size, c0);
    float c1B = smoothstep(size + smoothness * 2., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = max((c0A * c1A), (c0B * c1B * 0.95));
    size *= 0.25;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    c0B = smoothstep(size + smoothness * 10., size, c0);
    c1B = smoothstep(size + smoothness * 10., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = smoothstep(0., 1., c);
    float halo = max((c0A * c1A), (c0B * c1B * 0.35));
    // c = max(c, halo);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c), 1.0);
    gl_FragColor = vec4(vec3(1.0, pow(c,5.)*0.75, pow(c,5.)*0.5*0.75), (c+halo)*0.7-noise);
}
// endGLSL
`);

// Flame, long and thin
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    // uv *= .;
    float m = 0.125;
    uv.x *= map(uv.y, 0., -0.55, 1., 0.2);
    // uv += vec2(sin(uv.y*10.-time*1e-1), cos(uv.x*10.-time*1e-1))*0.025;
    uv.x += sin(time * -3e-1 + uv.y * 2e1) * map(uv.y, 1., -0.3, 1., 0.) * 2e-2;
    // uv.x += abs(fract((uv.y-time*1e-2) * 5.)-0.5) * 0.1;
    // uv.x = mod((uv.x*1.)+(m*0.5), m)-(m*0.5);
    float c = length(uv);
    uv *= 1.15;
    float size = 8.;
    float smoothness = 2e-2;
    float c0 = length(uv+vec2(size,0.));
    float c1 = length(uv-vec2(size,0.));
    float c0A = smoothstep(size + smoothness, size, c0);
    float c1A = smoothstep(size + smoothness, size, c1);
    size *= 0.7;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    float c0B = smoothstep(size + smoothness * 2., size, c0);
    float c1B = smoothstep(size + smoothness * 2., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = max((c0A * c1A), (c0B * c1B * 0.95));
    size *= 0.25;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    c0B = smoothstep(size + smoothness * 10., size, c0);
    c1B = smoothstep(size + smoothness * 10., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = smoothstep(0., 1., c);
    float halo = max((c0A * c1A), (c0B * c1B * 0.35));
    // c = max(c, halo);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c), 1.0);
    gl_FragColor = vec4(vec3(1.0, pow(c,5.)*0.75, pow(c,5.)*0.5*0.75), (c+halo)*0.7-noise);
}
// endGLSL
`);

// Flame, thick
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    // uv *= .;
    float m = 0.25;
        uv.y = uv.y * (2. + sin(time*1e-1)) + sin(time*1e-1) * 0.0625;
    // uv.x = mod((uv.x*1.)+(m*0.5), m)-(m*0.5);
    uv.x *= map(uv.y, 0., -0.55, 1., 0.3);
    // uv += vec2(sin(uv.y*10.-time*1e-1), cos(uv.x*10.-time*1e-1))*0.025;
    uv.x += sin(time * -3e-1 + uv.y * 2e1) * map(uv.y, 1., -0.3, 1., 0.) * 2e-2;
    // uv.x += abs(fract((uv.y-time*1e-2) * 5.)-0.5) * 0.1;
    float c = length(uv);
    uv *= 2.5;
    uv.x *= 0.2;
    float size = 8.;
    float smoothness = 2e-2;
    float c0 = length(uv+vec2(size,0.));
    float c1 = length(uv-vec2(size,0.));
    float c0A = smoothstep(size + smoothness, size, c0);
    float c1A = smoothstep(size + smoothness, size, c1);
    size *= 0.7;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    float c0B = smoothstep(size + smoothness * 2., size, c0);
    float c1B = smoothstep(size + smoothness * 2., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    
    c = max((c0A * c1A), (c0B * c1B * 0.95));
    
    // size *= 0.5;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    c0B = smoothstep(size + smoothness * 6., size, c0);
    c1B = smoothstep(size + smoothness * 6., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = smoothstep(0., 1., c);
    c = mix(c, smoothstep(0., 1., c), 0.5);
    float halo = max((c0A * c1A), (c0B * c1B * 0.35));
    // c = max(c, halo);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.05;
    gl_FragColor = vec4(vec3(c), 1.0);
    gl_FragColor = vec4(vec3(1.0, pow(c,5.)*0.75, pow(c,5.)*0.5*0.75), (c+halo)*0.8-noise);
}
// endGLSL
`);

// Graze, symmetrical, blue horizontal waves
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.yx / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    // uv.x *= ratio;
    uv += vec2(0., -0.3);
    uv *= 0.8;
    float m = 0.1;
    // uv.x += abs(fract((uv.y-time*1e-2) * 5.)-0.5) * 0.1;
    uv += vec2(sin(uv.y*10.-time*1e-1), cos(uv.x*10.-time*1e-1))*0.025;
    uv.x = min(abs(uv.x+0.15), 0.15);
    uv.x = mod((uv.x*1.)+(m*0.5), m)-(m*0.5);
    float c = length(uv);
    uv *= 1.1;
    float size = 12.;
    float smoothness = 2e-2;
    float c0 = length(uv+vec2(size,0.));
    float c1 = length(uv-vec2(size,0.));
    float c0A = smoothstep(size + smoothness, size, c0);
    float c1A = smoothstep(size + smoothness, size, c1);
    size *= 0.7;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    float c0B = smoothstep(size + smoothness * 2., size, c0);
    float c1B = smoothstep(size + smoothness * 2., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = max((c0A * c1A), (c0B * c1B * 0.95));
    size *= 0.25;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    c0B = smoothstep(size + smoothness * 5., size, c0);
    c1B = smoothstep(size + smoothness * 5., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = smoothstep(0., 1., c);
    float halo = max((c0A * c1A), (c0B * c1B * 0.35));
    
    // halo = smoothstep(0., 1., halo);
    // halo = smoothstep(0., 1., halo);
    // c = max(c, halo);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c), 1.0);
    gl_FragColor = vec4(vec3(1.0, pow(c,5.)*0.75, pow(c,5.)*0.5*0.75).bgr, (c+halo)*0.7-noise);
}
// endGLSL
`);

// Vesica becomes a zig-zag
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    vec2 ov = uv;
    float ratio = resolution.x / resolution.y;
    float noise = rand(uv + sin(time)) * 0.075;
    // uv.x *= ratio;
    // uv += vec2(0.175, -0.3);
    uv *= 0.6;
    float m = 0.1;
    uv.x = pow(uv.x * 2., 2.);
    uv.x += abs(fract((uv.y) * 10.)-0.5) * 0.1;
    // uv += vec2(sin(uv.y*10.-time*1e-1), cos(uv.x*10.-time*1e-1))*0.025;
    // uv.x = min(abs(uv.x+0.15), 0.15);
    uv.x -= time * 0.25e-2;
        // uv.x += 0.4;
    uv.x = mod((uv.x*1.)+(m*0.5), m)-(m*0.5);
    // uv.x = smoothstep(0., 1., uv.x);
    float c = length(uv);
    // uv *= 0.5;
    float size = 12.;
    float smoothness = 2e-2;
    float c0 = length(uv+vec2(size,0.));
    float c1 = length(uv-vec2(size,0.));
    float c0A = smoothstep(size + smoothness, size, c0);
    float c1A = smoothstep(size + smoothness, size, c1);
    size *= 0.7;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    float c0B = smoothstep(size + smoothness * 2., size, c0);
    float c1B = smoothstep(size + smoothness * 2., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = max((c0A * c1A), (c0B * c1B * 0.95));
    size *= 0.25;
    c0 = length(uv+vec2(size,0.));
    c1 = length(uv-vec2(size,0.));
    c0B = smoothstep(size + smoothness * 5., size, c0);
    c1B = smoothstep(size + smoothness * 5., size, c1);
    // c = c0 - c1;
    // c = c0+c1;
    c = smoothstep(0., 1., c);
    float halo = max((c0A * c1A), (c0B * c1B * 0.35));
    
    // halo = smoothstep(0., 1., halo);
    // halo = smoothstep(0., 1., halo);
    // c = max(c, halo);
    // c = c1 * 0.5 + c0 * 0.5;
    // c -= (2.0 - smoothstep(0.0, 0.3, 1.0-abs(ov.x*2.)) * 2.) * 0.75;
    // gl_FragColor = vec4(vec3(c), 1.0);
    gl_FragColor = vec4(vec3(1.0, pow(c,5.)*0.75, pow(c,5.)*0.5*0.75), (c+halo)*0.7-noise);
}
// endGLSL
`);

// Misty river
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    float noise = rand(uv + sin(time)) * 0.075;
    uv.x = 0.0;
    float c = length(uv);
    gl_FragColor = vec4(vec3(c, pow(c,3.), pow(c,3.)*0.5).gbr*1.75, 1.0-noise);
}
// endGLSL
`);

// Graze, simple, via circle intersection
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    float c = length(uv);
    float c0 = length(uv+vec2(1.5,0.));
    float c1 = length(uv-vec2(1.5,0.));
    c0 = smoothstep(1.52, 1.5, c0);
    c1 = smoothstep(1.52, 1.5, c1);
    c = c1 * c0;
    // c = smoothstep(0., 1., c);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c), 1.0-noise);
}
// endGLSL
`);

// Flame research
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    uv.x *= (1.0-sin(uv.y*-2.5))*0.25;
    float c = length(uv);
    float c0 = length(uv+vec2(1.5,0.));
    float c1 = length(uv-vec2(1.5,0.));
    c0 = smoothstep(1.52, 1.5, c0);
    c1 = smoothstep(1.52, 1.5, c1);
    c = c1 * c0;
    c = smoothstep(0., 1., c);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.05;
    gl_FragColor = vec4(vec3(c), 1.0-noise);
}
// endGLSL
`);

// Flame research
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    uv.x *= (1.0-sin(uv.y*-2.5))*0.25;
    uv.x += sin(uv.y*20.-time*4e-1)*0.0025*(uv.y+0.25);
    uv.x += sin(uv.y*12.-time*8e-1)*0.005*(uv.y+0.25);
    float c = length(uv);
    float c0 = length(uv+vec2(1.5,0.));
    float c1 = length(uv-vec2(1.5,0.));
    c0 = smoothstep(1.52, 1.5, c0);
    c1 = smoothstep(1.52, 1.5, c1);
    c = c1 * c0;
    c = smoothstep(0., 1., c);
    // c = c1 * 0.5 + c0 * 0.5;
    float noise = rand(uv + sin(time)) * 0.05;
    gl_FragColor = vec4(vec3(c), 1.0-noise);
    gl_FragColor = vec4(vec3(c, pow(c, 3.), pow(c, 5.)), 1.-noise);
}
// endGLSL
`);

// Graze, simple, via simple crossing of x and y
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    uv.x = smoothstep(0., 1., abs(uv.x*45.));
    float c = 1.0-abs(uv.x);
    uv.y = smoothstep(0., 1., abs(uv.y*3.5));
    c *= max(0.0, 1.0-uv.y);
    c = smoothstep(0., 1., c);
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c), 1.0-noise);
}
// endGLSL
`);

// Graze, simple, via simple crossing of x and y.
// Flashing animation of the graze opening up.
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    uv *= 0.5;
    uv.x += sin(uv.x*3.*sin(time*1e-1));
    uv.x = smoothstep(0., 1., abs(uv.x*45.));
    float c = 1.0-abs(uv.x);
    uv.y = smoothstep(0., 1., abs(uv.y*3.5));
    c *= max(0.0, 1.0-uv.y);
    c = smoothstep(0., 1., c);
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(c, pow(c, 3.), pow(c, 5.)), 1.0);
}
// endGLSL
`);

}





