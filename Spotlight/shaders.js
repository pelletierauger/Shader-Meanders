if (false) {

// Spotlight, cleaned-up version
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
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.y / resolution.x;
    uv = uv - 0.5;
    uv.x /= ratio;
    uv -= vec2(0.5, 0.25);
    uv *= 8.;
    uv = rotateUV(uv, pi * 0.25, 0.);
    vec2 uv2 = vec2(uv.x + 0.3, uv.y * 0.0625);
    uv2.x = smoothstep(0., 1., uv2.x);
    uv2.x = smoothstep(0., 1., uv2.x);
    float circle = max(0., 1. / length(uv + vec2(0.125, 0.)) * 0.05);
    float c = sin(atan(uv.y, uv.x) + (pi * -0.5)) * 0.5 + 0.5;
    c = pow(c, 64.);
    c *= 1.0 - length(uv) * 0.15;
    c *= max(0., 1. - uv2.x * 64.);
    c = mix(c + circle, (1.0 - ((1.0 - c) * (1.0 - circle))), 0.5);
    gl_FragColor = vec4(vec3(c, pow(c, 5.) * 0.5, pow(c, 3.) * 0.95), 1.0);
}
// endGLSL
`);

// Spotlight, messy version
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
${blendingMath}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.y / resolution.x;
    vec3 col = vec3(uv.x, uv.y, 1.0 - uv.x);
    uv = uv - 0.5;
    uv.x /= ratio;
    uv -= vec2(0.5, 0.25);
    uv *= 8.;
    
    // uv.x = abs(uv.x+2.15);
    uv = rotateUV(uv, pi*0.25, 0.);
    // Mapping polar angle to 0-1
    // https://stackoverflow.com/questions/10619382/mapping-polar-angle-to-0-1
    col = vec3((atan(uv.y, uv.x) + pi) / (2. * pi));
    // Using the map function for the mapping.
    // col = vec3(map(atan(uv.y, uv.x), -pi, pi, 0., 1.));
    // Using the mix function to interpolate two colours.
    // col = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), map(atan(uv.y, uv.x), -pi, pi, 0., 1.));
    // Using the absolute value to wrap around the greyscale values.
    col = vec3(abs(map(atan(uv.y, uv.x), -pi, pi, -1., 1.)));
    // The same thing without the mapping.
    col = vec3(abs(atan(uv.y, uv.x) / pi));
    //  Using the angle from atan to oscillate with sin.
    col = vec3(map(sin(atan(uv.y, uv.x) + (pi * -0.5) ), -1., 1., 0., 1.));
    // Rotate it
    // col = vec3(map(sin(atan(uv.y, uv.x)+(pi*-0.5)+time*1e-1), -1., 1., 0., 1.));
    // Oscillate more than once
    col = vec3(map(sin(atan(uv.y, uv.x)+(pi*-0.5)), -1., 1., 0., 1.));
    col = vec3(pow(col.r, 64.));
    float circle = 1.0/length(uv)*0.02;
    circle = 1.0-length(uv)*2.;
    circle = 1.0-dot(uv+vec2(0.2,0.), uv+vec2(0.2,0.))*16.;
    vec2 uv2 = vec2(uv.x+0.3, uv.y*0.0625);
    if (uv2.x < 0.0) {
        uv2.x = 0.;
        uv2.y = 0.;
    }
    float circle2 = 1.0-dot(uv2, uv2)*45.;
    circle = smoothstep(0., 1., circle);
    float c = col.r;
    // c = circle;
    c = max(0., c);
    c *= 1.0-length(uv)*0.15;
    // c *=max(0.,circle2)*1.;
    // c = circle2;
    uv2.x = smoothstep(0., 1., uv2.x);
    uv2.x = smoothstep(0., 1., uv2.x);
    // c = mix(c, 1. - (1. / max(0.0,c)) * 0.2, 0.5);
    // c = 1. - (1. / c) * 20.;
    // c *= max(0.0,circle2);
    circle = max(0., 1./length(uv+vec2(0.125,0.))*0.05);
    
    // c = uv2.x;
    // c = (1.0 - ((1.0 - c) * (1.0 - circle)));
    // c = BlendScreenf(c, circle);
    // c = max(c, circle);
    // c = mix(c, max(0.0,circle), 1.-length(uv)*2.);
    // circle = smoothstep(0.8, 0.81, circle);
    // col *= circle;
    // c += max(0.,circle*0.125)
    
    c *= max(0., 1.-uv2.x*64.);
    // c = (1.0 - ((1.0 - c) * (1.0 - circle)));
    c = mix(c+circle, (1.0 - ((1.0 - c) * (1.0 - circle))), 0.5);
    uv.y = max(0.,1.-abs((uv.y-0.)*1.)+0.);
    uv.y = smoothstep(0., 1., uv.y);
    // c *= pow(uv.y, 1.);
    col = vec3(max(0.,c));
    // col += 1.0/length(uv)*0.005;
    // uv.x = abs((uv.x-0.5)*2.)+0.;
    // uv.x /= ratio;
    
    // circle = max(0., 1.0-length(uv) * 1.);
    // circle = smoothstep(0., 1., circle);
    // float c = uv.y;
    // c = 1./(abs(sin((uv.y)*16.*cos(uv.x-time*2e-2)))) * 0.75;
    // c *= 1./(abs(sin((uv.x)*16.*cos(uv.y-time*2e-2)))) * 0.75;
    // c = smoothstep(0., 1., c);
    // c = max(0., c);
    // c = 1.0-c;
    // col = vec3(c);
    // c = pow(c, 0.8);
    // c *= circle;
    // float vig = 1.0-length(uv *0.5);
    // col = c * vec3(1.0, 0.5, 0.25);
    
    // col *= smoothstep(0.1, 1., 1.0-length(uv *0.5));
    // col = hueShift(col, 2.5);
    // col = 1.0 - exp( -col );
    // col -= (1.0-vig)*0.25;
    // c = max(0., 1.0-c);
    // c = max(c, circle + c * 0.5);
    // col = col * 0.85 + vec3(circle);
    // col *= 1.0-length(uv)*0.5;
    // col = max(col, vec3(circle));
    // float circle2 = length(uv);
    // circle2 = abs(circle2) * -1. + 1.2;
    // float l = length(uv) * 2.55;
    // l = abs(l - 0.5) + 0.5;
    // l = 1. - l;
    // l = smoothstep(0., 1., l);
    // l = smoothstep(0., 1., l);
    // l = pow(l, 2.) * 4.;
    // l = min(1., l);
    // col = vec3(max(col.r, l));
    // col = vec3(mix(col.r, l * 0.95, l * 0.95));
    // col = vec3(l);
    // col *= smoothstep(0.6, 0.61, vec3(1.0-length(uv)));
    // Oscillate without mapping to 0-1
    // col = vec3(sin(atan(uv.y, uv.x) * 5. + time * 1e-1));
    // Oscillate with the absolute value, for a different effect
    // col = vec3(map(sin(abs(atan(uv.y, uv.x)) * 3. + time * 1e-1), -1., 1., 0., 1.));
    // col = vec3(map(sin(atan(uv.y, uv.x)-pi*0.5), -1., 1., 0., 1.));
    // Angular colour gradient
    // col.r = map(sin(atan(uv.y, uv.x) * 5. + time * 1e-1), -pi, pi, 0., 1.);
    // col.g = map(sin(atan(uv.y, uv.x) * 2. + time * 1.5e-1), -pi, pi, 1., 0.);
    // col.b = map(sin(atan(uv.y, uv.x) * 6. + time * 3e-1), -pi, pi, 1., 0.);
    // Modulating only one channel (the red channel).    
    // col.r = map(sin(col.r*pi*2.+time*1e-1), -1., 1., 0., 1.);
    // gl_FragColor = vec4(vec3(col.r), 1.0);
    // gl_FragColor = vec4(vec3(c), 1.0);
    // gl_FragColor = vec4(vec3(c, pow(c, 3.)*0.5, pow(c, 3.)*0.5), 1.0);
    gl_FragColor = vec4(col, 1.);
    c = col.r;
    gl_FragColor = vec4(vec3(c, pow(c, 5.)*0.5, pow(c, 3.)*0.95), 1.0);
}
// endGLSL
`);

