if (false) {

// Eyes
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
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
    uv.x *= ratio;
    float col = 0.0;
    // col += sdEquilateralTriangle(uv * 40., 4.);
    // col += sdEquilateralTriangle(uv * 10., 1.);
    uv.x *= 0.9;
    uv.x = abs(uv.x);
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    iris = smoothstep(0.1, 0.9, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.))*0.5+0.5) * 0.05;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 8.);
    iris2 = smoothstep(0.35, 0.65, iris2);     
    float iris3 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.);
    iris3 = smoothstep(0., 1., iris3) * 0.35;
    col = col - iris - iris2 - iris3;
    // col = iris;
    col = smoothstep(0., 1., col);
    if (col < 0.01) {
        discard;
    }
    float noise = rand(uv + sin(time)) * 0.075;
    float br = pow(col, 4.) * 0.2;
    gl_FragColor = vec4(vec3(1.0, br, br), col - noise);
}
// endGLSL
`);

// Eyes, circular saw
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
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
    uv.x *= ratio;
    float col = 0.0;
    // col += sdEquilateralTriangle(uv * 40., 4.);
    // col += sdEquilateralTriangle(uv * 10., 1.);
    uv.x *= 0.9;
    uv.x = abs(uv.x);
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    iris = smoothstep(0.4, 0.6, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.)+time)*0.5+0.5) * 0.5;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 8.);
    iris2 = smoothstep(0.35, 0.65, iris2);     
    float iris3 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.);
    iris3 = smoothstep(0., 1., iris3) * 0.35;
    col = col - iris - iris2 - iris3;
    // col = iris;
    col = smoothstep(0., 1., col);
    if (col < 0.01) {
        discard;
    }
    float noise = rand(uv + sin(time)) * 0.075;
    float br = pow(col, 4.) * 0.2;
    gl_FragColor = vec4(vec3(1.0, br, br), col - noise);
}
// endGLSL
`);

// The eye
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
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
    uv.x *= ratio;
    float col = 0.0;
    // col += sdEquilateralTriangle(uv * 40., 4.);
    // col += sdEquilateralTriangle(uv * 10., 1.);
    uv.x *= 0.9;
    // uv *= 0.5; uv.x -= 0.35;
    uv.x = abs(uv.x);
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    iris = smoothstep(0.4, 0.5, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.+time*0.5)+time*1.)*0.5+0.5) * 0.5;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 8.);
    iris2 = smoothstep(0.35, 0.65, iris2);     
    float iris3 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.);
    iris3 = smoothstep(0., 1., iris3) * 0.35;
    col = col - iris - iris2 - iris3;
    // col = iris;
    col = smoothstep(0., 1., col);
    if (col < 0.01) {
        discard;
    }
    float noise = rand(uv + sin(time)) * 0.075;
    float br = pow(col, 4.) * 0.2;
    gl_FragColor = vec4(vec3(1.0, br, br), col - noise);
}
// endGLSL
`);

// The Curse of the Eye, Outward
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
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
    uv.x *= ratio;
    float col = 0.0;
    // col += sdEquilateralTriangle(uv * 40., 4.);
    // col += sdEquilateralTriangle(uv * 10., 1.);
    uv.x *= 0.9;
    // uv *= 0.5; uv.x -= 0.35;
    uv.x = abs(uv.x);
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    iris = smoothstep(0.4, 0.5, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.-time*0.5)-time*1.)*0.5+0.5) * 0.5;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 8.);
    iris2 = smoothstep(0.35, 0.65, iris2);     
    float iris3 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.);
    iris3 = smoothstep(0., 1., iris3) * 0.35;
    col = col - iris - iris2 - iris3;
    // col = iris;
    col = smoothstep(0., 1., col);
    if (col < 0.01) {
        discard;
    }
    float noise = rand(uv + sin(time)) * 0.075;
    float br = pow(col, 4.) * 0.2;
    gl_FragColor = vec4(vec3(1.0, br, br), col - noise);
}
// endGLSL
`);

// The Curse of the Eye, veins
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
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
    uv.x *= ratio;
    float col = 0.0;
    // col += sdEquilateralTriangle(uv * 40., 4.);
    // col += sdEquilateralTriangle(uv * 10., 1.);
    uv.x *= 0.9;
    // uv *= 0.5; uv.x -= 0.35;
    uv.x = abs(uv.x);
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    // iris = smoothstep(0.4, 0.5, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.-time*0.5)-time*1.)*0.5+0.5) * 0.5;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 8.);
    iris2 = smoothstep(0.35, 0.65, iris2);     
    float iris3 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.);
    iris3 = smoothstep(0., 1., iris3) * 0.65;
    col = col - iris - iris2 - iris3;
    // col += iris3 - (iris3 * col);
    // col = iris;
    col = smoothstep(0., 1., col);
    if (col < 0.01) {
        discard;
    }
    float noise = rand(uv + sin(time)) * 0.075;
    float br = pow(col, 4.) * 0.2;
    gl_FragColor = vec4(vec3(1.0, br, br), col - noise);
}
// endGLSL
`);

// The Curse of the Eye, veins 2
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
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
    uv.x *= ratio;
    float col = 0.0;
    // col += sdEquilateralTriangle(uv * 40., 4.);
    // col += sdEquilateralTriangle(uv * 10., 1.);
    uv.x *= 0.9;
    // uv *= 0.5; uv.x -= 0.35;
    uv.x = abs(uv.x);
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    // iris = smoothstep(0.4, 0.5, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.-time*0.5)-time*1.)*0.5+0.5) * 0.5;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 8.);
    iris2 = smoothstep(0.35, 0.65, iris2);     
    float iris3 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.);
    iris3 = smoothstep(0., 1., iris3) * 0.65;
    // float tri = sdEquilateralTriangle(uv * 20. + vec2(-3.5, 4.0), 1.5);
    // tri = 1.0 - smoothstep(0., 1., tri);
    col = max(pow(col, 4.), col + iris * 2.);
    col = col - iris - iris2 - iris3;
    // col += iris3 - (iris3 * col);
    
    // col = iris;
    col = smoothstep(0., 1., col);
    if (col < 0.01) {
        discard;
    }
    float noise = rand(uv + sin(time)) * 0.075;
    float br = pow(col, 4.) * 0.2;
    gl_FragColor = vec4(vec3(1.0, br, br), col - noise);
}
// endGLSL
`);

