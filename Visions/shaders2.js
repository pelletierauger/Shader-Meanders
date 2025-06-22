if (false) {

// Animated rectangular gradient, asymmetrical version
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
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.y / resolution.x;
    uv -= 0.5;
    uv.y *= ratio;
    vec3 col = vec3(1.0-dot(uv*4., uv*4.), 0., 0.);
    float osc = (map(sin(atan(uv.y, uv.x)*20.+(pi*-0.5)), -1., 1., 0., 0.2));
    col.r = col.r * 0.9 + 0.1 * (sin(length(uv*300.)*(1.+osc*length(uv))-time*0.1)*0.5+0.5);
    // col.r = sin()
    // osc = (map(sin(atan(uv.y, uv.x)*10.+(pi*-0.5)), -1., 1., 0., 0.2));
    // col.b = (sin(length(uv*100.)*(1.+osc*length(uv))-time*0.1)*0.5+0.5)*0.5*length(uv);
    // col.g = col.b*0.5;
    col.r = max(0., col.r);
    col = vec3(col.r, pow(col.r,3.)*0.,pow(col.r,8.)*0.3);
    // col += vec3(0., 0., 1.-(uv.y*12.+(sin(uv.x*40.))*0.1)-1.85);
    // col.b = smoothstep(0., 1., col.b)*0.75;
    // col.r = max(col.r, col.b*1.-length(uv));
    gl_FragColor = vec4(col, 1.0);
}
// endGLSL
`);

// Animated rectangular gradient, asymmetrical version
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
float dot2( in vec2 v ) { return dot(v,v); }
float sdTunnel(vec2 p, vec2 wh ){
    p.x = abs(p.x); p.y = -p.y;
    vec2 q = p - wh;
    float d1 = dot2(vec2(max(q.x,0.0),q.y));
    q.x = (p.y>0.0) ? q.x : length(p)-wh.x;
    float d2 = dot2(vec2(q.x,max(q.y,0.0)));
    float d = sqrt( min(d1,d2) );
    
    return (max(q.x,q.y)<0.0) ? -d : d;
}
float ndot(vec2 a, vec2 b ) { return a.x*b.x - a.y*b.y; }
float sdRhombus( in vec2 p, in vec2 b ) {
    p = abs(p);
    float h = clamp( ndot(b-2.0*p,b)/dot(b,b), -1.0, 1.0 );
    float d = length( p-0.5*b*vec2(1.0-h,1.0+h) );
    return d * sign( p.x*b.y + p.y*b.x - b.x*b.y );
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.y / resolution.x;
    uv -= 0.5;
    uv.y *= ratio;
    vec2 ov = uv;
    float osc = (map(sin(atan(uv.y, uv.x)*20.+(pi*-0.5)+time*0.25), -1., 1., 0., 0.2));
    // uv *= 1.-osc*-0.05;
    vec3 col = vec3(1.0-dot(uv*5., uv*5.), 0., 0.);
    col.r = col.r * 0.9 + 0.1 * (sin(length(uv*300.)*(1.+osc*length(uv))-time*0.1)*0.5+0.5);
    // col.r = sin()
    // col *= vec3(smoothstep(0.1, 0.15, max(0.,1.0-dot(uv*4., uv*4.))), 0., 0.);
    // osc = (map(sin(atan(uv.y, uv.x)*10.+(pi*-0.5)), -1., 1., 0., 0.2));
    // col.b = (sin(length(uv*100.)*(1.+osc*length(uv))-time*0.1)*0.5+0.5)*0.5*length(uv);
    // col.g = col.b*0.5;
    // col += vec3(0., 0., 1.-(uv.y*12.+(sin(uv.x*40.))*0.1)-1.85);
    // col.b = smoothstep(0., 1., col.b)*0.75;
    // col.r = max(col.r, col.b*1.-length(uv));
    float x = sdTunnel(uv*35., vec2(8.));
    float oX = x;
    x = abs((x-0.5)*2.)*-1.+1.;
    x = smoothstep(0., 1., x);
    x *= sin(uv.y*12.+time*1e-1)*0.5+0.5;
    uv = vec2(abs(uv.x) - 0.375, mod(uv.y+0.1, 0.2)-0.1);
    float rh = 1.-sdRhombus(uv*65., vec2(2.5));
    float oRh = rh;
    rh = abs((rh)*1.)*-1.+1.;
    rh = max(0., rh);
    rh = smoothstep(0., 1., rh) * (sin(ov.y*12.+time*1e-1)*0.5+0.5);
    osc = (map(sin(atan(uv.y, uv.x)*10.+(pi*-0.5)+time*0.25), -1., 1., 0., 0.2));
    float ff = 1.0-dot(uv*5., uv*5.);
    ff = ff * 0.5 + 0.95 * (sin(length(uv*200.)*(1.+osc*length(uv*100.))-time*0.1)*0.5+0.5);
    ff = max(0., ff * 1.0-length(uv*40.));
    // ff = min(1., ff);
    col.r = max(0., col.r);
    col.r += x;
    rh = min(1., rh);
    col.r += rh;
    float fl = (sin(ov.y*12.+time*1e-1)*0.5+0.5);
    col.r = max(col.r,max(0.,ff*((min(1.,oX*2.) - max(0., 1.-oRh*2.)))*0.75*fl));
    ov.x += sin(10. + ov.y * 0.2 * cos(ov.x * 10. + time * -0.1) + 10.);
    float gg = sin(ov.x*300. + ov.y*10.)*0.5+0.5;
    // col.r = max(col.r,max(0.,gg*0.25*((min(1.,oX*2.) - max(0., oRh*2.)))*0.75*fl));
    col = vec3(col.r, pow(col.r,3.)*0.,pow(col.r,8.)*0.6);
    // col.b = smoothstep(0., 1., col.b);
    // col.g += pow(col.b, 3.)*0.5 + (col.b);
    // col.r += pow(col.b, 3.)*0.5;
    // col += vec3(0., rh, rh*0.75);
    gl_FragColor = vec4(col, 1.0);
}
// endGLSL
`);

// Animated rectangular gradient, asymmetrical version
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
float f(vec2 x) {
    float r = length(x);
    float a = atan(x.y,x.x);
    return r - 1.0 + 0.5*sin(3.0*a+2.0*r*r);
}
vec2 grad(vec2 x) {
    vec2 h = vec2( 0.01, 0.0 );
    return vec2( f(x+h.xy) - f(x-h.xy),
                 f(x+h.yx) - f(x-h.yx) )/(2.0*h.x);
}
float color(vec2 x) {
    float v = abs(f(x));
    float eps = 10./resolution.x;
    return smoothstep( 1.0*eps, 2.0*eps, v );
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.y / resolution.x;
    uv -= 0.5;
    uv*= 16.;
    // uv.y *= ratio;
    // float c = color(uv);
    // float fx = f(x);
    vec2 g = grad(uv);
    gl_FragColor = vec4(vec3(g.x), 1.0);
}
// endGLSL
`);


}