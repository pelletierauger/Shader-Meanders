fullArr = [];
nextArr = [];
for (let i = 0 ; i < 30000; i++) {
    fullArr.push([Math.cos(i) * i, Math.sin(i)]);
    nextArr.push([0, 0]);
}

expandingUniverse = function(selectedProgram) {
    let vertices = [];
    let num = 20000;
    let amountRays = 120;
    amountRays = 3;
    let sj = 0;
    let rayInc = Math.PI * 2 / amountRays;
    let metaV = [];
    let indMetaV = 0;
    let ink = 0;
    for (let j = sj; j < (Math.PI * 2 + sj) - rayInc; j += rayInc) {
        let p = [0, 0];
        metaV[indMetaV] = [];
        for (let i = 0; i < (num / amountRays); i += 1) {
            let x = fullArr[ink][0];
            let y = fullArr[ink][1];
            p[0] = Math.tan(x * 2.05) * 0.49;
            p[1] = Math.tan(y * 2.05) * 0.49;
            nextArr[ink] = [p[0], p[1]];
            ink++;
            metaV[indMetaV].push(p[1] * 6.1, p[0] * 9.3);
        }
        indMetaV++;
    }
    for (let i = 0; i < num; i++) {
        fullArr[i] = [nextArr[i][0], nextArr[i][1]];
    }
    let flatV = [];
    for (let j = 0; j < metaV[0].length; j += 2) {
        for (let i = 0; i < metaV.length; i++) {
            flatV.push(metaV[i][j], metaV[i][j + 1]);
        }
    }
    vertices = flatV;
    for (let i = 0; i < vertices.length; i++) {
        dots.push(vertices[i] * 2);
    }
}