// The Curse of the Eye, veins
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
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
    uv.x *= ratio;
    float col = 0.0;
    // col += sdEquilateralTriangle(uv * 40., 4.);
    // col += sdEquilateralTriangle(uv * 10., 1.);
    uv.x *= 0.9;
    // uv *= 0.5; uv.x -= 0.35;
    uv.x = abs(uv.x);
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    // iris = smoothstep(0.4, 0.5, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.-time*0.5)-time*1.)*0.5+0.5) * 0.5;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 8.);
    iris2 = smoothstep(0.35, 0.65, iris2);     
    float iris3 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.);
    iris3 = smoothstep(0., 1., iris3) * 0.65;
    // float tri = sdEquilateralTriangle(uv * 20. + vec2(-3.5, 4.0), 1.5);
    // tri = 1.0 - smoothstep(0., 1., tri);
    col = max(pow(col, 4.), col + iris * 2.);
    col = col - iris - iris2 - iris3 * 1.25;
    // col += iris3 - (iris3 * col);
    
    // col = iris;
    col = smoothstep(0., 1., col);
    if (col < 0.01) {
        discard;
    }
    float noise = rand(uv + sin(time)) * 0.075;
    float br = pow(col, 4.) * 0.2;
    gl_FragColor = vec4(vec3(1.0, br, br), col - noise);
}
// endGLSL
`);

// The Curse of the Eye, veins
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
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
    uv.x *= ratio;
    float col = 0.0;
    // col += sdEquilateralTriangle(uv * 40., 4.);
    // col += sdEquilateralTriangle(uv * 10., 1.);
    uv.x *= 0.9;
    uv *= 0.5; uv.x -= 0.35;
    uv.x = abs(uv.x);
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    // iris = smoothstep(0.4, 0.5, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.-time*0.5)-time*1.)*0.5+0.5) * 0.5;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 8.);
    iris2 = smoothstep(0.35, 0.65, iris2);     
    float iris3 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.);
    iris3 = smoothstep(0., 1., iris3) * 0.65;
    // float tri = sdEquilateralTriangle(uv * 20. + vec2(-3.5, 4.0), 1.5);
    // tri = 1.0 - smoothstep(0., 1., tri);
    col = max(pow(col, 4.), col + iris * 2.);
    col = col - iris - iris2 - iris3 * 1.25;
    // col += iris3 - (iris3 * col);
    
    // col = iris;
    col = smoothstep(0., 1., col);
    if (col < 0.01) {
        discard;
    }
    float noise = rand(uv + sin(time)) * 0.075;
    float br = pow(col, 4.) * 0.2;
    gl_FragColor = vec4(vec3(1.0, br, br).gbr, col - noise);
}
// endGLSL
`);

// Leaf
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
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
    uv.x *= ratio;
    float col = 0.0;
    // col += sdEquilateralTriangle(uv * 40., 4.);
    // col += sdEquilateralTriangle(uv * 10., 1.);
    // uv.x *= 0.9;
    // uv *= 2.;
    // uv *= 0.5; uv.x -= 0.35;
    // uv.x = abs(uv.x);
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.05);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.05);
    uv.x += map(cos(uv.y*1e1+time*0.75), -1., 1., 0., 0.01);
    col += sdOrientedVesica(uv * 10., vec2(0., -2.), vec2(0., 2.), 0.5);
    col = 1.0 - pow(col, 8.);
    col = smoothstep(0., 1., col);
    float midrib = 1.0 - abs((uv.x - 0.) * -1.);
    // midrib = pow(midrib, 2.);
    float veins = sin((abs(uv.x)+(pow(uv.x, 5.)*500.)-uv.y*1.)*120.);
    midrib = pow(midrib, 3.);
    midrib = max(midrib, veins);
    col = col * midrib;
    if (col < 0.01) {
        discard;
    }
    float noise = rand(uv + sin(time)) * 0.075;
    float br = pow(col, 4.) * 0.2;
    gl_FragColor = vec4(vec3(br, 1.0, br).brg * 0.75, col - noise);
}
// endGLSL
`);

// Eyes Within Eyes
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float eye (vec2 uv) {
    float col = 0.0;
    uv.x *= 0.9;
    uv *= 0.5; 
    uv.x += 0.35;
    // uv.x = abs(uv.x);
    // uv *= 1.2;
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    // iris = smoothstep(0.4, 0.5, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.-time*0.5)+time*1.)*0.5+0.5) * 0.5;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 8.);
    iris2 = smoothstep(0.35, 0.65, iris2);     
    float iris3 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.);
    iris3 = smoothstep(0., 1., iris3) * 0.65;
    // float tri = sdEquilateralTriangle(uv * 20. + vec2(-3.5, 4.0), 1.5);
    // tri = 1.0 - smoothstep(0., 1., tri);
    col = max(pow(col, 4.), col + iris * 2.);
    col = col - iris - iris2 - iris3 * 1.25;
    // col += iris3 - (iris3 * col);
    // col = iris;
    col = smoothstep(0., 1., col);
    return col;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    vec2 ov = uv;
    uv *= map(fract(time * 1e-2), 0., 1., 2., 0.0001);
    float fade = min(map(fract(time * 1e-2), 0., 1., -6.5, 15.), 1.);
    uv.x *= ratio;
    float col = eye(uv);
    ov *= map(fract(time * 1e-2 +0.5), 0., 1., 2., 0.0001);
    float fade2 = min(map(fract(time * 1e-2 +0.5), 0., 1., -6.5, 15.), 1.);
    fade = max(0., fade);
    fade2 = max(0., fade2);
    ov.x *= ratio;
    float col2 = eye(ov);
    col = col * fade + col2 * fade2;
    if (col < 0.01) {
        discard;
    }
    float br = pow(col, 4.) * 0.2;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(1.0, br, br), col - noise);
}
// endGLSL
`);

