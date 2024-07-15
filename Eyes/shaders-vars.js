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
    uv *= 0.5; uv.x -= 0.35;
    uv.x = abs(uv.x);
    uv.y *= map(sin(uv.x*1e1+time*0.75), -1., 1., 1., 1.1);
    uv.x *= map(sin(uv.y*1e1+time*0.75), -1., 1., 1., 1.01);
    col += sdOrientedVesica(uv * 7., vec2(0. + 1., 0.), vec2(3. + 1., 0.), 0.5);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 1.5);
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    iris = smoothstep(0.4, 0.5, iris);
    iris -= (sin(atan(uv2.y, uv2.x)*30.+sin(length(uv2*100.)*2.-time*0.5)-time*0.5)*0.5+0.5) * 0.5;
    iris -= (sin(atan(uv2.y, uv2.x)*5.+sin(length(uv2*100.)*2.-time*0.5)-time*0.5)*0.5+0.5) * 0.5;
    iris = smoothstep(0., 1., iris) * 0.5;
    float iris2 = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 6.);
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


// The simplest shader
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
    vec2 uv2 = uv - vec2(0.15 + 0.2, 0.0);
    uv *= vec2(
        (cos(atan(uv2.y, uv2.x)*3.+sin(length(uv2*100.)*2.-time*0.25)-time*0.25)*0.5+0.5)*0.1+0.9,
        (sin(atan(uv2.y, uv2.x)*3.+sin(length(uv2*100.)*2.-time*0.25)-time*0.25)*0.5+0.5)*0.1+0.9
    );
    col += sdOrientedVesica(uv * 10., vec2(0. + 2., 0.), vec2(3. + 2., 0.), 0.95);
    col = pow(col, 4.);
    col = 1.0 - smoothstep(0., 1., col);
    float iris = 1.0 - max(0., length(uv - vec2(0.15 + 0.2, 0.0)) * 3.5);
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



// The simplest shader
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
float dot2( vec2 v ) { return dot(v,v); }
float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C) {
    vec2 a = B - A;
    vec2 b = A - 2.0*B + C;
    vec2 c = a * 2.0;
    vec2 d = A - pos;
    float kk = 1.0/dot(b,b);
    float kx = kk * dot(a,b);
    float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;
    float kz = kk * dot(d,a);      
    float res = 0.0;
    float p = ky - kx*kx;
    float p3 = p*p*p;
    float q = kx*(2.0*kx*kx-3.0*ky) + kz;
    float h = q*q + 4.0*p3;
    if( h >= 0.0) {
        h = sqrt(h);
        vec2 x = (vec2(h,-h)-q)/2.0;
        vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
        float t = clamp( uv.x+uv.y-kx, 0.0, 1.0 );
        res = dot2(d + (c + b*t)*t);
    } else {
        float z = sqrt(-p);
        float v = acos( q/(p*z*2.0) ) / 3.0;
        float m = cos(v);
        float n = sin(v)*1.732050808;
        vec3  t = clamp(vec3(m+m,-n-m,n-m)*z-kx,0.0,1.0);
        res = min( dot2(d+(c+b*t.x)*t.x),
                   dot2(d+(c+b*t.y)*t.y) );
        // the third root cannot be the closest
        // res = min(res,dot2(d+(c+b*t.z)*t.z));
    }
    return sqrt( res );
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
    // float lash = sdBezier(uv * 64., vec2(5.0, 3.) * 8., vec2(5.0, 2.0) * 8. + sin(uv.x*50.)*3., vec2(1.) * 8.);
    // lash = 1.0 - smoothstep(0., 1., lash);
    // col = col + lash * 0.75;
    if (col < 0.01) {
        discard;
    }
    float noise = rand(uv + sin(time)) * 0.075;
    float br = pow(col, 4.) * 0.2;
    gl_FragColor = vec4(vec3(1.0, br, br), col - noise);
}
// endGLSL
`);