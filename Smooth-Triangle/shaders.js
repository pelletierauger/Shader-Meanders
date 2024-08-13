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
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(col, 1.0 - noise);
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
    vec2 v1 = vec2(0.25, 0.25);
    vec2 v2 = vec2(-0.25, 0.25);
    float a = smoothTriangle(uv, v0, v1, v2, 0.04);
    // a = (a*smoothTriangle(uv*vec2(1.,-1.), v0, v1, v2, 0.04));
    a = (abs(a - 0.5) * -1. + 0.5) * 1.;
    float a2 = a;
    a = pow(a, 0.2);
    a = smoothstep(0., 1., a);
    a = smoothstep(0., 1., a);
    // a *= sin(uv.y*4.+time*1e-1);
    a = mix(a,pow(a,9.),sin(uv.y*4.+time*1e-1)*0.5+0.5);
    // a = a * 0.2 + pow(a2,3.) * 7.;
    vec3 col = vec3(1.0, 0.0, 0.0);
    col *= a;
    col = mix(col, vec3(1.), pow(max(0., a),7.)*0.1);
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(col, 1.0 - noise);
}
// endGLSL
`);

// Shiny ruby
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p  - p0, v1 = p  - p1, v2 = p  - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                     vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                     vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    uv *= 0.5;
    uv.x *= ratio;
    vec2 v1 = vec2(-0.1, 0.1);
    vec2 v2 = vec2(0.1, 0.1);
    vec2 v3 = vec2(0.0, -0.1);
    float tri = 1.0 - sdTriangle(uv, v1, v2, v3);
    // tri = smoothstep(0.95, 1., tri) + smoothstep(0.5, 1., tri) * 0.5;
    tri = smoothstep(0.94, 1., tri) * 1.0 - (smoothstep(0.998, 1., tri)) + (1.0-smoothstep(1., 1.05, tri)*2.1)*smoothstep(0.998, 1., tri)*0.5;
        tri *= map(sin((uv.x-uv.y)*40.-time*1e-1),-1.,1.,0.5,1.);
    // tri = abs(tri - 0.5) * -1. + 0.5;
    // tri = smoothstep(0., 1., tri);
    // uv -= 0.5;
    // uv.x *= ratio;
    float noise = rand(uv + sin(time)) * 0.075;
    vec3 col = vec3(1.0, 0.0, 0.);
    col = mix(col, vec3(1.0), pow(max(0.,tri),19.)*0.5);
    gl_FragColor = vec4(col *tri, 1. - noise);
}
// endGLSL
`);

// Shiny ruby
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
${blendingMath}
float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p  - p0, v1 = p  - p1, v2 = p  - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                     vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                     vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    uv *= 0.5;
    uv.x *= ratio;
    vec2 v1 = vec2(-0.1, 0.1);
    vec2 v2 = vec2(0.1, 0.1);
    vec2 v3 = vec2(0.0, -0.1);
    float tri = 1.0 - sdTriangle(uv, v1, v2, v3);
    // tri = smoothstep(0.95, 1., tri) + smoothstep(0.5, 1., tri) * 0.5;
    tri = smoothstep(0.94, 1., tri) * 1.0 - (smoothstep(0.998, 1., tri)) + (1.0-smoothstep(1., 1.05, tri)*2.1)*smoothstep(0.998, 1., tri)*0.5;
        tri *= map(sin((uv.x-uv.y)*10.-time*1e-1),-1.,1.,0.25,1.);
    // tri = abs(tri - 0.5) * -1. + 0.5;
    tri = smoothstep(0., 1., tri);
    // uv -= 0.5;
    // uv.x *= ratio;
    float noise = rand(uv + sin(time)) * 0.075;
    vec3 col = vec3(1.0, 0.0, 0.);
    col = mix(col, vec3(1.0), pow(max(0.,tri),19.)*0.5);
    gl_FragColor = vec4(col *tri, 1. - noise);
}
// endGLSL
`);

// Shiny ruby
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
${blendingMath}
float sdHexagon( in vec2 p, in float r ) {
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}
float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p  - p0, v1 = p  - p1, v2 = p  - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                     vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                     vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    uv *= 0.5;
    uv.x *= ratio;
    vec2 v1 = vec2(-0.1, 0.1);
    vec2 v2 = vec2(0.1, 0.1);
    vec2 v3 = vec2(0.0, -0.1);
    float tri = 1.0 - sdTriangle(uv, v1, v2, v3);
    tri = 1.0 - sdHexagon(uv, 0.1);
    // tri = smoothstep(0.95, 1., tri) + smoothstep(0.5, 1., tri) * 0.5;
    tri = smoothstep(0.94, 1., tri) * 1.0 - (smoothstep(0.998, 1., tri)) + (1.0-smoothstep(1., 1.05, tri)*2.1)*smoothstep(0.998, 1., tri)*0.5;
        tri *= map(sin((uv.x-uv.y)*10.-time*1e-1),-1.,1.,0.25,1.);
    // tri = abs(tri - 0.5) * -1. + 0.5;
    tri = smoothstep(0., 1., tri);
    // uv -= 0.5;
    // uv.x *= ratio;
    float noise = rand(uv + sin(time)) * 0.075;
    vec3 col = vec3(1.0, 0.0, 0.);
    col = mix(col, vec3(1.0), pow(max(0.,tri),19.)*0.5);
    gl_FragColor = vec4(col *tri, 1. - noise);
}
// endGLSL
`);

