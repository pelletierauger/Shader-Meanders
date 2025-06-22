if (false) {

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
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
    void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        uv = uv - 0.5;
        uv.y -= map(sin(time*0.01), -1., 1., 0., 0.125);
        uv.x *= 1280./720.;
        // uv.x *= map(sin(uv.x*0.01+time*0.125), -1., 1., 0.8, 1.2);
        float c = map(sin(atan(uv.y, uv.x)+(pi*-1.)+sin(time*1e-1)*0.1), -1., 1., 0., 1.);
        float a = 250.;
        c = a * c - (a - 1.);
        c *= sin(pow(length(uv), 0.125)*140.-time*2.25)*0.5+0.5;
        // c *= max(0., 1.0-length(uv+vec2(0., 0.5))*1.);
        float spot = 1.0-length(uv+vec2(0., 0.85))*0.85;
        c = max(c, spot);
        
        // float c2 = map(sin(atan(uv.y, abs(uv.x)-0.2)+(pi*-1.25)+sin(time*1e-1)*0.1), -1., 1., 0., 1.);
        // float a2 = 250.;
        // c2 = a2 * c2 - (a - 1.);
        // c = max(c, c2);
        // c = max(c, c+c2*max(0., min(1., spot)));
        c += (1.0-length(vec2(abs(2.*abs(uv.x)-1.), uv.y*2.+1.))) * (1. - c);
        c *= map(sin(pow(length(uv*vec2(0.1, 1.)), 0.125)*70.-time*2.), -1., 1., 0.7, 1.)*max(0., spot*2.);
        gl_FragColor = vec4(vec3(c, 0., 0.)-(rand(uv+time*1e-2)*0.05), 1.0);
    }
// endGLSL
`);

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
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
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
    void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        uv = uv - 0.5;
        // uv.y -= map(sin(time*0.01), -1., 1., 0., 0.125);
        uv.x *= 1280./720.;
        // uv.x *= map(sin(uv.x*0.01+time*0.125), -1., 1., 0.8, 1.2);
        float c = map(sin(atan(uv.y, uv.x)+(pi*-1.)+sin(time*1e-1*0.2)*0.1), -1., 1., 0., 1.);
        float a = 250.;
        c = a * c - (a - 1.);
        c *= sin(pow(length(uv), 0.125)*140.-time*2.25*0.2)*0.5+0.5;
        // c *= max(0., 1.0-length(uv+vec2(0., 0.5))*1.);
        float spot = 1.0-length(uv+vec2(0., 0.85))*0.75;
        spot = pow(spot, 3.)*3.;
        c = max(c, spot * pow(map(uv.y, -1., 1., 1., 0.), 3.)*2.);
        vec2 polar = vec2(sin(atan(uv.y, uv.x*0.1)+(pi*-1.)+sin(time*1e-1*0.2)*0.01)*pi*30., pow(length(uv*vec2(0.01, 1.)), 0.125)*140.-time*2.25*0.2);
        float n = noise(polar * vec2(1., 0.5));
        // float c2 = map(sin(atan(uv.y, abs(uv.x)-0.2)+(pi*-1.25)+sin(time*1e-1)*0.1), -1., 1., 0., 1.);
        // float a2 = 250.;
        // c2 = a2 * c2 - (a - 1.);
        // c = max(c, c2);
        // c = max(c, c+c2*max(0., min(1., spot)));
        // c += (1.0-length(vec2(abs(2.*abs(uv.x)-1.), uv.y*2.+1.))) * (1. - c);
        // c *= map(sin(pow(length(uv*vec2(0.1, 1.)), 0.125)*140.-time*2.25*0.2), -1., 1., 0.7, 1.)*max(0., spot*2.);
        c += n * 0.0625 * pow(map(uv.y, -1., 1., 1., 0.), 3.) * 4. * (1.-c);
        // c *= min(1., length(uv*10.));
        // c = max(c, spot);
        // c *= 
        gl_FragColor = vec4(vec3(c, 0., pow(c, 3.)*0.5)-(rand(uv+time*1e-2)*0.05), 1.0);
    }
// endGLSL
`);

}