verticalLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute float x;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying float w;
    varying vec4 c;
    varying vec2 uvs;
    varying float t;
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(x, 0.);
        w = width * 0.5;
        if (index == 0.) {
            pos.x -= w;            
            pos.y = 1.0;
        } else if (index == 1.) {
            pos.x += w;           
            pos.y = 1.0;
        } else if (index == 2.) {
            pos.x += w;
            pos.y = -1.0;
        } else if (index == 3.) {
            pos.x -= w;
            pos.y = -1.0;
        }
        float w1 = 1./w;
        // pos.x += sin(time * 20.*w) * 8e-2 * w;
        pos.x *= ratio;
        gl_Position = vec4(pos, 0.0, 1.0);
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
verticalLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying float w;
    varying float t;
    ${cloudEffect}
    ${blendingMath}
    ${luma}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
vec3 oklabMix( vec3 colA, vec3 colB, float h ) {
    // https://bottosson.github.io/posts/oklab
    const mat3 kCONEtoLMS = mat3(                
         0.4121656120,  0.2118591070,  0.0883097947,
         0.5362752080,  0.6807189584,  0.2818474174,
         0.0514575653,  0.1074065790,  0.6302613616);
    const mat3 kLMStoCONE = mat3(
         4.0767245293, -1.2681437731, -0.0041119885,
        -3.3072168827,  2.6093323231, -0.7034763098,
         0.2307590544, -0.3411344290,  1.7068625689);
                    
    // rgb to cone (arg of pow can't be negative)
    vec3 lmsA = pow( kCONEtoLMS*colA, vec3(1.0/3.0) );
    vec3 lmsB = pow( kCONEtoLMS*colB, vec3(1.0/3.0) );
    // lerp
    vec3 lms = mix( lmsA, lmsB, h );
    // gain in the middle (no oaklab anymore, but looks better?)
 lms *= 1.0+0.2*h*(1.0-h);
    // cone to rgb
    return kLMStoCONE*(lms*lms*lms);
}
    void main(void) {
        vec2 uv = gl_FragCoord.xy / vec2(1280., 720.) - vec2(0.5);
        float ratio = 1280. / 720.;
        uv.x *= ratio;
        vec2 trunk = vec2(uvs.x, 0.5);
        float distSquared = 1.0 - dot(trunk - 0.5, trunk - 0.5) * 4.;
        vec3 col = vec3(0.0,0.0, 1.0);
        vec3 interior = col;
        float gradient = (1.0 - length(uv + vec2(sin(t*2e-2)*0.5, 0.0)) * 1.5) * 2.;
        gradient = max(gradient, 0.0);
        // gradient = smoothstep(0.2, 0.4, gradient);
        col = oklabMix(col, vec3(1.0,0.0,0.0), gradient);
        float stain = cloudEffect(uvs+vec2(0.0,0.1)+uv*vec2(10.5,0.0)).r * 1.;
        stain = mix(stain, cloudEffect(uvs+vec2(0.0,0.1)+uv*vec2(100.5,0.0)).r * 1., 0.5);
        col -= stain;
        // col *= smoothstep(0., 1., uvs.y);
        // col.r += (1.0 - length(uv) * 2.) * 2.;
        // col.b -= max(0., (1.0 - length(uv) * 2.) * 3.);
        // col *= uvs.y * 2.;
        // col *= ((sin(t*2e-1)*0.5+0.5)*1.);
        col *= 1.0-distSquared;
        interior = interior * distSquared;
        // col = Desaturate(col, 1.0-uvs.y).rgb;
        // col *= map(sin(uvs.y+t*1e-1 ),-1.,1.,0.,1.);
        // gl_FragColor = vec4(vec3(uvs.x), 1.0);
        float noise = rand(uvs * 1e2 + t * 1e-2) * 0.125;
        float alpha = abs(pow(uvs.x*2.-1.,24.))*-1.+1.;
        col = Desaturate(col, (1.0-gradient * 0.8) * 0.5).rgb;
        gl_FragColor = vec4(col * c.a - noise, alpha);
        float stain2 = fbm(uvs*5.)*0.7+0.3;
        gl_FragColor.rgb *= stain2;
        // gl_FragColor.rgb += (interior - stain * 0.4) * distSquared * 0.3;
        gl_FragColor.rgb += (interior * ( uvs.y) * 0.65) - (stain2 * 0.2);
        // gl_FragColor.rgb = gl_FragColor.rrr;
        // gl_FragColor.rgb = vec3((1.0 - length(uv) * 2.));
    }
    // endGLSL