// Shiny ruby
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
${blendingMath}
float sdHexagon( in vec2 p, in float r ) {
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}
float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p  - p0, v1 = p  - p1, v2 = p  - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                     vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                     vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}
float sdCircleWave( in vec2 p, in float tb, in float ra )
{
    tb = 3.1415927*5.0/6.0*max(tb,0.0001);
    vec2 co = ra*vec2(sin(tb),cos(tb));
    p.x = abs(mod(p.x,co.x*4.0)-co.x*2.0);
    vec2  p1 = p;
    vec2  p2 = vec2(abs(p.x-2.0*co.x),-p.y+2.0*co.y);
    float d1 = ((co.y*p1.x>co.x*p1.y) ? length(p1-co) : abs(length(p1)-ra));
    float d2 = ((co.y*p2.x>co.x*p2.y) ? length(p2-co) : abs(length(p2)-ra));
    return min(d1, d2); 
}
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    uv *= 0.5;
    uv.x *= ratio;
    vec2 v1 = vec2(-0.1, 0.1);
    vec2 v2 = vec2(0.1, 0.1);
    vec2 v3 = vec2(0.0, -0.1);
    float tri = 1.0 - sdTriangle(uv, v1, v2, v3);
    tri = 1.0 - sdHexagon(uv, 0.1);
    // tri = 1.0 - sdCircleWave(uv, 0.5, 0.05);
    // tri = smoothstep(0.95, 1., tri) + smoothstep(0.5, 1., tri) * 0.5;
    tri = smoothstep(0.94, 1., tri) * 1.0 - (smoothstep(0.998, 1., tri)) + (1.0-smoothstep(1., 1.05, tri)*2.1)*smoothstep(0.998, 1., tri)*0.5;
        tri *= map(sin((uv.x-uv.y)*10.-time*1e-1),-1.,1.,0.25,1.);
    // tri = abs(tri - 0.5) * -1. + 0.5;
    tri = smoothstep(0., 1., tri);
    // uv -= 0.5;
    // uv.x *= ratio;
    float noise = rand(uv + sin(time)) * 0.075;
    vec3 col = vec3(1.0, 0.0, 0.);
    col = mix(col, vec3(1.0), pow(max(0.,tri),19.)*0.5);
    gl_FragColor = vec4(col *tri, 1. - noise);
}
// endGLSL
`);

// Shiny ruby
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
${blendingMath}
float sdHexagon( in vec2 p, in float r ) {
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}
float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p  - p0, v1 = p  - p1, v2 = p  - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                     vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                     vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}
float sdCircleWave( in vec2 p, in float tb, in float ra )
{
    tb = 3.1415927*5.0/6.0*max(tb,0.0001);
    vec2 co = ra*vec2(sin(tb),cos(tb));
    p.x = abs(mod(p.x,co.x*4.0)-co.x*2.0);
    vec2  p1 = p;
    vec2  p2 = vec2(abs(p.x-2.0*co.x),-p.y+2.0*co.y);
    float d1 = ((co.y*p1.x>co.x*p1.y) ? length(p1-co) : abs(length(p1)-ra));
    float d2 = ((co.y*p2.x>co.x*p2.y) ? length(p2-co) : abs(length(p2)-ra));
    return min(d1, d2); 
}
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
vec3 hash3( vec2 p ){
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
           dot(p,vec2(269.5,183.3)), 
           dot(p,vec2(419.2,371.9)) );
  return fract(sin(q)*43758.5453);
}
float voronoise( in vec2 p, float u, float v ) {
  float k = 1.0+63.0*pow(1.0-v,6.0);
    vec2 i = floor(p);
    vec2 f = fract(p);
    
  vec2 a = vec2(0.0,0.0);
    for( int y=-2; y<=2; y++ )
    for( int x=-2; x<=2; x++ )
    {
        vec2  g = vec2( x, y );
    vec3  o = hash3( i + g )*vec3(u,u,1.0);
    vec2  d = g - f + o.xy;
    float w = pow( 1.0-smoothstep(0.0,1.414,length(d)), k );
    a += vec2(o.z*w,w);
    }
  
    return a.x/a.y;
}
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    uv *= 0.5;
    uv.x *= ratio;
    uv = rotateUV(uv, pi*0.5, 0.0);
    vec2 v1 = vec2(-0.1, 0.1);
    vec2 v2 = vec2(0.1, 0.1);
    vec2 v3 = vec2(0.0, -0.1);
    float tri = 1.0 - sdTriangle(uv, v1, v2, v3);
    tri = 1.0 - sdHexagon(uv, 0.1);
    // tri = 1.0 - sdCircleWave(uv, 0.5, 0.05);
    // tri = smoothstep(0.95, 1., tri) + smoothstep(0.5, 1., tri) * 0.5;
    float interior = (smoothstep(0.992, 1., tri));
    tri = smoothstep(0.94, 1., tri) * 1.0 - (smoothstep(0.998, 1., tri)) + (1.0-smoothstep(1., 1.05, tri)*2.1)*smoothstep(0.998, 1., tri)*0.5;
    // uv -= 0.5;
    // uv.x *= ratio;
    float voro = voronoise(uv*24., 0.75, 0.3);
    float voro2 = voronoise(uv*12., 0.75, 0.3);
    voro = mix(voro, voro2, 0.5);
    tri = max(tri, (interior * voro));
    tri *= map(sin((uv.x+uv.y)*10.+time*1e-1),-1.,1.,0.25,1.);
    // tri = abs(tri - 0.5) * -1. + 0.5;
    tri = smoothstep(0., 1., tri);
    float noise = rand(uv + sin(time)) * 0.075;
    vec3 col = vec3(1.0, 0.0, 0.);
    col = mix(col, vec3(1.0), pow(max(0.,tri),19.)*0.5);
    gl_FragColor = vec4(col *tri, 1. - noise);
}
// endGLSL
`);