// Eyes Within Eyes
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float eye (vec2 uv) {
    float col = 0.0;
    uv.x *= 0.9;
    uv *= 0.5; 
    uv.x += 0.35;
    // uv.x = abs(uv.x);
    // uv *= 1.2;
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    // iris = smoothstep(0.4, 0.5, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.-time*0.5)+time*1.)*0.5+0.5) * 0.5;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 8.);
    iris2 = smoothstep(0.35, 0.65, iris2);     
    float iris3 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.);
    iris3 = smoothstep(0., 1., iris3) * 0.65;
    // float tri = sdEquilateralTriangle(uv * 20. + vec2(-3.5, 4.0), 1.5);
    // tri = 1.0 - smoothstep(0., 1., tri);
    col = max(pow(col, 4.), col + iris * 2.);
    col = col - iris - iris2 - iris3 * 1.25;
    // col += iris3 - (iris3 * col);
    // col = iris;
    col = smoothstep(0., 1., col);
    return col;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    vec2 ov = uv;
    uv *= map(fract(time * 1e-2), 0., 1., 2., 0.0001);
    float fade = min(map(fract(time * 1e-2), 0., 1., -3.5, 9.), 1.);
    uv.x *= ratio;
    float col = eye(uv);
    ov *= map(fract(time * 1e-2 +0.5), 0., 1., 2., 0.0001);
    float fade2 = min(map(fract(time * 1e-2 +0.5), 0., 1., -3.5, 9.), 1.);
    fade = max(0., fade);
    // fade = smoothstep(0., 1., fade);
    fade2 = max(0., fade2);
    // fade = smoothstep(0., 1., fade);
    ov.x *= ratio;
    float col2 = eye(ov);
    col = max(col * fade, col2 * fade2);
    if (col < 0.01) {
        discard;
    }
    float br = pow(col, 4.) * 0.2;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(1.0, br, br), col - noise);
}
// endGLSL
`);

// Eyes Within Eyes, rotating
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float eye (vec2 uv) {
    float col = 0.0;
    uv.x *= 0.9;
    uv *= 0.5; 
    uv.x += 0.35;
    // uv.x = abs(uv.x);
    // uv *= 1.2;
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    // iris = smoothstep(0.4, 0.5, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.-time*0.5)+time*1.)*0.5+0.5) * 0.5;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 8.);
    iris2 = smoothstep(0.35, 0.65, iris2);     
    float iris3 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.);
    iris3 = smoothstep(0., 1., iris3) * 0.65;
    // float tri = sdEquilateralTriangle(uv * 20. + vec2(-3.5, 4.0), 1.5);
    // tri = 1.0 - smoothstep(0., 1., tri);
    col = max(pow(col, 4.), col + iris * 2.);
    col = col - iris - iris2 - iris3 * 1.25;
    // col += iris3 - (iris3 * col);
    // col = iris;
    col = smoothstep(0., 1., col);
    return col;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    uv.x *= ratio;
    vec2 ov = uv;
    float ro1 = map(fract(time * 1e-2), 0., 1., pi * 0.42, pi * -1.);
    float ro2 = map(fract(time * 1e-2 + 0.5), 0., 1., pi * 0.42, pi * -1.);
    uv = rotateUV(uv, ro1, 0.);
    ov = rotateUV(ov, ro2, 0.);
    uv *= map(fract(time * 1e-2), 0., 1., 2., 0.0001);
    float fade = min(map(fract(time * 1e-2), 0., 1., -3.5, 9.), 1.);
    fade = max(0., fade);
    float col = eye(uv);
    ov *= map(fract(time * 1e-2 +0.5), 0., 1., 2., 0.0001);
    float fade2 = min(map(fract(time * 1e-2 +0.5), 0., 1., -3.5, 9.), 1.);
    fade2 = max(0., fade2);
    float col2 = eye(ov);
    // fade = smoothstep(0., 1., fade);
    // fade = smoothstep(0., 1., fade);
    col = max(col * fade, col2 * fade2);
    if (col < 0.01) {
        discard;
    }
    float br = pow(col, 4.) * 0.2;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(1.0, br, br), col - noise);
}
// endGLSL
`);