`;
verticalLine.vertText = verticalLine.vertText.replace(/[^\x00-\x7F]/g, "");
verticalLine.fragText = verticalLine.fragText.replace(/[^\x00-\x7F]/g, "");
verticalLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("vertical-line");
    gl.useProgram(currentProgram);
}

verticalLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute float x;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying float w;
    varying vec4 c;
    varying vec2 uvs;
    varying float t;
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(x, 0.);
        w = width * 0.5;
        if (index == 0.) {
            pos.x -= w;            
            pos.y = 1.0;
        } else if (index == 1.) {
            pos.x += w;           
            pos.y = 1.0;
        } else if (index == 2.) {
            pos.x += w;
            pos.y = -1.0;
        } else if (index == 3.) {
            pos.x -= w;
            pos.y = -1.0;
        }
        float w1 = 1./w;
        // pos.x += sin(time * 20.*w) * 8e-2 * w;
        pos.x *= ratio;
        gl_Position = vec4(pos, 0.0, 1.0);
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
verticalLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying float w;
    varying float t;
    ${cloudEffect}
    ${blendingMath}
    ${luma}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
vec3 oklabMix( vec3 colA, vec3 colB, float h ) {
    // https://bottosson.github.io/posts/oklab
    const mat3 kCONEtoLMS = mat3(                
         0.4121656120,  0.2118591070,  0.0883097947,
         0.5362752080,  0.6807189584,  0.2818474174,
         0.0514575653,  0.1074065790,  0.6302613616);
    const mat3 kLMStoCONE = mat3(
         4.0767245293, -1.2681437731, -0.0041119885,
        -3.3072168827,  2.6093323231, -0.7034763098,
         0.2307590544, -0.3411344290,  1.7068625689);
                    
    // rgb to cone (arg of pow can't be negative)
    vec3 lmsA = pow( kCONEtoLMS*colA, vec3(1.0/3.0) );
    vec3 lmsB = pow( kCONEtoLMS*colB, vec3(1.0/3.0) );
    // lerp
    vec3 lms = mix( lmsA, lmsB, h );
    // gain in the middle (no oaklab anymore, but looks better?)
 lms *= 1.0+0.2*h*(1.0-h);
    // cone to rgb
    return kLMStoCONE*(lms*lms*lms);
}
    void main(void) {
        vec2 uv = gl_FragCoord.xy / vec2(1280., 720.) - vec2(0.5);
        // vec2 muvs = uvs * 1.2;
        vec2 muvs = uvs;
        // muvs = clamp((muvs*1.2)*0.5+0.5, 0.0, 1.0);
        // muvs += vec2(cos(uv.y*10.+uv.x*10.), sin(uv.y*10.+uv.x*10.)) * 0.05;
        float ratio = 1280. / 720.;
        uv.x *= ratio;
        vec2 trunk = vec2(muvs.x, 0.5);
        float distSquared = 1.0 - dot(trunk - 0.5, trunk - 0.5) * 4.;
        vec3 col = vec3(0.0, 0.6, 1.0);
        vec3 interior = col;
        float gradient = (1.0 - length(uv + vec2(sin(t*2e-2)*0.5, 0.0)) * 1.5) * 2.;
        gradient = max(gradient, 0.0);
        // gradient = smoothstep(0.2, 0.4, gradient);
        col = oklabMix(col, vec3(1.0,0.0,0.0), gradient);
        float stain = cloudEffect(muvs+vec2(0.0,0.1)+uv*vec2(10.5,0.0)).r * 1.;
        stain = mix(stain, cloudEffect(muvs+vec2(0.0,0.1)+uv*vec2(100.5,0.0)).r * 1., 0.5);
        col -= stain;
        // col *= smoothstep(0., 1., uvs.y);
        // col.r += (1.0 - length(uv) * 2.) * 2.;
        // col.b -= max(0., (1.0 - length(uv) * 2.) * 3.);
        // col *= uvs.y * 2.;
        // col *= ((sin(t*2e-1)*0.5+0.5)*1.);
        col *= 1.0-distSquared;
        interior = interior * distSquared;
        // col = Desaturate(col, 1.0-uvs.y).rgb;
        // col *= map(sin(uvs.y+t*1e-1 ),-1.,1.,0.,1.);
        // gl_FragColor = vec4(vec3(uvs.x), 1.0);
        float noise = rand(muvs * 1e2 + t * 1e-2) * 0.125;
        float alpha = abs(pow(muvs.x*2.-1.,24.))*-1.+1.;
        col = Desaturate(col, (1.0-gradient * 0.8) * 0.5).rgb;
        gl_FragColor = vec4(col * c.a - noise, alpha);
        float stain2 = fbm(muvs*5.)*0.7+0.3;
        gl_FragColor.rgb *= stain2;
        // gl_FragColor.rgb += (interior - stain * 0.4) * distSquared * 0.3;
        gl_FragColor.rgb += (interior * (distSquared) * ( muvs.y) * 0.65) - (stain2 * 0.2);
        gl_FragColor.r += (gradient*0.2*(1.0-distSquared));
        // gl_FragColor.rgb = gl_FragColor.rrr;
        // gl_FragColor.rgb = vec3((1.0 - length(uv) * 2.));
    }
    // endGLSL
`;
verticalLine.vertText = verticalLine.vertText.replace(/[^\x00-\x7F]/g, "");
verticalLine.fragText = verticalLine.fragText.replace(/[^\x00-\x7F]/g, "");
verticalLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("vertical-line");
    gl.useProgram(currentProgram);
}

verticalLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute float x;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying float w;
    varying vec4 c;
    varying vec2 uvs;
    varying float t;
    varying vec2 posUnit;
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(x, 0.);
        w = width * 0.5;
        if (index == 0.) {
            pos.x -= w;            
            pos.y = 1.0;
        } else if (index == 1.) {
            pos.x += w;           
            pos.y = 1.0;
        } else if (index == 2.) {
            pos.x += w;
            pos.y = -1.0;
        } else if (index == 3.) {
            pos.x -= w;
            pos.y = -1.0;
        }
        float w1 = 1./w;
        // pos.x += sin(time * 20.*w) * 8e-2 * w;
        pos.x *= ratio;
        posUnit = pos;
        gl_Position = vec4(pos, 0.0, 1.0);
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
verticalLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying float w;
    varying float t;
    varying vec2 posUnit;
    ${cloudEffect}
    ${blendingMath}
    ${luma}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
vec3 oklabMix( vec3 colA, vec3 colB, float h ) {
    // https://bottosson.github.io/posts/oklab
    const mat3 kCONEtoLMS = mat3(                
         0.4121656120,  0.2118591070,  0.0883097947,
         0.5362752080,  0.6807189584,  0.2818474174,
         0.0514575653,  0.1074065790,  0.6302613616);
    const mat3 kLMStoCONE = mat3(
         4.0767245293, -1.2681437731, -0.0041119885,
        -3.3072168827,  2.6093323231, -0.7034763098,
         0.2307590544, -0.3411344290,  1.7068625689);
                    
    // rgb to cone (arg of pow can't be negative)
    vec3 lmsA = pow( kCONEtoLMS*colA, vec3(1.0/3.0) );
    vec3 lmsB = pow( kCONEtoLMS*colB, vec3(1.0/3.0) );
    // lerp
    vec3 lms = mix( lmsA, lmsB, h );
    // gain in the middle (no oaklab anymore, but looks better?)
 lms *= 1.0+0.2*h*(1.0-h);
    // cone to rgb
    return kLMStoCONE*(lms*lms*lms);
}
    void main(void) {
        vec2 uv = gl_FragCoord.xy / vec2(1280., 720.) - vec2(0.5);
        // vec2 muvs = uvs * 1.2;
        vec2 muvs = uvs;
        // muvs = clamp((muvs*1.2)*0.5+0.5, 0.0, 1.0);
        // muvs += vec2(cos(uv.y*10.+uv.x*10.), sin(uv.y*10.+uv.x*10.)) * 0.05;
        float ratio = 1280. / 720.;
        uv.x *= ratio;
        vec2 trunk = vec2(muvs.x, 0.5);
        float distSquared = 1.0 - dot(trunk - 0.5, trunk - 0.5) * 4.;
        vec3 col = vec3(0.0, 0.6, 1.0);
        vec3 interior = col;
        // float gradient = (1.0 - length(uv + vec2(fract(t*2e-3) * 0.5 * 6. - 1.3, 0.0)) * 1.5) * 2.;
        float gradient = (1.0 - length(uv + vec2(sin(t*2e-2)*0.5, 0.0)) * 1.5) * 2.;
        gradient = max(gradient, 0.0);
        // gradient = smoothstep(0.2, 0.4, gradient);
        col = oklabMix(col, vec3(1.0,0.0,0.0), gradient);
        float stain = cloudEffect(muvs+vec2(0.0,0.1)+uv*vec2(10.5,0.0)).r * 1.;
        stain = mix(stain, cloudEffect(muvs+vec2(0.0,0.1)+uv*vec2(100.5,0.0)).r * 1., 0.5);
        col -= stain;
        // col *= smoothstep(0., 1., uvs.y);
        // col.r += (1.0 - length(uv) * 2.) * 2.;
        // col.b -= max(0., (1.0 - length(uv) * 2.) * 3.);
        // col *= uvs.y * 2.;
        // col *= ((sin(t*2e-1)*0.5+0.5)*1.);
        col *= 1.0-distSquared;
        interior = interior * distSquared;
        // col = Desaturate(col, 1.0-uvs.y).rgb;
        // col *= map(sin(uvs.y+t*1e-1 ),-1.,1.,0.,1.);
        // gl_FragColor = vec4(vec3(uvs.x), 1.0);
        float noise = rand(muvs * 1e2 + t * 1e-2) * 0.05;
        float alpha = abs(pow(muvs.x*2.-1.,24.))*-1.+1.;
        col = Desaturate(col, (1.0-gradient * 0.8) * 0.5).rgb;
        gl_FragColor = vec4(col * c.a - noise, alpha);
        float stain2 = fbm(muvs*5.+posUnit*30.)*0.7+0.3;
        gl_FragColor.rgb *= stain2;
        // gl_FragColor.rgb += (interior - stain * 0.4) * distSquared * 0.3;
        gl_FragColor.rgb += (interior * (distSquared) * ( muvs.y) * 0.65) - (stain2 * 0.2);
        gl_FragColor.r += (gradient*0.2*(1.0-distSquared));
        if (gl_FragColor.r > 0.1) {
            gl_FragColor.rgb = hueShift(gl_FragColor.rgb, -0.7);
            gl_FragColor.rgb *= 2.;
            gl_FragColor.g = 0.0;
            // gl_FragColor.b = 0.0;
        }
        
        // gl_FragColor.rgb = vec3(luma(gl_FragColor.rgb));
                    // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 0.4);
        // gl_FragColor.rgb *= 1.6;
        // gl_FragColor.rgb = ContrastSaturationBrightness(gl_FragColor.rgb, 1.0, 1.0, 0.7);
        // gl_FragColor.rgb = gl_FragColor.rrr;
        // gl_FragColor.rgb = vec3((1.0 - length(uv) * 2.));
    }
    // endGLSL