// Shiny ruby
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
${blendingMath}
float sdHexagon( in vec2 p, in float r ) {
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}
float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p  - p0, v1 = p  - p1, v2 = p  - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                     vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                     vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}
float sdCircleWave( in vec2 p, in float tb, in float ra )
{
    tb = 3.1415927*5.0/6.0*max(tb,0.0001);
    vec2 co = ra*vec2(sin(tb),cos(tb));
    p.x = abs(mod(p.x,co.x*4.0)-co.x*2.0);
    vec2  p1 = p;
    vec2  p2 = vec2(abs(p.x-2.0*co.x),-p.y+2.0*co.y);
    float d1 = ((co.y*p1.x>co.x*p1.y) ? length(p1-co) : abs(length(p1)-ra));
    float d2 = ((co.y*p2.x>co.x*p2.y) ? length(p2-co) : abs(length(p2)-ra));
    return min(d1, d2); 
}
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
vec3 hash3( vec2 p ){
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
           dot(p,vec2(269.5,183.3)), 
           dot(p,vec2(419.2,371.9)) );
  return fract(sin(q)*43758.5453);
}
float voronoise( in vec2 p, float u, float v ) {
  float k = 1.0+63.0*pow(1.0-v,6.0);
    vec2 i = floor(p);
    vec2 f = fract(p);
    
  vec2 a = vec2(0.0,0.0);
    for( int y=-2; y<=2; y++ )
    for( int x=-2; x<=2; x++ )
    {
        vec2  g = vec2( x, y );
    vec3  o = hash3( i + g )*vec3(u,u,1.0);
    vec2  d = g - f + o.xy;
    float w = pow( 1.0-smoothstep(0.0,1.414,length(d)), k );
    a += vec2(o.z*w,w);
    }
  
    return a.x/a.y;
}
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    uv *= 0.5;
    uv.x *= ratio;
        vec2 puv = uv;
    uv = rotateUV(uv, pi*0.5, 0.0);
    uv.x = max(0., uv.x);
    vec2 v1 = vec2(-0.1, 0.1);
    vec2 v2 = vec2(0.1, 0.1);
    vec2 v3 = vec2(0.0, -0.1);
    float tri = 1.0 - sdTriangle(uv, v1, v2, v3);
    tri = 1.0 - sdHexagon(uv, 0.1);
    // tri = 1.0 - sdCircleWave(uv, 0.5, 0.05);
    // tri = smoothstep(0.95, 1., tri) + smoothstep(0.5, 1., tri) * 0.5;
    float interior = (smoothstep(0.992, 1., tri));
    tri = smoothstep(0.94, 1., tri) * 1.0 - (smoothstep(0.998, 1., tri)) + (1.0-smoothstep(1., 1.05, tri)*2.1)*smoothstep(0.998, 1., tri)*0.5;
    // uv -= 0.5;
    // uv.x *= ratio;
    float voro = voronoise(puv*24., 0.75, 0.3);
    float voro2 = voronoise(puv*12., 0.75, 0.3);
    voro = mix(voro, voro2, 0.5);
    tri = max(tri, (interior * voro));
    tri *= map(sin((puv.y)*10.+time*1e-1),-1.,1.,0.25,1.);
    // tri = abs(tri - 0.5) * -1. + 0.5;
    tri = smoothstep(0., 1., tri);
    float noise = rand(puv + sin(time)) * 0.075;
    vec3 col = vec3(1.0, 0.0, 0.);
    col = mix(col, vec3(1.0), pow(max(0.,tri),19.)*0.5);
    gl_FragColor = vec4(col *tri, 1. - noise);
}
// endGLSL
`);

// Ruby, triangular
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
${blendingMath}
float sdHexagon( in vec2 p, in float r ) {
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}
float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p  - p0, v1 = p  - p1, v2 = p  - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                     vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                     vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}
float sdCircleWave( in vec2 p, in float tb, in float ra )
{
    tb = 3.1415927*5.0/6.0*max(tb,0.0001);
    vec2 co = ra*vec2(sin(tb),cos(tb));
    p.x = abs(mod(p.x,co.x*4.0)-co.x*2.0);
    vec2  p1 = p;
    vec2  p2 = vec2(abs(p.x-2.0*co.x),-p.y+2.0*co.y);
    float d1 = ((co.y*p1.x>co.x*p1.y) ? length(p1-co) : abs(length(p1)-ra));
    float d2 = ((co.y*p2.x>co.x*p2.y) ? length(p2-co) : abs(length(p2)-ra));
    return min(d1, d2); 
}
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
vec3 hash3( vec2 p ){
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
           dot(p,vec2(269.5,183.3)), 
           dot(p,vec2(419.2,371.9)) );
  return fract(sin(q)*43758.5453);
}
float voronoise( in vec2 p, float u, float v ) {
  float k = 1.0+63.0*pow(1.0-v,6.0);
    vec2 i = floor(p);
    vec2 f = fract(p);
    
  vec2 a = vec2(0.0,0.0);
    for( int y=-2; y<=2; y++ )
    for( int x=-2; x<=2; x++ )
    {
        vec2  g = vec2( x, y );
    vec3  o = hash3( i + g )*vec3(u,u,1.0);
    vec2  d = g - f + o.xy;
    float w = pow( 1.0-smoothstep(0.0,1.414,length(d)), k );
    a += vec2(o.z*w,w);
    }
  
    return a.x/a.y;
}
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    uv *= 0.5;
    uv.x *= ratio;
    // uv = rotateUV(uv, pi*0.5, 0.0);
    vec2 v1 = vec2(-0.1, 0.1);
    vec2 v2 = vec2(0.1, 0.1);
    vec2 v3 = vec2(0.0, -0.1);
    float tri = 1.0 - sdTriangle(uv, v1, v2, v3);
    // tri = 1.0 - sdHexagon(uv, 0.1);
    // tri = 1.0 - sdCircleWave(uv, 0.5, 0.05);
    // tri = smoothstep(0.95, 1., tri) + smoothstep(0.5, 1., tri) * 0.5;
    float interior = (smoothstep(0.992, 1., tri));
    tri = smoothstep(0.94, 1., tri) * 1.0 - (smoothstep(0.998, 1., tri)) + (1.0-smoothstep(1., 1.05, tri)*2.1)*smoothstep(0.998, 1., tri)*0.5;
    // uv -= 0.5;
    // uv.x *= ratio;
    float voro = voronoise(uv*24., 0.75, 0.3);
    float voro2 = voronoise(uv*12., 0.75, 0.3);
    voro = mix(voro, voro2, 0.5);
    tri = max(tri, (interior * voro));
    tri *= map(sin((uv.x-uv.y)*10.-time*1e-1),-1.,1.,0.25,1.);
    // tri = abs(tri - 0.5) * -1. + 0.5;
    tri = smoothstep(0., 1., tri);
    float noise = rand(uv + sin(time)) * 0.075;
    vec3 col = vec3(1.0, 0.0, 0.);
    col = mix(col, vec3(1.0), pow(max(0.,tri),19.)*0.5);
    gl_FragColor = vec4(col *tri, 1. - noise);
}
// endGLSL
`);