// Spotlight via conic section
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.y / resolution.x;
    vec3 col = vec3(0.);
    uv = uv - 0.5;
    uv.x /= ratio;
    uv *= 8.;
    uv += vec2(-7.4, 0.5) * 0.5;
    // vec2 uv = (fragCoord - .5 * iResolution.xy) / iResolution.y;
    // vec3 col;
  vec3 camera = vec3(0., 0, -1.);
    vec3 screen = vec3(uv.x, uv.y, 0.);
    vec3 ray = normalize(screen - camera);
    
    float numSteps = 5. / (ray.z);
    vec3 planePoint = screen + ray * numSteps;
    float t = 0.25;
    // t = time * 1e-1;
    // move a torch around in some swirly way.
    vec3 torch = vec3(
        2. * sin(t), 
        0.2 * cos(t),
        4.+.99 * sin(t)
    );
    vec3 torchDir = normalize(
        vec3(-7. * sin(t),
             cos(0.618 * t),
             0.5 + 0.49 * cos(2. * t)
            )
    );
    
    col +=  smoothstep(0.9, 1.0, dot(normalize(planePoint - torch), torchDir));
    
    col.r = mix(col.r, max(0.,1.-1./col.r * 0.05),0.125);
    // Output to screen
    // fragColor = vec4(col, 1.0);
    gl_FragColor = vec4(col, 1.0);
    gl_FragColor = vec4(vec3(col.r, pow(col.r, 7.), pow(col.r, 7.)), 1.0);
}
// endGLSL
`);

}