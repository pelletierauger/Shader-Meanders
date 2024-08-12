if (false) {

// Smooth triangle
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
float smoothTriangle(vec2 p, vec2 p0, vec2 p1, vec2 p2, float smoothness) {
    vec3 e0, e1, e2;
    e0.xy = normalize(p1 - p0).yx * vec2(+1.0, -1.0);
    e1.xy = normalize(p2 - p1).yx * vec2(+1.0, -1.0);
    e2.xy = normalize(p0 - p2).yx * vec2(+1.0, -1.0);
    e0.z = dot(e0.xy, p0) - smoothness;
    e1.z = dot(e1.xy, p1) - smoothness;
    e2.z = dot(e2.xy, p2) - smoothness;
    float a = max(0.0, dot(e0.xy, p) - e0.z);
    float b = max(0.0, dot(e1.xy, p) - e1.z);
    float c = max(0.0, dot(e2.xy, p) - e2.z);
    return smoothstep(smoothness * 2.0, 1e-7, length(vec3(a, b, c)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    vec2 v0 = vec2(0.0, -0.25);
    vec2 v1 = vec2(0.25, 0.25);
    vec2 v2 = vec2(-0.25, 0.25);
    float a = smoothTriangle(uv, v0, v1, v2, 0.025);
    // a = (abs(a - 0.5) * -1. + 0.5) * 2.;
    vec3 col = vec3(1.0, 0.0, 0.0);
    col *= a;
    gl_FragColor = vec4(col, 1.0);
}
// endGLSL
`);

// Smooth triangle
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
float smoothTriangle(vec2 p, vec2 p0, vec2 p1, vec2 p2, float smoothness) {
    vec3 e0, e1, e2;
    e0.xy = normalize(p1 - p0).yx * vec2(+1.0, -1.0);
    e1.xy = normalize(p2 - p1).yx * vec2(+1.0, -1.0);
    e2.xy = normalize(p0 - p2).yx * vec2(+1.0, -1.0);
    e0.z = dot(e0.xy, p0) - smoothness;
    e1.z = dot(e1.xy, p1) - smoothness;
    e2.z = dot(e2.xy, p2) - smoothness;
    float a = max(0.0, dot(e0.xy, p) - e0.z);
    float b = max(0.0, dot(e1.xy, p) - e1.z);
    float c = max(0.0, dot(e2.xy, p) - e2.z);
    return smoothstep(smoothness * 2.0, 1e-7, length(vec3(a, b, c)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    vec2 v0 = vec2(0.0, -0.25);
    vec2 v1 = vec2(0.25, 0.45);
    vec2 v2 = vec2(-0.25, 0.25);
    float a = smoothTriangle(uv, v0, v1, v2, 0.05);
    // a = (abs(a - 0.5) * -1. + 0.5) * 2.;
    a = smoothstep(0., 1., a);
    a *= sin(uv.y+time*1e-1);
    vec3 col = vec3(1.0, 0.0, 0.0);
    col *= a;
    gl_FragColor = vec4(col, 1.0);
}
// endGLSL
`);

}