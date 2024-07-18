// Silk
if (false) {

silk = [];
silkAlpha = [];
    dotsAlpha = [];
draw = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    resetLines();
    resetDots();
    dotsAlpha = [];
    // expandingUniverse();
    drawArachne();
    silk = silk.slice(0, 2500 * 2);
    silkAlpha = silkAlpha.slice(0, 1250 * 2);
    for (let i = 0; i < silk.length; i += 2) {
        // silk[1+i] = silk[1+i] - 0.0025; 
        silk[1+i] = silk[1+i] * 1.01;
        silk[1+i] = silk[1+i] + 0.001;
        silk[0+i] = silk[0+i] * 1.01;
        let rot = rotate2D(0, 0, silk[0+i], silk[1+i], Math.PI*1e-5*i*(Math.sin(drawCount*1e-3)*0.5+0.5));
        silk[0+i] = rot[0];
        silk[1+i] = rot[1];
    }
    for (let i = 0; i < silkAlpha.length; i++) {
        silkAlpha[i] = silkAlpha[i] + 0.0025;
    }
    for (let i = 0; i < silk.length; i++) {
        dots.push(silk[i]);
    }    
    for (let i = 0; i < silkAlpha.length; i++) {
        dotsAlpha.push(silkAlpha[i]);
    }
    currentProgram = getProgram("smooth-dots");
    gl.useProgram(currentProgram);
    drawDots(currentProgram);
    currentProgram = getProgram("smooth-line");
    gl.useProgram(currentProgram);
    drawLines();
    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
    drawCount++;
}
drawArachne = function() {
    frameInc = Math.pow((openSimplex.noise2D(drawCount * 5e-2, 0) * 0.5 + 1), 5) * 0.1;
    // frameInc = Math.PI * 2 / 24;
    // frameInc *= (Math.sin(drawCount*10)*0.5+0.5);
    let sc = 0.5;
    let a = 4;
    let b = 3.2;
    let r = 48 / cnvs.width * 3;
    let br = (24 * 6) / cnvs.width * 3;
    // stroke(255, 0, 0);
    let ii = 0;
    for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / 12) {
        if (ii !== 7 && ii !== 5 && ii !== 6 && ii !== 0) {
            let f = i;
            let t = frame;
            let x = (b + a * Math.cos(f + Math.sin(i * 2 + t) * 0.2)) * Math.cos(f + Math.sin(i * 2 + t) * 0.2) * r;
            let y = (b + a * Math.cos(f + Math.sin(i * 2 + t) * 0.2)) * Math.sin(f + Math.sin(i * 2 + t) * 0.2) * r;
            let cx = 0; let cy = 0;
            let rr = rotate2D(0, 0, x, y, Math.PI * 0.5);
            // for (let k = 0; k < frameInc *1000; k++) {
                // var angle = Math.random()*Math.PI*2;
                // var rad = Math.random() * frameInc;
                // let d = [Math.cos(angle) * rad, Math.sin(angle)* rad];
                // dots.push(rr[0]*2 + d[0], ((rr[1] + (br * 2))*-1+0.45)*2-0.25+d[1]);
            // }
            silk.unshift((((rr[1] + (br * 2))*-1+0.45)*2-0.25)*sc);
            silk.unshift(rr[0]*2*sc);
            silkAlpha.unshift(0.5+frameInc*4);
            let bx = Math.cos(i - Math.PI * 0.5 + Math.sin(i * 2 + t) * 0.2) * br;
            let by = Math.sin(i - Math.PI * 0.5 + Math.sin(i * 2 + t) * 0.2) * br;
            addLine(
                0, (0-0.25)*sc, bx*2*sc, (-by*2-0.25)*sc, 
                1/2/4+frameInc,
                1, 0, 0, 0.5
            );
            addLine(
                rr[0]*2*sc, (((rr[1] + (br * 2))*-1+0.45)*2-0.25)*sc, bx*2*sc, (-by*2-0.25)*sc,
                1/2/4+frameInc,
                1, 0, 0, 0.5
            );
            addLine(
                0, (0-0.25)*sc, bx*2*sc, (-by*2-0.25)*sc, 
                 1/5/4+frameInc,
                1, 0, 0, 1
            );
            addLine(
                rr[0]*2*sc, (((rr[1] + (br * 2))*-1+0.45)*2-0.25)*sc, bx*2*sc, (-by*2-0.25)*sc,
                1/5/4+frameInc,
                1, 0, 0, 1
            );
        }
    ii++;
    }
    for (let i = 0; i < Math.PI * 2 - (Math.PI * 2 / 1200); i += Math.PI * 2 / 400) {
        let f = i;
        let x = (b + a * Math.cos(f)) * Math.cos(f) * r;
        let y = (b + a * Math.cos(f)) * Math.sin(f) * r;
        let cx = 0; let cy = 0;
        let rr = rotate2D(0, 0, x, y, Math.PI * 0.5);
        dots.push(rr[0]*2*sc, (((rr[1] + (br*2))*-1+0.45)*2-0.25)*sc);
        dotsAlpha.push(1);
    }
    for (let i = 0; i < Math.PI * 2 - (Math.PI * 2 / 1200); i += Math.PI * 2 / 200) {
        let bx = Math.cos(i - Math.PI * 0.5) * br * (2/3);
        let by = Math.sin(i - Math.PI * 0.5) * br * (2/3);
        // dots.push(bx*2*1.5, -by*2*1.5-0.25);
        // dotsAlpha.push(1);
        dots.push(0+(Math.sin(i+drawCount*2e-1)*(i*0.005))*sc, (i*0.37-0.25)*sc);
        dotsAlpha.push(1);
    }
    // for (let i = 0; i < Math.PI * 2 - (Math.PI * 2 / 1200); i += Math.PI * 2 / 75) {
        // let bx = Math.cos(i - Math.PI * 0.5) * br * (2/3);
        // let by = Math.sin(i - Math.PI * 0.5) * br * (2/3);
        // dots.push(bx * (3/2)*0.25*2, ((by * (3/2)*0.25 - (br*2) * 1.5)*-1-0.45*1.5)*2-0.3);
        // ii++;
    // }
    // frame *= hit;
    frame += frameInc;
    socket.emit('note', frameInc);
    // hit = Math.max(1.0, hit * 0.9);
};
smoothDots.vertText = `
    // beginGLSL
    attribute vec2 coordinates;
    attribute float alpha;
    uniform float time;
    uniform vec2 resolution;
    varying float t;
    varying vec2 posxy;
    varying float a;
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        vec2 pos = coordinates.xy;
        // pos += vec2(
        //     cos(pos.x*pos.y*2.+time*0.1), 
        //     sin(pos.x*pos.y*2.+time*0.1)
        //     )*0.01;
        // pos += vec2(
        //     cos(pos.x*pos.y*400.+time*1.1*sign(pos.x*pos.y*400.)), 
        //     sin(pos.x*pos.y*400.+time*1.1*sign(pos.x*pos.y*400.)))*0.0025;
        pos.x *= resolution.y / resolution.x;
        gl_Position = vec4(pos.x, pos.y, 0.0, 1.0);
        gl_PointSize = 20. * alpha;
        // gl_PointSize += (sin((coordinates.y*0.02+time*2e-1))*0.5+0.5)*4.;
        posxy = gl_Position.xy;
        t = time;
        a = alpha;
        
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    varying vec2 posxy;
    varying float a;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        vec2 pos = gl_PointCoord;
        float instability = sin(-t*0.1+length(posxy*vec2(16./9., 1.))*0.5e1)*0.5+0.5;
        if (instability > 0.8) {
            // discard;
        }
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 0.5;
        float l = 1.0 - length(pos - vec2(0.5)) * 4.;
        // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // l += distSquared * 0.25;
        distSquared -= 1.2;
        l += (distSquared - (l * distSquared));
        float halo = (1.0 - length(pos - vec2(0.5)) * 2.)*0.5;
        l = smoothstep(0., 1., l);
        // l = smoothstep(0., 1., l);
                // l = mix(pow(l, 10.)*0.0001, l, sin(t*0.1+posxy.y*0.125e1)*0.5+0.5);
                // l = mix(pow(l, 10.)*0.0001, l, sin(t*0.1+posxy.y*0.125e1)*0.5+0.5);
        
        // float instability = sin(t*0.1+posxy.y*0.25e1)*0.5+0.5;
        float vanish = length((posxy-vec2(0.0, -0.4))*4.);
        // vanish = floor(vanish);
        vanish = min(pow(vanish, 2.0)*2.5, 1.);
        vanish = 1.0;
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.75, 0.25).gbr, (l+halo-noise)*0.5*vanish*(max(0.,a)));
    }
    // endGLSL
`;
smoothDots.vertText = smoothDots.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots.fragText = smoothDots.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots.init();
    dots_alpha_buffer = gl.createBuffer();
