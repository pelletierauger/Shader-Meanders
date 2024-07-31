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
    float tri = sdEquilateralTriangle(uv * 20. + vec2(-3.5, 4.0), 1.5);
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
    float tri = sdEquilateralTriangle(uv * 20. + vec2(-3.5, 4.0), 1.5);
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
    float tri = sdEquilateralTriangle(uv * 20. + vec2(-3.5, 4.0), 1.5);
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
    float tri = sdEquilateralTriangle(uv * 20. + vec2(-3.5, 4.0), 1.5);
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

}