// Eyes Within Eyes, alternating colors
setBothShaders(`
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
    varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float sdEquilateralTriangle(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
float sdOrientedVesica( vec2 p, vec2 a, vec2 b, float w ) {
    float r = 0.5*length(b-a);
    float d = 0.5*(r*r-w*w)/w;
    vec2 v = (b-a)/r;
    vec2 c = (b+a)*0.5;
    vec2 q = 0.5*abs(mat2(v.y,v.x,-v.x,v.y)*(p-c));
    vec3 h = (r*q.x<d*(q.y-r)) ? vec3(0.0,r,0.0) : vec3(-d,0.0,d+w);
    return length( q-h.xy) - h.z;
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
}
float eye (vec2 uv) {
    float col = 0.0;
    uv.x *= 0.9;
    uv *= 0.5; 
    uv.x += 0.35;
    // uv.x = abs(uv.x);
    // uv *= 1.2;
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    // iris = smoothstep(0.4, 0.5, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.-time*0.5)+time*1.)*0.5+0.5) * 0.5;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 8.);
    iris2 = smoothstep(0.35, 0.65, iris2);     
    float iris3 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 4.);
    iris3 = smoothstep(0., 1., iris3) * 0.65;
    // float tri = sdEquilateralTriangle(uv * 20. + vec2(-3.5, 4.0), 1.5);
    // tri = 1.0 - smoothstep(0., 1., tri);
    col = max(pow(col, 4.), col + iris * 2.);
    col = col - iris - iris2 - iris3 * 1.25;
    // col += iris3 - (iris3 * col);
    // col = iris;
    col = smoothstep(0., 1., col);
    return col;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;
    vec2 ov = uv;
    uv *= map(fract(time * 1e-2), 0., 1., 2., 0.0001);
    float fade = min(map(fract(time * 1e-2), 0., 1., -3.5, 9.), 1.);
    uv.x *= ratio;
    float col = eye(uv);
    ov *= map(fract(time * 1e-2 +0.5), 0., 1., 2., 0.0001);
    float fade2 = min(map(fract(time * 1e-2 +0.5), 0., 1., -3.5, 9.), 1.);
    fade = max(0., fade);
    // fade = smoothstep(0., 1., fade);
    fade2 = max(0., fade2);
    // fade = smoothstep(0., 1., fade);
    ov.x *= ratio;
    float col2 = eye(ov);
    float br = pow(col, 4.) * 0.2;
    float br2 = pow(col2, 4.) * 0.2;
    vec3 cols = vec3(1.0, br, br) * col * fade;
    vec3 cols2 = vec3(1.0, br2, br2).gbr * col2 * fade2;
    // col = max(col * fade, col2 * fade2);
    cols = max(cols, cols2);
    if (cols.r < 0.01 && cols.b < 0.01) {
        discard;
    }
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(cols, 1. - noise);
}
// endGLSL
`);

// Recursive eyes
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
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float eye(vec2 uv, float scale) {
    uv *= scale;
    uv.y = uv.y + (0.28 * sign(uv.y));
    float col = 1.0 - length(uv) * 2.;
    col = abs(col) * -1.+ 0.5;
    // col = smoothstep(0., 1., col);
    // col = abs(col - 0.5) + 1.;
    // col = pow(col * 3.2, 6.);
    // col = 1.0 - smoothstep(0., 1., col);
    col = smoothstep(0., 1., col);
    col = pow(col * 1.75, 4.) + col;
    // col = max(col, max(smoothstep(0., 1., col) * 0.9, (pow(col, 18.) * 1.)));
    return col;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 ov = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;    
    uv.x *= ratio;    
    ov -= 0.5;    
    ov.x *= ratio;
    float scale = fract(time * 2e-2);
    scale = exp2(floor(scale)) / exp2(scale);
    scale *= scale;
    uv *= scale;
    uv = rotateUV(uv, -time * 2e-2, 0.);
    // float fluc = sin(length(uv)*10.-time*1e-1)*0.5+0.5;
    vec3 col = vec3(0.0);
    for (int i = 0; i < 14; i++) {
        // float sc = pow(2., float(i)) * 0.25;
        float sc = exp2(float(i)) * 0.0625;
        // sc = mod(sc-time*1e-1, pow(2., float(i))*0.25);
        // sc = smoothstep(0., 1., sc);
        float fade = min(map(sc, pow(2., 10.)*0.25*2., 1., 0., 1.), 1.0);
        // fade = min(map(sc * scale, 30., 20., 0., 1.), 1.0);
        vec2 uvs = (mod(float(i), 2.) == 0.) ? uv : uv.yx;
        // uvs = rotateUV(uvs, -time * 1e-2 + float(i), 0.);
        vec3 e = vec3(eye(uvs, sc));
        // float br = pow(e.r, 1.) * 0.0;
        vec3 color = (mod(float(i), 2.) == 0.) ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0);
        e *= color;
        // float fluc = fract(time * 2e-2) * pi * 2.;
        // fluc = sin(fluc) * 0.5 + 0.5;
        
        // e -= fluc - (fluc * e);
        // float fluc = sin(time*2e-2/4.+float(i))*0.5+0.5;
        // e *= fluc;
        col = max(col, e);
    }
    // float col = eye(uv, 2.);
    // float col2 = eye(uv.yx, 4.);
    // float col3 = eye(uv, 8.);
    // col = max(col, col2);
    // col = max(col, col3);
    // col *= fluc;
    col = mix(col, vec3(pow(col.r, 7.), pow(col.g, 7.), pow(col.b, 7.)), sin(length(ov)*10.-time*32e-2)*0.5+0.5);
    // col *= map(sin(atan(ov.y, ov.x)*10.+time), -1., 1., 0.75, 1.);
    // col = pow(col * 1.75, 4.) + col;
    // col = smoothstep(0., 1., col) * 0.4 + (pow(col, 4.) * 0.6);
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(col, 1.0 - noise);
}
// endGLSL
`);

// Recursive eyes 2
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
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float eye(vec2 uv, float scale) {
    uv *= scale;
    uv.y = uv.y + (0.295 * sign(uv.y));
    float col = 1.0 - length(uv) * 2.;
    col = abs(col) * -1.+ 0.42;
    // col = pow(col, 1.);
    // col = smoothstep(0., 1., col);
    // col = abs(col - 0.5) + 1.;
    // col = pow(col * 3.2, 6.);
    // col = 1.0 - smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    // col = pow(col * 1.75, 2.) + col;
    // col = smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    // col = max(col, max(smoothstep(0., 1., col) * 0.9, (pow(col, 18.) * 1.)));
    return col;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 ov = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    uv -= 0.5;    
    uv.x *= ratio;    
    ov -= 0.5;    
    ov.x *= ratio;
    float scale = fract(time * 2e-2);
    scale = exp2(floor(scale)) / exp2(scale);
    scale *= scale;
    uv *= scale;
    uv = rotateUV(uv, -time * 2e-2, 0.);
    // float fluc = sin(length(uv)*10.-time*1e-1)*0.5+0.5;
    vec3 col = vec3(0.0);
    for (int i = 0; i < 14; i++) {
        // float sc = pow(2., float(i)) * 0.25;
        float sc = exp2(float(i)) * 0.0625;
        // sc = mod(sc-time*1e-1, pow(2., float(i))*0.25);
        // sc = smoothstep(0., 1., sc);
        float fade = min(map(sc, pow(2., 10.)*0.25*2., 1., 0., 1.), 1.0);
        // fade = min(map(sc * scale, 30., 20., 0., 1.), 1.0);
        vec2 uvs = (mod(float(i), 2.) == 0.) ? uv : uv.yx;
        // uvs = rotateUV(uvs, -time * 1e-2 + float(i), 0.);
        vec3 e = vec3(eye(uvs, sc));
        // float br = pow(e.r, 1.) * 0.0;
        vec3 color = (mod(float(i), 2.) == 0.) ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0);
        e *= color;
        // float fluc = fract(time * 2e-2) * pi * 2.;
        // fluc = sin(fluc) * 0.5 + 0.5;
        
        // e -= fluc - (fluc * e);
        // float fluc = sin(time*2e-2/4.+float(i))*0.5+0.5;
        // e *= fluc;
        col = max(col, e);
    }
    col = smoothstep(0., 1., col);
    col = vec3(pow(col.r * 1.75, 2.), pow(col.g * 1.75, 2.), pow(col.b * 1.75, 2.)) + col;
    col = smoothstep(0., 1., col);
    // float col = eye(uv, 2.);
    // float col2 = eye(uv.yx, 4.);
    // float col3 = eye(uv, 8.);
    // col = max(col, col2);
    // col = max(col, col3);
    // col *= fluc;
    col = mix(col, vec3(pow(col.r, 7.), pow(col.g, 7.), pow(col.b, 7.)), (sin(length(ov)*10.-time*32e-2)*0.5+0.5));
    // col *= map(sin(atan(ov.y, ov.x)*10.+time), -1., 1., 0.75, 1.);
    // col = pow(col * 1.75, 4.) + col;
    if (col.r < 0.01 && col.b < 0.01) {
        discard;
    }
    // col = smoothstep(0., 1., col) * 0.4 + (pow(col, 4.) * 0.6);
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(col, 1.0 - noise);
}
// endGLSL
`);

