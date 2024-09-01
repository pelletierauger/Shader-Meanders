if (false) {

// The simplest shader
setBothShaders(`
// beginGLSL
precision mediump float;
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
const float TURBULENCE = 0.009;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise( in vec2 p ) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
    vec2  i = floor(p + (p.x + p.y) * K1 );
    vec2  a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x); 
    vec2  o = vec2(m, 1.0 - m);
    vec2  b = a - o + K2;
    vec2  c = a - 1.0 + 2.0 * K2;
    vec3  h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
    vec3  n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
}
const mat2 m2 = mat2(1.6,  1.2, -1.2,  1.6);
float fbm(vec2 p) {
    float amp = 0.5;
    float h = 0.0;
    for (int i = 0; i < 8; i++) {
        float n = noise(p);
        h += amp * n;
        amp *= 0.5;
        p = m2 * p;
    }
    return  0.5 + 0.5 * h;
}
vec3 cloudEffect(vec2 uv) {
    vec3 col = vec3(0.0, 0.0, 0.0);
    // time scale
    float v = 0.0002;
    vec3 smoke = vec3(1.0);
    vec2 scale = uv * 0.5;
    vec2 turbulence = TURBULENCE * vec2(noise(uv));
    scale += turbulence;
    float n1 = fbm(scale);
    col = mix(col, smoke, smoothstep(0.35, 0.9, n1));
    col = clamp(col, vec3(0.0), vec3(1.0));
    return col;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution + vec2(0., -0.);
    // uv -= 0.5;
    vec2 muv = uv;
    uv.x += time * 1e-3;
    muv.x += time * 3e-3;
    float rando = rand(uv+time*1e-2) * 0.05;
    float h = sin(uv.x * 10. + 0.1)*0.5+0.5;
    float h2 = sin(uv.x * 8. - 2.5)*0.5+0.5;
    float h3 = sin(uv.x * 8. - 0.3)*0.5+0.5;
    h = noise(vec2(uv.x * 3., 1.0));
    h2 = noise(vec2(uv.x * 3. + 10., 1.0));
    h3 = noise(vec2(uv.x * 3. + 20., 1.0));
    float zz = abs(fract(uv.x*250.+0.5)-0.5)*1.;
    float treeRand = rand(vec2(floor(uv.x*250.+0.), 1.));
    zz = zz * 0.0075 * treeRand;
    float zzo = abs(fract(uv.x*250.+0.5)-0.5)*1.;
    float treeRand2 = rand(vec2(floor(uv.x*250.+0.), 10.));
    float zz2 = zzo * 0.0075 * treeRand2;
    float treeRand3 = rand(vec2(floor(uv.x*250.+0.), 20.));
    float zz3 = zzo * 0.0075 * treeRand3;
    h = smoothstep(0.5, 0.4, uv.y - 0.05 + h * 0.1 - zz);
    h = smoothstep(0.985, 1., h);
    vec3 col = vec3(116., 75., 101.) / 256.;
    vec3 colB = vec3(104., 81., 104.) / 256.;
    vec3 colC = vec3(205., 135., 130.) / 256.;
    col = mix(col, colB, uv.y * 2. - 0.2);
    // col = mix(col, colC, sin(uv.x*5.)*0.5+0.5);
    col = mix(col, colC, map(sin(uv.x*5.), -1., 1., 0.4, 1.));
    float interlace = 1.0 - (sin(uv.y * 1. + time * 0.25) * 0.5 + 0.5) * 1.;
    // col *= interlace;
    float bright = mix(1., 1.25, sin(uv.x*5.)*0.5+0.5);
    // bright = 1.0;
    vec3 col2 = vec3(65., 63., 92.) / 256.;
    
    vec3 col2B = vec3(65., 63., 92.) / 256. * 2.5;
    col2 = mix(col2, col2B, smoothstep(0.5, 0.1, uv.y));
    vec3 col3 = vec3(29., 43., 76.) / 256.;
    vec3 col3B = vec3(29., 43., 76.) / 256. * 2.5;
    col3 = mix(col3, col3B, smoothstep(0.6, 0.0, uv.y*1.2));
    
    col = mix(col, col2, h);
    h = smoothstep(0.5, 0.4, uv.y + 0.05 + h2 * 0.1 - zz2);
    h = smoothstep(0.985, 1., h);
    col = mix(col, col3, h);
    h = smoothstep(0.5, 0.4, uv.y + 0.1 + h3 * 0.1 - zz3);
    h = smoothstep(0.985, 1., h);
    col = mix(col, vec3(0.0), h);
    // col -= (noise(uv)*0.5+0.5) * 0.25;
    col = vec3(pow(col.r, 2.),pow(col.g, 2.),pow(col.b, 2.));
    col -= cloudEffect(uv * 2. * vec2(0.25, 1.)) * 0.5;
    // col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.35)) * 0.5;
    // col -= cloudEffect(muv * 2. * vec2(0.25, 1.)) * 0.5;
    col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.25)) * 0.5;
    // h = (uv.x+uv.y)*0.5;
    // col *= 4.;
    float darkSky = min((-uv.y*2.)+2.5, 1.);
    darkSky *= min((-uv.y*1.)+1.5, 1.);
    darkSky *= min((-uv.y*2.)+2.5, 1.);
    // darkSky = smoothstep(0., 1., darkSky);
    col *= darkSky;
    col *= 2.;
    gl_FragColor = vec4(col - rando, 1.0);
}
// endGLSL
`.replace(/[^\x00-\x7F]/g, ""));

drawCount = 38669;
// Luminous travelers among the hills
setBothShaders(`
// beginGLSL
precision mediump float;
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
const float TURBULENCE = 0.009;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise( in vec2 p ) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
    vec2  i = floor(p + (p.x + p.y) * K1 );
    vec2  a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x); 
    vec2  o = vec2(m, 1.0 - m);
    vec2  b = a - o + K2;
    vec2  c = a - 1.0 + 2.0 * K2;
    vec3  h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
    vec3  n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
}
const mat2 m2 = mat2(1.6,  1.2, -1.2,  1.6);
float fbm(vec2 p) {
    float amp = 0.5;
    float h = 0.0;
    for (int i = 0; i < 8; i++) {
        float n = noise(p);
        h += amp * n;
        amp *= 0.5;
        p = m2 * p;
    }
    return  0.5 + 0.5 * h;
}
vec3 cloudEffect(vec2 uv) {
    vec3 col = vec3(0.0, 0.0, 0.0);
    // time scale
    float v = 0.0002;
    vec3 smoke = vec3(1.0);
    vec2 scale = uv * 0.5;
    vec2 turbulence = TURBULENCE * vec2(noise(uv));
    scale += turbulence;
    float n1 = fbm(scale);
    col = mix(col, smoke, smoothstep(0.35, 0.9, n1));
    col = clamp(col, vec3(0.0), vec3(1.0));
    return col;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution + vec2(0., -0.);
    // uv -= 0.5;
    vec2 muv = uv;
    uv.x += time * 1e-3;
    muv.x += time * 3e-3;
    float rando = rand(uv+time*1e-2) * 0.05;
    float h = sin(uv.x * 10. + 0.1)*0.5+0.5;
    float h2 = sin(uv.x * 8. - 2.5)*0.5+0.5;
    float h3 = sin(uv.x * 8. - 0.3)*0.5+0.5;
    h = noise(vec2(uv.x * 3., 1.0));
    h2 = noise(vec2(uv.x * 3. + 10., 1.0));
    h3 = noise(vec2(uv.x * 3. + 20., 1.0));
    float zz = abs(fract(uv.x*250.+0.5)-0.5)*1.;
    float treeRand = rand(vec2(floor(uv.x*250.+0.), 1.));
    zz = zz * 0.0075 * treeRand;
    h = smoothstep(0.5, 0.4, uv.y - 0.05 + h * 0.1 - zz);
    h = smoothstep(0.985, 1., h);
    float topHill = h;
    vec3 col = vec3(116., 75., 101.) / 256.;
    vec3 colB = vec3(104., 81., 104.) / 256.;
    vec3 colC = vec3(205., 135., 130.) / 256.;
    col = mix(col, colB, uv.y * 2. - 0.2);
    // col = mix(col, colC, sin(uv.x*5.)*0.5+0.5);
    col = mix(col, colC, map(sin(uv.x*5.), -1., 1., 0.4, 1.));
    float interlace = 1.0 - (sin(uv.y * 1. + time * 0.25) * 0.5 + 0.5) * 1.;
    // col *= interlace;
    float bright = mix(1., 1.25, sin(uv.x*5.)*0.5+0.5);
    // bright = 1.0;
    vec3 col2 = vec3(65., 63., 92.) / 256.;
    
    vec3 col2B = vec3(65., 63., 92.) / 256. * 2.5;
    col2 = mix(col2, col2B, smoothstep(0.5, 0.1, uv.y));
    vec3 col3 = vec3(29., 43., 76.) / 256.;
    vec3 col3B = vec3(29., 43., 76.) / 256. * 2.5;
    col3 = mix(col3, col3B, smoothstep(0.6, 0.0, uv.y*1.2));
    
    col = mix(col, col2, h);
    h = smoothstep(0.5, 0.4, uv.y + 0.05 + h2 * 0.1 - zz);
    h = smoothstep(0.985, 1., h);
    col = mix(col, col3, h);
    h = smoothstep(0.5, 0.4, uv.y + 0.1 + h3 * 0.1 - zz);
    h = smoothstep(0.985, 1., h);
    col = mix(col, vec3(0.0), h);
    // col -= (noise(uv)*0.5+0.5) * 0.25;
    col = vec3(pow(col.r, 2.),pow(col.g, 2.),pow(col.b, 2.));
    col -= cloudEffect(uv * 2. * vec2(0.25, 1.)) * 0.5;
    // col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.35)) * 0.5;
    // col -= cloudEffect(muv * 2. * vec2(0.25, 1.)) * 0.5;
    col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.35)) * 0.5;
    // h = (uv.x+uv.y)*0.5;
    // col *= 4.;
    float darkSky = min((-uv.y*2.)+2.5, 1.);
    darkSky *= min((-uv.y*1.)+1.5, 1.);
    darkSky *= min((-uv.y*2.)+2.5, 1.);
    // darkSky = smoothstep(0., 1., darkSky);
    col *= darkSky;
    col *= 2.;
    gl_FragColor = vec4(col.bgr - rando, 1.0);
    // gl_FragColor.b += gl_FragColor.r * 0.5 * (sin(time)*0.5+0.5);
    gl_FragColor.r *= 2. * (sin(time*2e-1+uv.x*10.)*0.5+0.5) * topHill;
    // gl_FragColor.r *= 2. * (sin(time*2e-1+(length(uv*10.))*1.)*0.5+0.5) * topHill;
    // gl_FragColor.g *= 1. * (cos(time+uv.x*10.)*0.5+0.5) * topHill;
}
// endGLSL
`.replace(/[^\x00-\x7F]/g, ""));

// drawCount = 38669;
// Luminous travelers among the hills
setBothShaders(`
// beginGLSL
precision mediump float;
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
const float TURBULENCE = 0.009;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise( in vec2 p ) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
    vec2  i = floor(p + (p.x + p.y) * K1 );
    vec2  a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x); 
    vec2  o = vec2(m, 1.0 - m);
    vec2  b = a - o + K2;
    vec2  c = a - 1.0 + 2.0 * K2;
    vec3  h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
    vec3  n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
}
const mat2 m2 = mat2(1.6,  1.2, -1.2,  1.6);
float fbm(vec2 p) {
    float amp = 0.5;
    float h = 0.0;
    for (int i = 0; i < 8; i++) {
        float n = noise(p);
        h += amp * n;
        amp *= 0.5;
        p = m2 * p;
    }
    return  0.5 + 0.5 * h;
}
vec3 cloudEffect(vec2 uv) {
    vec3 col = vec3(0.0, 0.0, 0.0);
    // time scale
    float v = 0.0002;
    vec3 smoke = vec3(1.0);
    vec2 scale = uv * 0.5;
    vec2 turbulence = TURBULENCE * vec2(noise(uv));
    scale += turbulence;
    float n1 = fbm(scale);
    col = mix(col, smoke, smoothstep(0.35, 0.9, n1));
    col = clamp(col, vec3(0.0), vec3(1.0));
    return col;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution + vec2(0., -0.);
    // uv -= 0.5;
    vec2 muv = uv;
    vec2 ov = uv;
    uv.x += 38669. * 1e-3 - 0.037;
    muv.x += 38669. * 3e-3 - 0.037;
    float rando = rand(uv+time*1e-2) * 0.05;
    float h = sin(uv.x * 10. + 0.1)*0.5+0.5;
    float h2 = sin(uv.x * 8. - 2.5)*0.5+0.5;
    float h3 = sin(uv.x * 8. - 0.3)*0.5+0.5;
    h = noise(vec2(uv.x * 3., 1.0));
    h2 = noise(vec2(uv.x * 3. + 10., 1.0));
    h3 = noise(vec2(uv.x * 3. + 20., 1.0));
    float zz = abs(fract(uv.x*250.+0.5)-0.5)*1.;
    float treeRand = rand(vec2(floor(uv.x*250.+0.), 1.));
    zz = zz * 0.0075 * treeRand;
    float zzo = abs(fract(uv.x*250.+0.5)-0.5)*1.;
    float treeRand2 = rand(vec2(floor(uv.x*250.+0.), 10.));
    float zz2 = zzo * 0.0075 * treeRand2;
    float treeRand3 = rand(vec2(floor(uv.x*250.+0.), 20.));
    float zz3 = zzo * 0.0075 * treeRand3;
    h = smoothstep(0.5, 0.4, uv.y - 0.05 + h * 0.1 - zz);
    h = smoothstep(0.985, 1., h);
    float topHill = h;
    vec3 col = vec3(116., 75., 101.) / 256.;
    vec3 colB = vec3(104., 81., 104.) / 256.;
    vec3 colC = vec3(205., 135., 130.) / 256.;
    col = mix(col, colB, uv.y * 2. - 0.2);
    // col = mix(col, colC, sin(uv.x*5.)*0.5+0.5);
    col = mix(col, colC, map(sin(uv.x*5.), -1., 1., 1., 1.)) * 0.9;
    col.b += 0.05 * (sin(-time*0.5e-1 - 1.4 +(length((ov-vec2(0.5, 0.))*vec2(1.,1.)))*10.)*0.5+0.5);
    float interlace = 1.0 - (sin(uv.y * 1. + time * 0.25) * 0.5 + 0.5) * 1.;
    // col *= interlace;
    float bright = mix(1., 1.25, sin(uv.x*5.)*0.5+0.5);
    // bright = 1.0;
    vec3 col2 = vec3(65., 63., 92.) / 256.;
    
    vec3 col2B = vec3(65., 63., 92.) / 256. * 2.5;
    col2 = mix(col2, col2B, smoothstep(0.5, 0.1, uv.y));
    vec3 col3 = vec3(29., 43., 76.) / 256.;
    vec3 col3B = vec3(29., 43., 76.) / 256. * 2.5;
    col3 = mix(col3, col3B, smoothstep(0.6, 0.0, uv.y*1.2));
    col2 *= 1. * (sin(-time*0.5e-1+0.+(length(ov-vec2(0.5, 0.)))*10.)*0.5+0.5);
    // col2 *= map(sin(abs(atan(ov.y - 0., ov.x - 0.5))*150.), -1., 1., 0.975, 1.0);
    col = mix(col, col2, h);
    h = smoothstep(0.5, 0.4, uv.y + 0.05 + h2 * 0.1 - zz2);
    h = smoothstep(0.985, 1., h);
    col3 *= 1.5 * (sin(-time*0.5e-1-0.5+(length(ov-vec2(0.5, 0.)))*10.)*0.5+0.5);
    // col3 *= map(sin(abs(atan(ov.y - 0., ov.x - 0.5))*100.), -1., 1., 0.975, 1.0);
    col = mix(col, col3, h);
    float midHill = h;
    h = smoothstep(0.5, 0.4, uv.y + 0.1 + h3 * 0.1 - zz3);
    h = smoothstep(0.985, 1., h);
    col = mix(col, vec3(0.0), h);
    // col -= (noise(uv)*0.5+0.5) * 0.25;
    col = vec3(pow(col.r, 2.),pow(col.g, 2.),pow(col.b, 2.));
    col -= cloudEffect(uv * 2. * vec2(0.25, 1.)) * 0.5;
    // col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.35)) * 0.5;
    // col -= cloudEffect(muv * 2. * vec2(0.25, 1.)) * 0.5;
    col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.35)) * 0.5;
    // h = (uv.x+uv.y)*0.5;
    // col *= 4.;
    float darkSky = min((-uv.y*2.)+2.5, 1.);
    darkSky *= min((-uv.y*1.)+1.5, 1.);
    darkSky *= min((-uv.y*2.)+2.5, 1.);
    // darkSky = smoothstep(0., 1., darkSky);
    col *= darkSky;
    col *= 2.;
    gl_FragColor = vec4(col.bgr - rando, 1.0);
    // gl_FragColor.b += gl_FragColor.r * 0.5 * (sin(time)*0.5+0.5);
    // gl_FragColor.r *= 2. * (sin(time*2e-1+uv.x*10.)*0.5+0.5) * topHill;
    if (topHill > 0.0) {
        // gl_FragColor.g = 0.0;
        // gl_FragColor.b = 0.0;
    }
    // gl_FragColor.g *= 1. * (cos(time+uv.x*10.)*0.5+0.5) * topHill;
}
// endGLSL
`.replace(/[^\x00-\x7F]/g, ""));

}