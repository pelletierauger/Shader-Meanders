if (false) {

// Blue night with a triangular mask
setBothShaders(`
    // beginGLSL
    precision mediump float;
    varying vec2 vTexCoord;
    uniform float time;
    uniform vec2 resolution;
    ${blendingMath}
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
        vec2 uv = gl_FragCoord.xy / resolution + vec2(0., -0.);
        vec2 ov = uv;
        // ov.y = ov.y * -1. + 1.;
        vec2 p0 = vec2(0.2, 0.05);
        vec2 p1 = vec2(0.5, 0.95);
        vec2 p2 = vec2(0.8, 0.05);
        float vig = smoothTriangle(ov, p0, p2, p1, 0.003);
        vig = smoothstep(0., 1., vig);
        if (vig < 0.1) {
            discard;
        }
        // uv -= 0.5;
        vec2 muv = uv;
        // uv.x += time * 1e-3;
        // muv.x += time * 3e-3;
        uv.x += 38687. * 1e-3;
        uv.y += 0.2;
        muv.x += 66187. * 3e-3;
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
        col = mix(col, colC, map(sin(uv.x*5.), -1., 1., 0.4, 1.));
        float interlace = 1.0 - (sin(uv.y * 1. + time * 0.25) * 0.5 + 0.5) * 1.;
        // col *= interlace;
        float bright = mix(1., 1.25, sin(uv.x*5.)*0.5+0.5);
        // bright = 1.0;
        vec3 col2 = vec3(65., 63., 92.) / 256.;
        
        vec3 col2B = vec3(65., 63., 92.) / 256. * 2.;
        col2 = mix(col2, col2B, smoothstep(0.5, 0.1, uv.y));
        vec3 col3 = vec3(29., 43., 76.) / 256.;
        vec3 col3B = vec3(29., 43., 76.) / 256. * 2.;
        col3 = mix(col3, col3B, smoothstep(0.6, 0.0, uv.y*1.2));
        
        col = mix(col, col2, h);
        h = smoothstep(0.5, 0.4, uv.y + 0.05 + h2 * 0.1 - zz2);
        h = smoothstep(0.985, 1., h);
        // col = mix(col, col3, h);
        h = smoothstep(0.5, 0.4, uv.y + 0.13 + h3 * 0.1 - zz3);
        h = smoothstep(0.985, 1., h);
        // col = mix(col, vec3(0.0), h);
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
        // col *= darkSky;
        col *= 2.;
        gl_FragColor = vec4(col - rando, 1.0);
        gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 4.);
       gl_FragColor.rgb *= vig;
        if (topHill > 0.5) {
            gl_FragColor.rgb = hueShift(gl_FragColor.rgb, -4.);
        }
    }
    // endGLSL
`.replace(/[^\x00-\x7F]/g, ""));

// Blue night with a lozenge mask
setBothShaders(`
    // beginGLSL
    precision mediump float;
    uniform float time;
    uniform vec2 resolution;
    ${blendingMath}
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
        vec2 uv = gl_FragCoord.xy / resolution + vec2(0., -0.);
        vec2 ov = uv;
        // ov.y = ov.y * -1. + 1.;
        float ts = 0.003;
        vec2 p0 = vec2(-ts, 1.);
        vec2 p1 = vec2(0.5, 0.5);
        vec2 p2 = vec2(-ts, 0.0);
        vec2 abov = vec2(abs(ov.x - 0.5), uv.y);
        float vig = smoothTriangle(abov, p0, p2, p1, ts);
        vig = smoothstep(0., 1., vig);
        if (vig < 0.1) {
            discard;
        }
        // uv -= 0.5;
        vec2 muv = uv;
        // uv.x += time * 1e-3 + 1e2;
        // muv.x += time * 3e-3;
        uv.x += 38687. * 1e-3;
        uv.y += 0.2;
        muv.x += 66187. * 3e-3;
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
        col = mix(col, colC, map(sin(uv.x*5.), -1., 1., 0.4, 1.));
        float interlace = 1.0 - (sin(uv.y * 1. + time * 0.25) * 0.5 + 0.5) * 1.;
        // col *= interlace;
        float bright = mix(1., 1.25, sin(uv.x*5.)*0.5+0.5);
        // bright = 1.0;
        vec3 col2 = vec3(65., 63., 92.) / 256.;
        
        vec3 col2B = vec3(65., 63., 92.) / 256. * 2.;
        col2 = mix(col2, col2B, smoothstep(0.5, 0.1, uv.y));
        vec3 col3 = vec3(29., 43., 76.) / 256.;
        vec3 col3B = vec3(29., 43., 76.) / 256. * 2.;
        col3 = mix(col3, col3B, smoothstep(0.6, 0.0, uv.y*1.2));
        
        col = mix(col, col2, h);
        h = smoothstep(0.5, 0.4, uv.y + 0.05 + h2 * 0.1 - zz2);
        h = smoothstep(0.985, 1., h);
        // col = mix(col, col3, h);
        h = smoothstep(0.5, 0.4, uv.y + 0.13 + h3 * 0.1 - zz3);
        h = smoothstep(0.985, 1., h);
        // col = mix(col, vec3(0.0), h);
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
        // col *= darkSky;
        col *= 2.;
        gl_FragColor = vec4(col - rando, 1.0);
        gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 4.);
       gl_FragColor.rgb *= vig;
        if (topHill > 0.5) {
            gl_FragColor.rgb = hueShift(gl_FragColor.rgb, -4.);
        }
    }
    // endGLSL
`.replace(/[^\x00-\x7F]/g, ""));

// Blue night with a lozenge mask
setBothShaders(`
    // beginGLSL
    precision mediump float;
    uniform float time;
    uniform vec2 resolution;
    ${blendingMath}
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
        vec2 uv = gl_FragCoord.xy / resolution + vec2(0., -0.);
        vec2 ov = uv;
        uv.y -= 0.2;
        // ov.y = ov.y * -1. + 1.;
        float ts = 0.003;
        vec2 p0 = vec2(-ts, 1.);
        vec2 p1 = vec2(0.5, 0.5);
        vec2 p2 = vec2(-ts, 0.0);
        vec2 abov = vec2(abs(ov.x - 0.5), ov.y);
        float vig = smoothTriangle(abov, p0, p2, p1, ts);
        vig = smoothstep(0., 1., vig);
        if (vig < 0.1) {
            discard;
        }
        // uv -= 0.5;
        vec2 muv = uv;
        // uv.x += time * 1e-3 + 1e2;
        // muv.x += time * 3e-3;
        uv.x += 38687. * 1e-3;
        uv.y += 0.2;
        muv.x += 66187. * 3e-3;
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
        col = mix(col, colC, map(sin(uv.x*5.), -1., 1., 0.4, 1.));
        float interlace = 1.0 - (sin(uv.y * 1. + time * 0.25) * 0.5 + 0.5) * 1.;
        // col *= interlace;
        float bright = mix(1., 1.25, sin(uv.x*5.)*0.5+0.5);
        // bright = 1.0;
        vec3 col2 = vec3(65., 63., 92.) / 256.;
        
        vec3 col2B = vec3(65., 63., 92.) / 256. * 2.;
        col2 = mix(col2, col2B, smoothstep(0.5, 0.1, uv.y));
        vec3 col3 = vec3(29., 43., 76.) / 256.;
        vec3 col3B = vec3(29., 43., 76.) / 256. * 2.;
        col3 = mix(col3, col3B, smoothstep(0.6, 0.0, uv.y*1.2));
        
        col = mix(col, col2, h);
        h = smoothstep(0.5, 0.4, uv.y + 0.05 + h2 * 0.1 - zz2);
        h = smoothstep(0.985, 1., h);
        col = mix(col, col3, h);
        h = smoothstep(0.5, 0.4, uv.y + 0.13 + h3 * 0.1 - zz3);
        h = smoothstep(0.985, 1., h);
        col = mix(col, vec3(0.0), h);
        // col -= (noise(uv)*0.5+0.5) * 0.25;
        col = vec3(pow(col.r, 2.),pow(col.g, 2.),pow(col.b, 2.));
        col -= cloudEffect(uv * 2. * vec2(0.25, 1.)) * 0.5;
        // col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.35)) * 0.5;
        // col -= cloudEffect(muv * 2. * vec2(0.25, 1.)) * 0.5;
        col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.0625)) * 0.5;
        h = (uv.x+uv.y)*0.5;
        // col *= 4.;
        float darkSky = min((-uv.y*2.)+2.5, 1.);
        darkSky *= min((-uv.y*1.)+1.5, 1.);
        darkSky *= min((-uv.y*2.)+2.5, 1.);
        // darkSky = smoothstep(0., 1., darkSky);
        col *= darkSky;
        col *= 2.;
        gl_FragColor = vec4(col - rando, 1.0);
        gl_FragColor.rgb *= vig;
        if (topHill > 0.5) {
            gl_FragColor.rgb = hueShift(gl_FragColor.rgb, -0.2);
        } else {
            gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 4.);
        }
    }
    // endGLSL
`.replace(/[^\x00-\x7F]/g, ""));

}