// Recursive eyes 2, spooky fast
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
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float eye(vec2 uv, float scale, float w) {
    uv *= scale;
    uv.y = uv.y + (0.295 * sign(uv.y));
    float col = 1.0 - length(uv) * 2.;
    col = abs(col) * -1.+ w;
    // col = pow(col, 1.);
    // col = smoothstep(0., 1., col);
    // col = abs(col - 0.5) + 1.;
    // col = pow(col * 3.2, 6.);
    // col = 1.0 - smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    // col = pow(col * 1.75, 2.) + col;
    // col = smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    // col = max(col, max(smoothstep(0., 1., col) * 0.9, (pow(col, 18.) * 1.)));
    return col;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 ov = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    float spookSpeed = 2.;
    uv -= 0.5;    
    uv.x *= ratio;    
    ov -= 0.5;    
    ov.x *= ratio;
    float scale = fract(time * 2e-2*spookSpeed);
    scale = exp2(floor(scale)) / exp2(scale);
    scale *= scale;
    uv *= scale;
    uv = rotateUV(uv, -time * 2e-2*spookSpeed, 0.);
    // float fluc = sin(length(uv)*10.-time*1e-1)*0.5+0.5;
    vec3 col = vec3(0.0);
    for (int i = 0; i < 14; i++) {
        // float sc = pow(2., float(i)) * 0.25;
        float sc = exp2(float(i)) * 0.0625;
        // sc = mod(sc-time*1e-1, pow(2., float(i))*0.25);
        // sc = smoothstep(0., 1., sc);
        float fade = min(map(sc, pow(2., 10.)*0.25*2., 1., 0., 1.), 1.0);
        // fade = min(map(sc * scale, 30., 20., 0., 1.), 1.0);
        vec2 uvs = (mod(float(i), 2.) == 0.) ? uv : uv.yx;
        // uvs = rotateUV(uvs, -time * 1e-2 + float(i), 0.);
        vec3 e = vec3(eye(uvs, sc, 0.42));
        // vec3 e2 = vec3(eye(uvs, sc, 0.5));
        // float br = pow(e.r, 1.) * 0.0;
        vec3 color = (mod(float(i), 2.) == 0.) ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0);
        e *= color;
        // e2 *= color;
        // float fluc = fract(time * 2e-2) * pi * 2.;
        // fluc = sin(fluc) * 0.5 + 0.5;
        
        // e -= fluc - (fluc * e);
        // float fluc = sin(time*2e-2/4.+float(i))*0.5+0.5;
        // e *= fluc;
        col = max(col, e);
        // col = col + max(0., e2 * 0.5);
    }
    col = smoothstep(0., 1., col);
    col = vec3(pow(col.r * 1.75, 2.), pow(col.g * 1.75, 2.), pow(col.b * 1.75, 2.)) + col;
    col = smoothstep(0., 1., col);
    // float col = eye(uv, 2.);
    // float col2 = eye(uv.yx, 4.);
    // float col3 = eye(uv, 8.);
    // col = max(col, col2);
    // col = max(col, col3);
    // col *= fluc;
    col = mix(col, vec3(pow(col.r, 7.), pow(col.g, 7.), pow(col.b, 7.)), (sin(length(ov)*10.-time*32e-2*spookSpeed)*0.5+0.5));
    // col *= map(sin(atan(ov.y, ov.x)*10.+time), -1., 1., 0.75, 1.);
    // col = pow(col * 1.75, 4.) + col;
    col = smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    if (col.r < 0.01 && col.b < 0.01) {
        discard;
    }
    // col = smoothstep(0., 1., col) * 0.4 + (pow(col, 4.) * 0.6);
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(col, 1.0 - noise);
}
// endGLSL
`);

// Recursive eyes 2, vesica version, spooky fast
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
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float eye(vec2 uv, float scale, float w) {
    uv *= scale;
    uv.y = uv.y + (0.295 * sign(uv.y));
    float col = 1.0 - length(uv) * 2.;
    col = abs(col) * -1.+ w;
    // col = pow(col, 1.);
    // col = smoothstep(0., 1., col);
    // col = abs(col - 0.5) + 1.;
    // col = pow(col * 3.2, 6.);
    // col = 1.0 - smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    // col = pow(col * 1.75, 2.) + col;
    // col = smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    // col = max(col, max(smoothstep(0., 1., col) * 0.9, (pow(col, 18.) * 1.)));
    return col;
}
float sdVesica(vec2 p, float r, float d)
{
    p = abs(p);
    float b = sqrt(r*r-d*d);
    return ((p.y-b)*d>p.x*b) ? length(p-vec2(0.0,b))
                             : length(p-vec2(-d,0.0))-r;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 ov = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    float spookSpeed = 2.;
    uv -= 0.5;    
    uv.x *= ratio;    
    ov -= 0.5;    
    ov.x *= ratio;
    float scale = fract(time * 2e-2*spookSpeed);
    scale = exp2(floor(scale)) / exp2(scale);
    scale *= scale;
    uv *= scale;
    uv = rotateUV(uv, -time * 2e-2*spookSpeed, 0.);
    // float fluc = sin(length(uv)*10.-time*1e-1)*0.5+0.5;
    vec3 col = vec3(0.0);
    for (int i = 0; i < 14; i++) {
        // float sc = pow(2., float(i)) * 0.25;
        float sc = exp2(float(i)) * 0.0625;
        // sc = mod(sc-time*1e-1, pow(2., float(i))*0.25);
        // sc = smoothstep(0., 1., sc);
        float fade = min(map(sc, pow(2., 10.)*0.25*2., 1., 0., 1.), 1.0);
        // fade = min(map(sc * scale, 30., 20., 0., 1.), 1.0);
        vec2 uvs = (mod(float(i), 2.) == 0.) ? uv : uv.yx;
        // uvs = rotateUV(uvs, -time * 1e-2 + float(i), 0.);
        float e = eye(uvs, sc, 0.42);
        e = sdVesica(uvs * sc * vec2(1.3, 1.), 2., 1.);
        float e2 = e;
        float e3 = e;
        e = abs(e - 0.5) * -1. + 0.5;
        e2 = abs(e2 - 0.5) * -1. + 0.95;
        e3 = abs(e3 - 0.5) * -1. + 1.;
        // e = 
        // e = pow(max(0., e), 1.5);
        e = max(e, e2 * 0.5);
        e += e3 * 0.025;
        // vec3 e2 = vec3(eye(uvs, sc, 0.5));
        // float br = pow(e.r, 1.) * 0.0;
        vec3 color = (mod(float(i), 2.) == 0.) ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0);
        // e *= color;
        // e2 *= color;
        // float fluc = fract(time * 2e-2) * pi * 2.;
        // fluc = sin(fluc) * 0.5 + 0.5;
        
        // e -= fluc - (fluc * e);
        // float fluc = sin(time*2e-2/4.+float(i))*0.5+0.5;
        // e *= fluc;
        col = max(col, vec3(e)*color);
        // col = col + max(0., e2 * 0.5);
    }
    col = smoothstep(0., 1., col);
    col = vec3(pow(col.r * 2., 1.), pow(col.g * 2., 1.), pow(col.b * 2., 1.));
    col = smoothstep(0., 1., col);
    // float col = eye(uv, 2.);
    // float col2 = eye(uv.yx, 4.);
    // float col3 = eye(uv, 8.);
    // col = max(col, col2);
    // col = max(col, col3);
    // col *= fluc;
    col = mix(col, vec3(pow(col.r, 7.), pow(col.g, 7.), pow(col.b, 7.)), (sin(length(ov)*10.-time*32e-2*spookSpeed)*0.5+0.5));
    // col *= map(sin(atan(ov.y, ov.x)*10.+time), -1., 1., 0.75, 1.);
    // col = pow(col * 1.75, 4.) + col;
    // col = smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    if (col.r < 0.01 && col.b < 0.01) {
        discard;
    }
    // col = smoothstep(0., 1., col) * 0.4 + (pow(col, 4.) * 0.6);
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(col, 1.0 - noise);
}
// endGLSL
`);