// Sapphire, hexagonal
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
${blendingMath}
float sdHexagon( in vec2 p, in float r ) {
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}
float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p  - p0, v1 = p  - p1, v2 = p  - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                     vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                     vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}
float sdCircleWave( in vec2 p, in float tb, in float ra ) {
    tb = 3.1415927*5.0/6.0*max(tb,0.0001);
    vec2 co = ra*vec2(sin(tb),cos(tb));
    p.x = abs(mod(p.x,co.x*4.0)-co.x*2.0);
    vec2  p1 = p;
    vec2  p2 = vec2(abs(p.x-2.0*co.x),-p.y+2.0*co.y);
    float d1 = ((co.y*p1.x>co.x*p1.y) ? length(p1-co) : abs(length(p1)-ra));
    float d2 = ((co.y*p2.x>co.x*p2.y) ? length(p2-co) : abs(length(p2)-ra));
    return min(d1, d2); 
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
vec3 hash3(vec2 p){
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
           dot(p,vec2(269.5,183.3)), 
           dot(p,vec2(419.2,371.9)) );
    return fract(sin(q)*43758.5453);
}
float voronoise(vec2 p, float u, float v) {
    float k = 1.0+63.0*pow(1.0-v,6.0);
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 a = vec2(0.0,0.0);
    for( int y=-2; y<=2; y++ )
    for( int x=-2; x<=2; x++ ) {
        vec2  g = vec2( x, y );
        vec3  o = hash3( i + g )*vec3(u,u,1.0);
        vec2  d = g - f + o.xy;
        float w = pow( 1.0-smoothstep(0.0,1.414,length(d)), k );
        a += vec2(o.z*w,w);
    }
    return a.x/a.y;
}
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float sdStar( in vec2 p, in float r, in int n, in float m) {
    // next 4 lines can be precomputed for a given shape
    float an = 3.141593/float(n);
    float en = 3.141593/m;  // m is between 2 and n
    vec2  acs = vec2(cos(an),sin(an));
    vec2  ecs = vec2(cos(en),sin(en)); // ecs=vec2(0,1) for regular polygon
    float bn = mod(atan(p.x,p.y),2.0*an) - an;
    p = length(p)*vec2(cos(bn),abs(sin(bn)));
    p -= r*acs;
    p += ecs*clamp( -dot(p,ecs), 0.0, r*acs.y/ecs.y);
    return length(p)*sign(p.x);
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    uv *= 0.5;
    uv.x *= ratio;
    uv = rotateUV(uv, pi*0.5, 0.0);
    vec2 v1 = vec2(-0.1, 0.1);
    vec2 v2 = vec2(0.1, 0.1);
    vec2 v3 = vec2(0.0, -0.1);
    float tri = 1.0 - sdTriangle(uv, v1, v2, v3);
    tri = 1.0 - sdHexagon(uv, 0.1);
    // tri = 1.0 - sdStar(uv, 0.1, 6, 0.4);
    // tri = 1.0 - sdCircleWave(uv, 0.5, 0.05);
    // tri = smoothstep(0.95, 1., tri) + smoothstep(0.5, 1., tri) * 0.5;
    float interior = (smoothstep(0.992, 1., tri));
    tri = smoothstep(0.94, 1., tri) * 1.0 - (smoothstep(0.998, 1., tri)) + (1.0-smoothstep(1., 1.05, tri)*2.1)*smoothstep(0.998, 1., tri)*0.5;
    // uv -= 0.5;
    // uv.x *= ratio;
    float voro = voronoise(uv*24., 0.75, 0.3);
    // float voro2 = voronoise(uv*12., 0.75, 0.3);
    float voro3 = voronoise(uv*12.+vec2(10.), 0.75, 0.3);
    // voro = mix(voro, voro2, 0.5);
    voro = mix(voro, voro3, map(sin(-time*1e-1),-1.,1.,0.,1.));
    tri = max(tri, (interior * voro));
    tri *= map(sin((uv.x+uv.y)*10.+time*1e-1),-1.,1.,0.25,1.);
    // tri = abs(tri - 0.5) * -1. + 0.5;
    tri = smoothstep(0., 1., tri);
    float noise = rand(uv + sin(time)) * 0.075;
    vec3 col = vec3(1.0, 0.0, 0.);
    col = mix(col, vec3(1.0), pow(max(0.,tri),19.)*0.5);
    col = col * tri;
    col = hueShift(col, 3.8);
    gl_FragColor = vec4(col, 1. - noise);
}
// endGLSL
`);

// Ruby, ellipse
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
${blendingMath}
float sdHexagon( in vec2 p, in float r ) {
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}
float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p  - p0, v1 = p  - p1, v2 = p  - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                     vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                     vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}
float sdCircleWave( in vec2 p, in float tb, in float ra ) {
    tb = 3.1415927*5.0/6.0*max(tb,0.0001);
    vec2 co = ra*vec2(sin(tb),cos(tb));
    p.x = abs(mod(p.x,co.x*4.0)-co.x*2.0);
    vec2  p1 = p;
    vec2  p2 = vec2(abs(p.x-2.0*co.x),-p.y+2.0*co.y);
    float d1 = ((co.y*p1.x>co.x*p1.y) ? length(p1-co) : abs(length(p1)-ra));
    float d2 = ((co.y*p2.x>co.x*p2.y) ? length(p2-co) : abs(length(p2)-ra));
    return min(d1, d2); 
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
vec3 hash3(vec2 p){
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
           dot(p,vec2(269.5,183.3)), 
           dot(p,vec2(419.2,371.9)) );
    return fract(sin(q)*43758.5453);
}
float voronoise(vec2 p, float u, float v) {
    float k = 1.0+63.0*pow(1.0-v,6.0);
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 a = vec2(0.0,0.0);
    for( int y=-2; y<=2; y++ )
    for( int x=-2; x<=2; x++ ) {
        vec2  g = vec2( x, y );
        vec3  o = hash3( i + g )*vec3(u,u,1.0);
        vec2  d = g - f + o.xy;
        float w = pow( 1.0-smoothstep(0.0,1.414,length(d)), k );
        a += vec2(o.z*w,w);
    }
    return a.x/a.y;
}
float sdEllipse( in vec2 p, in vec2 ab ) {
    p = abs(p); if( p.x > p.y ) {p=p.yx;ab=ab.yx;}
    float l = ab.y*ab.y - ab.x*ab.x;
    float m = ab.x*p.x/l;      float m2 = m*m; 
    float n = ab.y*p.y/l;      float n2 = n*n; 
    float c = (m2+n2-1.0)/3.0; float c3 = c*c*c;
    float q = c3 + m2*n2*2.0;
    float d = c3 + m2*n2;
    float g = m + m*n2;
    float co;
    if (d < 0.0) {
        float h = acos(q/c3)/3.0;
        float s = cos(h);
        float t = sin(h)*sqrt(3.0);
        float rx = sqrt( -c*(s + t + 2.0) + m2 );
        float ry = sqrt( -c*(s - t + 2.0) + m2 );
        co = (ry+sign(l)*rx+abs(g)/(rx*ry)- m)/2.0;
    } else {
        float h = 2.0*m*n*sqrt( d );
        float s = sign(q+h)*pow(abs(q+h), 1.0/3.0);
        float u = sign(q-h)*pow(abs(q-h), 1.0/3.0);
        float rx = -s - u - c*4.0 + 2.0*m2;
        float ry = (s - u)*sqrt(3.0);
        float rm = sqrt( rx*rx + ry*ry );
        co = (ry/sqrt(rm-rx)+2.0*g/rm-m)/2.0;
    }
    vec2 r = ab * vec2(co, sqrt(1.0-co*co));
    return length(r-p) * sign(p.y-r.y);
}
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float sdStar( in vec2 p, in float r, in int n, in float m) {
    // next 4 lines can be precomputed for a given shape
    float an = 3.141593/float(n);
    float en = 3.141593/m;  // m is between 2 and n
    vec2  acs = vec2(cos(an),sin(an));
    vec2  ecs = vec2(cos(en),sin(en)); // ecs=vec2(0,1) for regular polygon
    float bn = mod(atan(p.x,p.y),2.0*an) - an;
    p = length(p)*vec2(cos(bn),abs(sin(bn)));
    p -= r*acs;
    p += ecs*clamp( -dot(p,ecs), 0.0, r*acs.y/ecs.y);
    return length(p)*sign(p.x);
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    uv *= 0.5;
    uv.x *= ratio;
    uv = rotateUV(uv, pi*0.5, 0.0);
    vec2 v1 = vec2(-0.1, 0.1);
    vec2 v2 = vec2(0.1, 0.1);
    vec2 v3 = vec2(0.0, -0.1);
    float tri = 1.0 - sdEllipse(uv * 3., vec2(0.45, 0.8));
    float elli = tri;
    // tri = 1.0 - sdStar(uv, 0.1, 6, 0.4);
    // tri = 1.0 - sdCircleWave(uv, 0.5, 0.05);
    // tri = smoothstep(0.95, 1., tri) + smoothstep(0.5, 1., tri) * 0.5;
    float interior = (smoothstep(0.95, 1., tri));
    tri = smoothstep(0.7, 1., tri) * 1.0 - (smoothstep(0.99, 1., tri)) + (1.0-smoothstep(1., 1.05, tri)*2.1)*smoothstep(0.99, 1., tri)*0.5;
    // uv -= 0.5;
    // uv.x *= ratio;
    vec2 polar = vec2((atan(uv.y,uv.x)), length(uv));
    float voro = voronoise(polar*10., 0.75, 0.45);
    // float voro2 = voronoise(uv*12., 0.75, 0.3);
    voro *= pow((polar.x/pi), 2.) * -1. + 1.;
    voro *= min(1., length(uv)*10.);
    polar = rotateUV(polar, pi*0.15, 0.0);
    float voro3 = voronoise(polar*14.+vec2(1.,1.), 0.75, 0.3);
    // voro = mix(voro, voro3, 0.5);
    voro3 *= pow((polar.x/pi), 2.) * -1. + 1.;
    // voro3 *= 1.0-smoothstep(1.2, 1.5, elli);
    voro3 *= min(1., length(uv)*10.);
    voro = voro3;
    voro = mix(voro, voro3, 0.5);
    // voro = mix(voro, voro3, map(sin(-time*1e-1),-1.,1.,0.,1.));
    tri = max(tri, (interior * voro));
    tri *= map(sin((uv.x+uv.y)*5.+time*1e-1),-1.,1.,0.25,1.);
    // tri *= map(sin(length(uv)*10.-time*1e-1),-1.,1.,0.25,1.);
    // tri = abs(tri - 0.5) * -1. + 0.5;
    tri = smoothstep(0., 1., tri);
    float noise = rand(uv + sin(time)) * 0.075;
    vec3 col = vec3(1.0, 0.0, 0.2);
    col = mix(col, vec3(1.0), pow(max(0.,tri),19.)*0.5);
    col = col * tri;
    // col = hueShift(col, 3.8);
    gl_FragColor = vec4(col, 1. - noise);
}
// endGLSL
`);

