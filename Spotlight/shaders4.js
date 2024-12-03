if (false) {

// Spotlight with fog, flashing, and hue shift
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
${blendingMath}
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
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
float multilevelNoise(vec2 uv, vec2 p) {
    float f = 0.0;
    vec2 muv = uv * 1.;
    muv.x *= 0.25;
    // muv.x += time * -1e-2;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    f  = 0.5000 * noise(muv);
    muv = m * muv;
    f += 0.2500 * noise(muv);
    muv = m * muv;
    f += 0.1250 * noise(muv);
    muv = m * muv;
    f += 0.0625 * noise(muv);
    f = 0.5 + 0.5 * f;
    // f *= smoothstep(0.0, 0.005, abs(p.x - 0.5)); 
    return f;
}
vec3 spotlight(vec2 uv, vec2 pos, float angle, float fog, float time) {
    vec2 muv = uv;
    muv -= pos;
    muv = rotateUV(muv, angle, 0.);
    muv -= vec2(0.125, 0.);
    vec2 uv2 = vec2(muv.x + 0.3, muv.y * 0.0625);
    uv2.x = smoothstep(0., 1., uv2.x);
    uv2.x = smoothstep(0., 1., uv2.x);
    float osc = sin(time * 1e-1) * 0.5 + 0.5;
    float x = fract(time * 1e-2) * 2.;
    osc = fract(x)*5.*(-1.+floor(x)*2.)+(1.-floor(x));
    osc = clamp(osc, 0., 1.);
    float oscNoFloor = osc;
    osc = max(osc, max(0.,(fract(x)*-0.3+0.3)*(1.-floor(x))));
    float hue = mod(floor(((fract(time * 0.5e-2) * 4.)+1.)*0.5), 2.);
    float circle;
    if (osc < 0.4) {
        float x2 = length(muv + vec2(0.125, 0.));
        float ha = 0.0;
        for (float i = 0.; i < 10.; i += 1.) {
            float a = 0.3 + pow(i * 0.35, 2.);
            ha = max(ha, (-x2*a*a+a)*0.2);
        }
        for (float i = 17.; i < 25.; i += 2.) {
            float a = 0.3 + pow(i * 0.35, 2.);
            ha = max(ha, (-x2*a*a+a)*0.2);
        }
        circle = ha;
    } else {
        circle = max(0., 1. / length(muv + vec2(0.125, 0.)) * 0.05);
    }
    // circle = max(0., 1. / length(muv + vec2(0.125, 0.)) * 0.05);
    float c = sin(atan(muv.y, muv.x) + (pi * -0.5)) * 0.5 + 0.5;
    c = pow(c, 64.);
    c *= 1.0 - length(muv) * 0.15;
    c *= max(0., 1. - uv2.x * 64.);
    c = mix(c * oscNoFloor + circle*osc, (1.0 - ((1.0 - c * oscNoFloor) * (1.0 - circle*osc))), 0.5);
    // c *= 1. - fog * 0.4;
    c = max(0., c);
    vec3 col = vec3(c, pow(c, 5.) * 0.5, pow(c, 3.) * 0.95);
    col = hueShift2(col, pi * 0.75 * hue);
    return col;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.y / resolution.x;
    uv = uv - 0.5;
    uv.x /= ratio;
    uv *= 8.;
    float fog = multilevelNoise(uv, vec2(0.0));
    vec3 col = vec3(0.);
    for (float i = 0.0; i < pi * 2.; i+= pi * 2. / 15.) {
        float ii = i + (pi * 2. / 10.) * 0.5;
        float x = cos(ii - time*1e-2), y = sin(ii - time*1e-2);
        float angle = atan(y, x);
        vec3 c = spotlight(uv, vec2(x * 3., y * 3.), angle+pi*0.75, fog, time+i*3e1);
        col = BlendScreen(col, c);
    }
    float c = smoothstep(0.5,1.,(1.-length(uv)*0.125));
    c = pow(c, 2.);
    c = mix(c, 1.0 - exp( -c ),0.4);
    vec3 c3 = vec3(c, pow(c, 3.), (1.-c)*c);
    c3 = hueShift2(c3, 1.);
    gl_FragColor = vec4(BlendScreen(c3,col), 1.0);
}
// endGLSL
`);

}