drawDots = function(selectedProgram) {
    // vertices = [];
    // num=0;
    // for (let i = 0; i < reached.length; i++) {
    //     vertices.push(reached[i][0], reached[i][1]);
    //     num++;
    // }
    gl.bindBuffer(gl.ARRAY_BUFFER, dots_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dots), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    gl.bindBuffer(gl.ARRAY_BUFFER, dots_alpha_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotsAlpha), gl.STATIC_DRAW);
    // Get the attribute location
    var alphaAttribLocation = gl.getAttribLocation(selectedProgram, "alpha");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(alphaAttribLocation, 1, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(alphaAttribLocation);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.POINTS, 0, dots.length * 0.5);
};

}

// Undo silk
if (false) {


draw = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    resetLines();
    resetDots();
    expandingUniverse();
    drawArachne();
    currentProgram = getProgram("smooth-dots");
    gl.useProgram(currentProgram);
    drawDots(currentProgram);
    currentProgram = getProgram("smooth-line");
    gl.useProgram(currentProgram);
    drawLines();
    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
    drawCount++;
}
drawArachne = function() {
    frameInc = Math.pow((openSimplex.noise2D(drawCount * 5e-2, 0) * 0.5 + 1), 5) * 0.1;
    // frameInc *= (Math.sin(drawCount*10)*0.5+0.5);
    let a = 4;
    let b = 3.2;
    let r = 48 / cnvs.width * 3;
    let br = (24 * 6) / cnvs.width * 3;
    // stroke(255, 0, 0);
    let ii = 0;
    for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / 12) {
        if (ii !== 7 && ii !== 5 && ii !== 6 && ii !== 0) {
            let f = i;
            let t = frame;
            let x = (b + a * Math.cos(f + Math.sin(i * 2 + t) * 0.2)) * Math.cos(f + Math.sin(i * 2 + t) * 0.2) * r;
            let y = (b + a * Math.cos(f + Math.sin(i * 2 + t) * 0.2)) * Math.sin(f + Math.sin(i * 2 + t) * 0.2) * r;
            let cx = 0; let cy = 0;
            let rr = rotate2D(0, 0, x, y, Math.PI * 0.5);
            // for (let k = 0; k < frameInc *1000; k++) {
                // var angle = Math.random()*Math.PI*2;
                // var rad = Math.random() * frameInc;
                // let d = [Math.cos(angle) * rad, Math.sin(angle)* rad];
                // dots.push(rr[0]*2 + d[0], ((rr[1] + (br * 2))*-1+0.45)*2-0.25+d[1]);
            // }
            let bx = Math.cos(i - Math.PI * 0.5 + Math.sin(i * 2 + t) * 0.2) * br;
            let by = Math.sin(i - Math.PI * 0.5 + Math.sin(i * 2 + t) * 0.2) * br;
            addLine(
                0, 0-0.25, bx*2, -by*2-0.25, 
                1/2/4+frameInc,
                1, 0, 0, 0.5
            );
            addLine(
                rr[0]*2, ((rr[1] + (br * 2))*-1+0.45)*2-0.25, bx*2, -by*2-0.25,
                1/2/4+frameInc,
                1, 0, 0, 0.5
            );
            addLine(
                0, 0-0.25, bx*2, -by*2-0.25, 
                1/5/4+frameInc,
                1, 0, 0, 1
            );
            addLine(
                rr[0]*2, ((rr[1] + (br * 2))*-1+0.45)*2-0.25, bx*2, -by*2-0.25,
                1/5/4+frameInc,
                1, 0, 0, 1
            );
        }
    ii++;
    }
    for (let i = 0; i < Math.PI * 2 - (Math.PI * 2 / 1200); i += Math.PI * 2 / 400) {
        let f = i;
        let x = (b + a * Math.cos(f)) * Math.cos(f) * r;
        let y = (b + a * Math.cos(f)) * Math.sin(f) * r;
        let cx = 0; let cy = 0;
        let rr = rotate2D(0, 0, x, y, Math.PI * 0.5);
        dots.push(rr[0]*2, ((rr[1] + (br*2))*-1+0.45)*2-0.25);
    }
    for (let i = 0; i < Math.PI * 2 - (Math.PI * 2 / 1200); i += Math.PI * 2 / 200) {
        let bx = Math.cos(i - Math.PI * 0.5) * br * (2/3);
        let by = Math.sin(i - Math.PI * 0.5) * br * (2/3);
        dots.push(bx*2*1.5, -by*2*1.5-0.25);
        dots.push(0+(Math.sin(i+drawCount*2e-1)*(i*0.005)), i*0.25-0.25);
    }
    // for (let i = 0; i < Math.PI * 2 - (Math.PI * 2 / 1200); i += Math.PI * 2 / 75) {
        // let bx = Math.cos(i - Math.PI * 0.5) * br * (2/3);
        // let by = Math.sin(i - Math.PI * 0.5) * br * (2/3);
        // dots.push(bx * (3/2)*0.25*2, ((by * (3/2)*0.25 - (br*2) * 1.5)*-1-0.45*1.5)*2-0.3);
        // ii++;
    // }
    // frame *= hit;
    frame += frameInc;
    socket.emit('note', frameInc);
    // hit = Math.max(1.0, hit * 0.9);
};
smoothDots.vertText = `
    // beginGLSL
    attribute vec2 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float t;
    varying vec2 posxy;
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        vec2 pos = coordinates.xy;
        // pos += vec2(
        //     cos(pos.x*pos.y*2.+time*0.1), 
        //     sin(pos.x*pos.y*2.+time*0.1)
        //     )*0.01;
        // pos += vec2(
        //     cos(pos.x*pos.y*400.+time*1.1*sign(pos.x*pos.y*400.)), 
        //     sin(pos.x*pos.y*400.+time*1.1*sign(pos.x*pos.y*400.)))*0.0025;
        pos.x *= resolution.y / resolution.x;
        gl_Position = vec4(pos.x, pos.y, 0.0, 1.0);
        gl_PointSize = 20.;
        // gl_PointSize += (sin((coordinates.y*0.02+time*2e-1))*0.5+0.5)*4.;
        posxy = gl_Position.xy;
        t = time;
        
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    varying vec2 posxy;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        vec2 pos = gl_PointCoord;
        float instability = sin(-t*0.1+length(posxy*vec2(16./9., 1.))*0.5e1)*0.5+0.5;
        if (instability > 0.8) {
            discard;
        }
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 0.5;
        float l = 1.0 - length(pos - vec2(0.5)) * 4.;
        // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // l += distSquared * 0.25;
        distSquared -= 1.2;
        l += (distSquared - (l * distSquared));
        float halo = (1.0 - length(pos - vec2(0.5)) * 2.)*0.5;
        l = smoothstep(0., 1., l);
        // l = smoothstep(0., 1., l);
                // l = mix(pow(l, 10.)*0.0001, l, sin(t*0.1+posxy.y*0.125e1)*0.5+0.5);
                // l = mix(pow(l, 10.)*0.0001, l, sin(t*0.1+posxy.y*0.125e1)*0.5+0.5);
        
        // float instability = sin(t*0.1+posxy.y*0.25e1)*0.5+0.5;
        float vanish = length((posxy-vec2(0.0, -0.4))*4.);
        // vanish = floor(vanish);
        vanish = min(pow(vanish, 2.0)*2.5, 1.);
        vanish = 1.0;
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.75, 0.25).gbr-instability, (l+halo-noise)*0.5*vanish);
    }
    // endGLSL
`;
smoothDots.vertText = smoothDots.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots.fragText = smoothDots.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots.init();
drawDots = function(selectedProgram) {
    // vertices = [];
    // num=0;
    // for (let i = 0; i < reached.length; i++) {
    //     vertices.push(reached[i][0], reached[i][1]);
    //     num++;
    // }
    gl.bindBuffer(gl.ARRAY_BUFFER, dots_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dots), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.POINTS, 0, dots.length * 0.5);
};

}