`;
verticalLine.vertText = verticalLine.vertText.replace(/[^\x00-\x7F]/g, "");
verticalLine.fragText = verticalLine.fragText.replace(/[^\x00-\x7F]/g, "");
verticalLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("vertical-line");
    gl.useProgram(currentProgram);
}

if (false) {

verticalLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute float x;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying float w;
    varying vec4 c;
    varying vec2 uvs;
    varying float t;
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(x, 0.);
        w = width * 0.5;
        if (index == 0.) {
            pos.x -= w;            
            pos.y = 1.0;
        } else if (index == 1.) {
            pos.x += w;           
            pos.y = 1.0;
        } else if (index == 2.) {
            pos.x += w;
            pos.y = -1.0;
        } else if (index == 3.) {
            pos.x -= w;
            pos.y = -1.0;
        }
        float w1 = 1./w;
        // pos.x += sin(time * 20.*w) * 8e-2 * w;
        pos.x *= ratio;
        gl_Position = vec4(pos, 0.0, 1.0);
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
verticalLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying float w;
    varying float t;
    ${cloudEffect}
    ${blendingMath}
    ${luma}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
vec3 oklabMix( vec3 colA, vec3 colB, float h ) {
    // https://bottosson.github.io/posts/oklab
    const mat3 kCONEtoLMS = mat3(                
         0.4121656120,  0.2118591070,  0.0883097947,
         0.5362752080,  0.6807189584,  0.2818474174,
         0.0514575653,  0.1074065790,  0.6302613616);
    const mat3 kLMStoCONE = mat3(
         4.0767245293, -1.2681437731, -0.0041119885,
        -3.3072168827,  2.6093323231, -0.7034763098,
         0.2307590544, -0.3411344290,  1.7068625689);
                    
    // rgb to cone (arg of pow can't be negative)
    vec3 lmsA = pow( kCONEtoLMS*colA, vec3(1.0/3.0) );
    vec3 lmsB = pow( kCONEtoLMS*colB, vec3(1.0/3.0) );
    // lerp
    vec3 lms = mix( lmsA, lmsB, h );
    // gain in the middle (no oaklab anymore, but looks better?)
 lms *= 1.0+0.2*h*(1.0-h);
    // cone to rgb
    return kLMStoCONE*(lms*lms*lms);
}
    void main(void) {
        vec2 uv = gl_FragCoord.xy / vec2(1280., 720.) - vec2(0.5);
        // vec2 muvs = uvs * 1.2;
        vec2 muvs = uvs;
        // muvs = clamp((muvs*1.2)*0.5+0.5, 0.0, 1.0);
        // muvs += vec2(cos(uv.y*10.+uv.x*10.), sin(uv.y*10.+uv.x*10.)) * 0.05;
        float ratio = 1280. / 720.;
        uv.x *= ratio;
        vec2 trunk = vec2(muvs.x, 0.5);
        float distSquared = 1.0 - dot(trunk - 0.5, trunk - 0.5) * 4.;
        vec3 col = vec3(0.0, 0.6, 1.0);
        vec3 interior = col;
        float gradient = (1.0 - length(uv + vec2(sin(t*2e-2)*0.5, 0.0)) * 1.5) * 2.;
        gradient = max(gradient, 0.0);
        // gradient = smoothstep(0.2, 0.4, gradient);
        col = oklabMix(col, vec3(1.0,0.0,0.0), gradient);
        float stain = cloudEffect(muvs+vec2(0.0,0.1)+uv*vec2(10.5,0.0)).r * 1.;
        stain = mix(stain, cloudEffect(muvs+vec2(0.0,0.1)+uv*vec2(100.5,0.0)).r * 1., 0.5);
        col -= stain;
        // col *= smoothstep(0., 1., uvs.y);
        // col.r += (1.0 - length(uv) * 2.) * 2.;
        // col.b -= max(0., (1.0 - length(uv) * 2.) * 3.);
        // col *= uvs.y * 2.;
        // col *= ((sin(t*2e-1)*0.5+0.5)*1.);
        col *= 1.0-distSquared;
        interior = interior * distSquared;
        // col = Desaturate(col, 1.0-uvs.y).rgb;
        // col *= map(sin(uvs.y+t*1e-1 ),-1.,1.,0.,1.);
        // gl_FragColor = vec4(vec3(uvs.x), 1.0);
        float noise = rand(muvs * 1e2 + t * 1e-2) * 0.125;
        float alpha = abs(pow(muvs.x*2.-1.,24.))*-1.+1.;
        col = Desaturate(col, (1.0-gradient * 0.8) * 0.5).rgb;
        gl_FragColor = vec4(col * c.a - noise, alpha);
        float stain2 = fbm(uv*15.*vec2(2.,10.))*0.7+0.3;
        gl_FragColor.rgb *= stain2;
        // gl_FragColor.rgb += (interior - stain * 0.4) * distSquared * 0.3;
        gl_FragColor.rgb += (interior * (distSquared) * ( muvs.y) * 0.65) - (stain2 * 0.2);
        gl_FragColor.r += (gradient*0.2*(1.0-distSquared));
        // gl_FragColor.rgb = gl_FragColor.rrr;
        // gl_FragColor.rgb = vec3((1.0 - length(uv) * 2.));
    }
    // endGLSL
`;
verticalLine.vertText = verticalLine.vertText.replace(/[^\x00-\x7F]/g, "");
verticalLine.fragText = verticalLine.fragText.replace(/[^\x00-\x7F]/g, "");
verticalLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("vertical-line");
    gl.useProgram(currentProgram);
}

verticalLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute float x;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying float w;
    varying vec4 c;
    varying vec2 uvs;
    varying float t;
    varying vec2 posUnit;
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(x, 0.);
        w = width * 0.5;
        if (index == 0.) {
            pos.x -= w * 0.9;            
            pos.y = 1.0;
        } else if (index == 1.) {
            pos.x += w * 0.9;           
            pos.y = 1.0;
        } else if (index == 2.) {
            pos.x += w;
            pos.y = -1.0;
        } else if (index == 3.) {
            pos.x -= w;
            pos.y = -1.0;
        }
        float w1 = 1./w;
        // pos.x += sin(time * 20.*w) * 8e-2 * w;
        pos.x *= ratio;
        posUnit = pos;
        gl_Position = vec4(pos, 0.0, 1.0);
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
verticalLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying float w;
    varying float t;
    varying vec2 posUnit;
    ${cloudEffect}
    ${blendingMath}
    ${luma}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
vec3 oklabMix( vec3 colA, vec3 colB, float h ) {
    // https://bottosson.github.io/posts/oklab
    const mat3 kCONEtoLMS = mat3(                
         0.4121656120,  0.2118591070,  0.0883097947,
         0.5362752080,  0.6807189584,  0.2818474174,
         0.0514575653,  0.1074065790,  0.6302613616);
    const mat3 kLMStoCONE = mat3(
         4.0767245293, -1.2681437731, -0.0041119885,
        -3.3072168827,  2.6093323231, -0.7034763098,
         0.2307590544, -0.3411344290,  1.7068625689);
                    
    // rgb to cone (arg of pow can't be negative)
    vec3 lmsA = pow( kCONEtoLMS*colA, vec3(1.0/3.0) );
    vec3 lmsB = pow( kCONEtoLMS*colB, vec3(1.0/3.0) );
    // lerp
    vec3 lms = mix( lmsA, lmsB, h );
    // gain in the middle (no oaklab anymore, but looks better?)
 lms *= 1.0+0.2*h*(1.0-h);
    // cone to rgb
    return kLMStoCONE*(lms*lms*lms);
}
    void main(void) {
        vec2 uv = gl_FragCoord.xy / vec2(1280., 720.) - vec2(0.5);
        // vec2 muvs = uvs * 1.2;
        vec2 muvs = uvs;
        muvs.x = (muvs.x+0.5)*1.5-1.;
        // muvs = clamp((muvs*1.2)*0.5+0.5, 0.0, 1.0);
        muvs.x += cos(uv.y*30.*muvs.y+posUnit.x*20.) * 0.02;
        float ratio = 1280. / 720.;
        uv.x *= ratio;
        vec2 trunk = vec2(muvs.x, 0.5);
        float distSquared = 1.0 - dot(trunk - 0.5, trunk - 0.5) * 4.;
        vec3 col = vec3(0.0, 0.6, 1.0);
        vec3 interior = col;
        float gradient = (1.0 - length(uv + vec2(sin(t*2e-2)*0.5, 0.0)) * 1.5) * 2.;
        gradient = max(gradient, 0.0);
        // gradient = smoothstep(0.2, 0.4, gradient);
        col = oklabMix(col, vec3(1.0,0.0,0.0), gradient);
        float stain = cloudEffect(muvs+vec2(0.0,0.1)+muvs*0.25*vec2(10.5,0.0)).r * 1.;
        stain = mix(stain, cloudEffect(muvs+vec2(0.0,0.1)+muvs*0.25*vec2(100.5,0.0)).r * 1., 0.5);
        col -= stain;
        // col *= smoothstep(0., 1., uvs.y);
        // col.r += (1.0 - length(uv) * 2.) * 2.;
        // col.b -= max(0., (1.0 - length(uv) * 2.) * 3.);
        // col *= uvs.y * 2.;
        // col *= ((sin(t*2e-1)*0.5+0.5)*1.);
        col *= 1.0-distSquared;
        interior = interior * distSquared;
        // col = Desaturate(col, 1.0-uvs.y).rgb;
        // col *= map(sin(uvs.y+t*1e-1 ),-1.,1.,0.,1.);
        // gl_FragColor = vec4(vec3(uvs.x), 1.0);
        float noise = rand(muvs * 1e2 + t * 1e-2) * 0.125;
        float alpha = abs(pow(muvs.x*2.-1.,24.))*-1.+1.;
        col = Desaturate(col, (1.0-gradient * 0.8) * 0.5).rgb;
        gl_FragColor = vec4(col * c.a - noise, alpha);
        float stain2 = fbm(muvs*5.)*0.7+0.3;
        gl_FragColor.rgb *= stain2;
        // gl_FragColor.rgb += (interior - stain * 0.4) * distSquared * 0.3;
        gl_FragColor.rgb += (interior * (distSquared) * ( muvs.y) * 0.65) - (stain2 * 0.2);
        gl_FragColor.r += (gradient*0.2*(1.0-distSquared));
        // gl_FragColor.rgb = gl_FragColor.rrr;
        // gl_FragColor.rgb = vec3((1.0 - length(uv) * 2.));
    }
    // endGLSL
`;
verticalLine.vertText = verticalLine.vertText.replace(/[^\x00-\x7F]/g, "");
verticalLine.fragText = verticalLine.fragText.replace(/[^\x00-\x7F]/g, "");
verticalLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("vertical-line");
    gl.useProgram(currentProgram);
}

}