// Simple triangle
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
    uv *= 5.;
    uv.x *= ratio;
    vec2 v1 = vec2(1.4,1.0)*cos(time * 1e-2 + vec2(0.0,2.00) + 0.0 );
    vec2 v2 = vec2(1.4,1.0)*cos(time * 1e-2 + vec2(0.0,1.50) + 1.5 );
    vec2 v3 = vec2(1.4,1.0)*cos(time * 1e-2 + vec2(0.0,3.00) + 4.0 );
    float tri = 1.0 - sdTriangle(uv, v1, v2, v3);
    // tri = abs(tri - 0.99) * -1. + 0.5;
    // tri = smoothstep(0.95, 1., tri) + smoothstep(0.5, 1., tri) * 0.5;
    tri = smoothstep(0.7, 1., tri);
    // tri = smoothstep(0., 1., tri);
    // uv -= 0.5;
    // uv.x *= ratio;
    float noise = rand(uv + sin(time)) * 0.075;
    gl_FragColor = vec4(vec3(tri, 0.0, 0.0), 1. - noise);
}
// endGLSL
`);

// Recursive eyes 2, vesica version, spooky fast
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
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float eye(vec2 uv, float scale, float w) {
    uv *= scale;
    uv.y = uv.y + (0.295 * sign(uv.y));
    float col = 1.0 - length(uv) * 2.;
    col = abs(col) * -1.+ w;
    // col = pow(col, 1.);
    // col = smoothstep(0., 1., col);
    // col = abs(col - 0.5) + 1.;
    // col = pow(col * 3.2, 6.);
    // col = 1.0 - smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    // col = pow(col * 1.75, 2.) + col;
    // col = smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    // col = max(col, max(smoothstep(0., 1., col) * 0.9, (pow(col, 18.) * 1.)));
    return col;
}
float sdVesica(vec2 p, float r, float d)
{
    p = abs(p);
    float b = sqrt(r*r-d*d);
    return ((p.y-b)*d>p.x*b) ? length(p-vec2(0.0,b))
                             : length(p-vec2(-d,0.0))-r;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 ov = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    float spookSpeed = 2.;
    uv -= 0.5;    
    uv.x *= ratio;    
    ov -= 0.5;    
    ov.x *= ratio;
    float scale = fract(time * 2e-2*spookSpeed);
    scale = exp2(floor(scale)) / exp2(scale);
    scale *= scale;
    uv *= scale;
    uv = rotateUV(uv, -time * 2e-2*spookSpeed, 0.);
    // float fluc = sin(length(uv)*10.-time*1e-1)*0.5+0.5;
    vec3 col = vec3(0.0);
    for (int i = 0; i < 12; i++) {
        // float sc = pow(2., float(i)) * 0.25;
        float sc = exp2(float(i)) * 1.;
        // sc = mod(sc-time*1e-1, pow(2., float(i))*0.25);
        // sc = smoothstep(0., 1., sc);
        float fade = min(map(sc, pow(2., 10.)*0.5, 1., 0.8, 1.0), 1.0);
        // fade = min(map(sc * scale, 30., 20., 0., 1.), 1.0);
        vec2 uvs = (mod(float(i), 2.) == 0.) ? uv : uv.yx;
        // uvs = rotateUV(uvs, -time * 1e-2 + float(i), 0.);
        float e = eye(uvs, sc, 0.42);
        e = sdVesica(uvs * sc * vec2(1.3, 1.), 2., 1.);
        float e2 = e;
        float e3 = e;
        e = abs(e - 0.5) * -1. + 0.5;
        e2 = abs(e2 - 0.5) * -1. + 0.95;
        e3 = abs(e3 - 0.5) * -1. + 1.;
        // e = 
        // e = pow(max(0., e), 1.5);
        e = max(e, e2 * 0.5);
        e += e3 * 0.025;
        // vec3 e2 = vec3(eye(uvs, sc, 0.5));
        // float br = pow(e.r, 1.) * 0.0;
        vec3 color;
        if (sin(time) > 0.0) {
            color = (mod(float(i), 2.) == 0.) ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0);
        } else {
            color = (mod(float(i), 2.) == 0.) ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
        }
        // e *= color;
        // e2 *= color;
        // float fluc = fract(time * 2e-2) * pi * 2.;
        // fluc = sin(fluc) * 0.5 + 0.5;
        
        // e -= fluc - (fluc * e);
        // float fluc = sin(time*2e-2/4.+float(i))*0.5+0.5;
        // e *= fluc;
        // col = col * fade;
        col = max(col, vec3(e)*color);
        // col = col + max(0., e2 * 0.5);
    }
    col = smoothstep(0., 1., col);
    // col = vec3(pow(col.r * 2., 1.), pow(col.g * 2., 1.), pow(col.b * 2., 1.));
    col *= 2.0;
    col = smoothstep(0., 1., col);
    // float col = eye(uv, 2.);
    // float col2 = eye(uv.yx, 4.);
    // float col3 = eye(uv, 8.);
    // col = max(col, col2);
    // col = max(col, col3);
    // col *= fluc;
    col = mix(col, vec3(pow(col.r, 7.), pow(col.g, 7.), pow(col.b, 7.)), (sin(length(ov)*10.-time*32e-2*spookSpeed)*0.5+0.5));
    // col *= map(sin(atan(ov.y, ov.x)*10.+time), -1., 1., 0.75, 1.);
    // col *= (sin(length(ov)*10.-time*1.)*0.5+0.5);
    // col = pow(col * 1.75, 4.) + col;
    // col = smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    // col = 0.2 - exp( -col  * 3. );
    float vig = 1.0 - length(ov) * 1.25;
    vig = smoothstep(0., 1., vig);
    col *= vig;
    if (col.r < 0.01 && col.b < 0.01) {
        discard;
    }
    // col = smoothstep(0., 1., col) * 0.4 + (pow(col, 4.) * 0.6);
    float noise = rand(uv + sin(time)) * 0.1;
    gl_FragColor = vec4(col, 1.0 - noise);
}
// endGLSL
`);