// Ruby, ellipse
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
${blendingMath}
float sdHexagon( in vec2 p, in float r ) {
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}
float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p  - p0, v1 = p  - p1, v2 = p  - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                     vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                     vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}
float sdCircleWave( in vec2 p, in float tb, in float ra ) {
    tb = 3.1415927*5.0/6.0*max(tb,0.0001);
    vec2 co = ra*vec2(sin(tb),cos(tb));
    p.x = abs(mod(p.x,co.x*4.0)-co.x*2.0);
    vec2  p1 = p;
    vec2  p2 = vec2(abs(p.x-2.0*co.x),-p.y+2.0*co.y);
    float d1 = ((co.y*p1.x>co.x*p1.y) ? length(p1-co) : abs(length(p1)-ra));
    float d2 = ((co.y*p2.x>co.x*p2.y) ? length(p2-co) : abs(length(p2)-ra));
    return min(d1, d2); 
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
vec3 hash3(vec2 p){
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
           dot(p,vec2(269.5,183.3)), 
           dot(p,vec2(419.2,371.9)) );
    return fract(sin(q)*43758.5453);
}
float voronoise(vec2 p, float u, float v) {
    float k = 1.0+63.0*pow(1.0-v,6.0);
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 a = vec2(0.0,0.0);
    for( int y=-2; y<=2; y++ )
    for( int x=-2; x<=2; x++ ) {
        vec2  g = vec2( x, y );
        vec3  o = hash3( i + g )*vec3(u,u,1.0);
        vec2  d = g - f + o.xy;
        float w = pow( 1.0-smoothstep(0.0,1.414,length(d)), k );
        a += vec2(o.z*w,w);
    }
    return a.x/a.y;
}
float sdEllipse( in vec2 p, in vec2 ab ) {
    p = abs(p); if( p.x > p.y ) {p=p.yx;ab=ab.yx;}
    float l = ab.y*ab.y - ab.x*ab.x;
    float m = ab.x*p.x/l;      float m2 = m*m; 
    float n = ab.y*p.y/l;      float n2 = n*n; 
    float c = (m2+n2-1.0)/3.0; float c3 = c*c*c;
    float q = c3 + m2*n2*2.0;
    float d = c3 + m2*n2;
    float g = m + m*n2;
    float co;
    if (d < 0.0) {
        float h = acos(q/c3)/3.0;
        float s = cos(h);
        float t = sin(h)*sqrt(3.0);
        float rx = sqrt( -c*(s + t + 2.0) + m2 );
        float ry = sqrt( -c*(s - t + 2.0) + m2 );
        co = (ry+sign(l)*rx+abs(g)/(rx*ry)- m)/2.0;
    } else {
        float h = 2.0*m*n*sqrt( d );
        float s = sign(q+h)*pow(abs(q+h), 1.0/3.0);
        float u = sign(q-h)*pow(abs(q-h), 1.0/3.0);
        float rx = -s - u - c*4.0 + 2.0*m2;
        float ry = (s - u)*sqrt(3.0);
        float rm = sqrt( rx*rx + ry*ry );
        co = (ry/sqrt(rm-rx)+2.0*g/rm-m)/2.0;
    }
    vec2 r = ab * vec2(co, sqrt(1.0-co*co));
    return length(r-p) * sign(p.y-r.y);
}
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float sdStar( in vec2 p, in float r, in int n, in float m) {
    // next 4 lines can be precomputed for a given shape
    float an = 3.141593/float(n);
    float en = 3.141593/m;  // m is between 2 and n
    vec2  acs = vec2(cos(an),sin(an));
    vec2  ecs = vec2(cos(en),sin(en)); // ecs=vec2(0,1) for regular polygon
    float bn = mod(atan(p.x,p.y),2.0*an) - an;
    p = length(p)*vec2(cos(bn),abs(sin(bn)));
    p -= r*acs;
    p += ecs*clamp( -dot(p,ecs), 0.0, r*acs.y/ecs.y);
    return length(p)*sign(p.x);
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    uv *= 0.5;
    uv.x *= ratio;
    uv = rotateUV(uv, pi*0.5, 0.0);
    vec2 v1 = vec2(-0.1, 0.1);
    vec2 v2 = vec2(0.1, 0.1);
    vec2 v3 = vec2(0.0, -0.1);
    float tri = 1.0 - sdEllipse(uv * 3., vec2(0.45, 0.8));
    float elli = tri;
    // tri = 1.0 - sdStar(uv, 0.1, 6, 0.4);
    // tri = 1.0 - sdCircleWave(uv, 0.5, 0.05);
    // tri = smoothstep(0.95, 1., tri) + smoothstep(0.5, 1., tri) * 0.5;
    float interior = (smoothstep(0.95, 1., tri));
    tri = smoothstep(0.7, 1., tri) * 1.0 - (smoothstep(0.99, 1., tri)) + (1.0-smoothstep(1., 1.05, tri)*2.1)*smoothstep(0.99, 1., tri)*0.5;
    // uv -= 0.5;
    // uv.x *= ratio;
    vec2 polar = vec2((atan(uv.y,uv.x)), length(uv));
    float voro = voronoise(polar*10., 0.75, 0.45);
    // float voro2 = voronoise(uv*12., 0.75, 0.3);
    voro *= pow((polar.x/pi), 2.) * -1. + 1.;
    voro *= min(1., length(uv)*10.);
    polar = rotateUV(polar, pi*0.15, 0.0);
    float voro3 = voronoise(polar*14.+vec2(1.,1.), 0.75, 0.3);
    // voro = mix(voro, voro3, 0.5);
    voro3 *= pow((polar.x/pi), 2.) * -1. + 1.;
    // voro3 *= 1.0-smoothstep(1.2, 1.5, elli);
    voro3 *= min(1., length(uv)*10.);
    voro = voro3;
    voro = mix(voro, voro3, 0.5);
    // voro = mix(voro, voro3, map(sin(-time*1e-1),-1.,1.,0.,1.));
    tri = max(tri, (interior * voro));
    tri += (1.0 - min(1., length(uv)*10.))*0.5;
    // tri *= map(sin(length(uv)*10.-time*1e-1),-1.,1.,0.25,1.);
    tri *= map(sin((uv.x+uv.y)*5.+time*1e-1),-1.,1.,0.25,1.);
    // tri = abs(tri - 0.5) * -1. + 0.5;
    tri = smoothstep(0., 1., tri);
    float noise = rand(uv + sin(time)) * 0.075;
    vec3 col = vec3(1.0, 0.0, 0.2);
    col = mix(col, vec3(1.0), pow(max(0.,tri),19.)*0.5);
    col = col * tri;
    // col = hueShift(col, 3.8);
    gl_FragColor = vec4(col, 1. - noise);
}
// endGLSL
`);

}