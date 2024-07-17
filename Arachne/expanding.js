fullArr = [];
nextArr = [];
for (let i = 0 ; i < 30000; i++) {
    fullArr.push({x: Math.cos(i) * i, y: Math.sin(i) * i});
    nextArr.push({x: 0, y: 0});
}

expandingUniverse = function(selectedProgram) {
    let vertices = [];
    let xOffset = (noise(frameCount * 0.0025) - 0.5) * 0.9;
    let yOffset = (noise((frameCount + 100) * 0.0025) - 0.5) * 0.9;
    let t = drawCount * 0.00000005 + 0;
    let fx = 1;
    let fy = 1;
    let x = 0;
    let y = 0;
    let num = 20000;
    function ro(a, l, x, y, h) {
        return {
            x: x + Math.cos(h + a) * l,
            y: y + Math.sin(h + a) * l,
            h: h + a
        };
    }
    let amountRays = 120;
    let sj = (10 - t) * 1000000;
    let rayInc = Math.PI * 2 / amountRays;
    let numV = 0;
    let metaV = [];
    let indMetaV = 0;
    let ink = 0;
    for (let j = sj; j < (Math.PI * 2 + sj) - rayInc; j += rayInc) {
        let p = {x: 0, y: 0, h: j};
        let jj = j - sj;
        metaV[indMetaV] = [];
        for (let i = 0; i < (num / amountRays); i += 1) {
//             let a = 0;
//             let l = 1;
//             p = ro(a, l, p.x * 1, p.y * 1, p.h);
//             p.x += xOffset * 0.95;
//             p.y += yOffset * 0.95;
//             let ppx = cos(t * 2e6) * 50;
//             let ppy = sin(t * 2e6) * 50;
//             p.x = ppx * 1;
//             p.y = ppy * 1;
            let x = fullArr[ink].x;
            let y = fullArr[ink].y;
            p.x = tan(x * 2.05) * 0.49;
            p.y = tan(y * 2.05) * 0.49;
            nextArr[ink] = {x: p.x, y: p.y};
            ink++;
            var sc = 0.01 * (1 / cos(t * 4e5));
            sc = 15.5 * 0.75;
            metaV[indMetaV].push(p.y * 0.35 * 1.5 * sc, p.x * 0.8 * sc,  14.0, 0.9);
            numV += 1;
        }
        indMetaV++;
    }
    for (let i = 0; i < num; i++) {
        fullArr[i] = {x: nextArr[i].x, y: nextArr[i].y};
    }
    let flatV = [];
    for (let j = 0; j < metaV[0].length; j += 4) {
        for (let i = 0; i < metaV.length; i++) {
            flatV.push(metaV[i][j], metaV[i][j + 1], metaV[i][j + 2], metaV[i][j+3]);
        }
    }
    vertices = flatV;
    for (let i = 0; i < vertices.length; i++) {
        dots.push(vertices[i] * 2);
    }
}