// Recursive eyes 2, vesica version, spooky fast
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
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float eye(vec2 uv, float scale, float w) {
    uv *= scale;
    uv.y = uv.y + (0.295 * sign(uv.y));
    float col = 1.0 - length(uv) * 2.;
    col = abs(col) * -1.+ w;
    // col = pow(col, 1.);
    // col = smoothstep(0., 1., col);
    // col = abs(col - 0.5) + 1.;
    // col = pow(col * 3.2, 6.);
    // col = 1.0 - smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    // col = pow(col * 1.75, 2.) + col;
    // col = smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    // col = max(col, max(smoothstep(0., 1., col) * 0.9, (pow(col, 18.) * 1.)));
    return col;
}
float sdVesica(vec2 p, float r, float d)
{
    p = abs(p);
    float b = sqrt(r*r-d*d);
    return ((p.y-b)*d>p.x*b) ? length(p-vec2(0.0,b))
                             : length(p-vec2(-d,0.0))-r;
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 ov = gl_FragCoord.xy / resolution;
    float ratio = resolution.x / resolution.y;
    float spookSpeed = 1.;
    uv -= 0.5;    
    uv.x *= ratio;    
    ov -= 0.5;    
    ov.x *= ratio;
    float scale = fract(time * 2e-2*spookSpeed);
    scale = exp2(floor(scale)) / exp2(scale);
    scale *= scale;
    uv *= scale;
    uv = rotateUV(uv, -time * 2e-2*spookSpeed, 0.);
    // float fluc = sin(length(uv)*10.-time*1e-1)*0.5+0.5;
    vec3 col = vec3(0.0);
    for (int i = 0; i < 12; i++) {
        // float sc = pow(2., float(i)) * 0.25;
        float sc = exp2(float(i)) * 1.;
        // sc = mod(sc-time*1e-1, pow(2., float(i))*0.25);
        // sc = smoothstep(0., 1., sc);
        float fade = min(map(sc, pow(2., 10.)*0.5, 1., 0.8, 1.0), 1.0);
        // fade = min(map(sc * scale, 30., 20., 0., 1.), 1.0);
        vec2 uvs = (mod(float(i), 2.) == 0.) ? uv : uv.yx;
        // uvs = rotateUV(uvs, -time * 1e-2 + float(i), 0.);
        float e = eye(uvs, sc, 0.42);
        e = sdVesica(uvs * sc * vec2(1.3, 1.), 2., 1.);
        float e2 = e;
        float e3 = e;
        e = abs(e - 0.5) * -1. + 0.5;
        e2 = abs(e2 - 0.5) * -1. + 0.95;
        e3 = abs(e3 - 0.5) * -1. + 1.;
        // e = 
        // e = pow(max(0., e), 1.5);
        e = max(e, e2 * 0.5);
        e += e3 * 0.025;
        // vec3 e2 = vec3(eye(uvs, sc, 0.5));
        // float br = pow(e.r, 1.) * 0.0;
        vec3 color;
        // if (sin(time) > 0.0) {
            color = (mod(float(i), 2.) == 0.) ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0);
        // } else {
            color = (mod(float(i), 2.) == 0.) ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
        // }
        // e *= color;
        // e2 *= color;
        // float fluc = fract(time * 2e-2) * pi * 2.;
        // fluc = sin(fluc) * 0.5 + 0.5;
        
        // e -= fluc - (fluc * e);
        // float fluc = sin(time*2e-2/4.+float(i))*0.5+0.5;
        // e *= fluc;
        // col = col * fade;
        col = max(col, vec3(e)*color);
        // col = col + max(0., e2 * 0.5);
    }
    col = smoothstep(0., 1., col);
    // col = vec3(pow(col.r * 2., 1.), pow(col.g * 2., 1.), pow(col.b * 2., 1.));
    col *= 2.0;
    col = smoothstep(0., 1., col);
    // float col = eye(uv, 2.);
    // float col2 = eye(uv.yx, 4.);
    // float col3 = eye(uv, 8.);
    // col = max(col, col2);
    // col = max(col, col3);
    // col *= fluc;
    // col = mix(col, vec3(pow(col.r, 7.), pow(col.g, 7.), pow(col.b, 7.)), (sin(length(ov)*10.-time*32e-2*spookSpeed)*0.5+0.5));
    // col *= map(sin(atan(ov.y, ov.x)*10.+time), -1., 1., 0.75, 1.);
    // col *= (sin(length(ov)*10.-time*1.)*0.5+0.5);
    // col = pow(col * 1.75, 4.) + col;
    // col = smoothstep(0., 1., col);
    // col = smoothstep(0., 1., col);
    // col = 0.2 - exp( -col  * 3. );
    float vig = 1.0 - length(ov) * 1.25;
    vig = smoothstep(0., 1., vig);
    if (col.r < 0.01 && col.b < 0.01) {
        discard;
    }
    // col = smoothstep(0., 1., col) * 0.4 + (pow(col, 4.) * 0.6);
    float noise = rand(uv + sin(time)) * 0.1;
    vec3 colp = col;
        // colp = smoothstep(0., 1., colp) * 0.;
    colp = vec3(pow(colp.r, 5.), pow(colp.g, 5.), pow(colp.b, 5.));
    col = mix(col, vec3(1.0), (colp.r+colp.g+colp.b)/3.*0.7);
        col *= vig;
    gl_FragColor = vec4(col, 1.0 - noise);
}
// endGLSL
`);

}