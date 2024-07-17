(
v.set(\trigGate, 0, \gate, 0, \fadeTime, 1);
v = {
    | trigGate = 1 |
    var tr = In.kr(~cb, 2) * trigGate;
    var dd = Demand.kr(tr[0], 0, Dseq([1]));
    var t = tr[1] * dd;
    var b = t * Demand.kr(t, 0, Dseq([1, 0, 0, 0], inf));
    var d = t * Demand.kr(t, 0, Dseq([0, 0, 0, 0, 1, 0, 0, 0], inf));
     var melo2 = Demand.kr(t, 0, Dseq([0, -5, -2, -7].stutter(16*2), inf));
    var melo = Demand.kr(t, 0, Dseq([0, 2, 3, 7].stutter(2), inf) + Dseq([0, -12], inf)) + melo2;
    var drr = Demand.kr(t, 0, Dseq([34, 36], inf));
    var m = Demand.kr(t, 0, Dseq([0.35, 0.4], inf));
    var m2 = Demand.kr(t, 0, Dseq([0.5, 0.1], inf));
    var e = EnvGen.kr(Env([0,1,0],[0.01, 0.5], [0, -4]), gate: t);
    var sig = MiBraids.ar(
        pitch: ~toMidi.("B5") + -12 + [melo + 12, melo2 - 24 - 12, melo2 - 24 - 12 + 0.1],
        timbre: 0.75*e.lag(0.01), color: 0.285, model: 14
    );
    var bass = [sig[1], sig[2]];
    var drums = MiBraids.ar(
        pitch: 79 - 36 - 0,
        timbre: 0.75, color: 0.5, model: 34, trig: b
    ) * dd.lag(0.05);
    var sna = MiBraids.ar(
        pitch: 79,
        timbre: 0.25, color: 0.2, model: 36, trig: d, resamp: 2, decim: 2, bits: 0
    ) * dd.lag(0.05) * 1;
        drums = drums + (MiPlaits.ar(
        pitch: 79 - 24,    engine: 15,
        harm: m,      timbre: 1,     morph: m,
        trigger: t,   level: t.lag(0.1) * m2 * 2,
        fm_mod: 0,    timb_mod: 0,     morph_mod: 0
    )[0] * 0.4 * 0);
    sig = [sig[0] + sig[1], sig[0] + sig[2]];
    sig = ~v.(sig, 9000 * e + 100);
    sig = ~v.(sig, 500, 0, 5);
    sig = MiVerb.ar(sig + (sna*0.5), time: 0.7, drywet: 0.5, damp: 0.1);
    // sig = ~v.(sig, 1500, 0, 1);
    bass = VAKorg35.ar(bass, 1000, 0, 1, 0) * 0.5;
    sig = sig * 0.5 + ~v.(bass*1, 500) * 1 + (drums*2+(sna)) * 0.1 * 2 * dd.lag(0.05);
}.play(fadeTime: 0);
)



(
v.set(\trigGate, 0, \gate, 0, \fadeTime, 1);
v = {
    | trigGate = 1 |
    var tr = In.kr(~cb, 2) * trigGate;
    var dd = Demand.kr(tr[0], 0, Dseq([1]));
    var t = tr[1] * dd;
    var b = t * Demand.kr(t, 0, Dseq([1, 0, 0, 0], inf));
    var d = t * Demand.kr(t, 0, Dseq([0, 0, 0, 0, 1, 0, 0, 0], inf));
     var melo2 = Demand.kr(t, 0, Dseq([0, -5, -2, -7].stutter(16*2), inf));
    var melo = Demand.kr(t, 0, Dseq([0, 2, 3, 7].stutter(2), inf) + Dseq([0, -12], inf)) + melo2;
    var drr = Demand.kr(t, 0, Dseq([34, 36], inf));
    var m = Demand.kr(t, 0, Dseq([0.35, 0.4], inf));
    var m2 = Demand.kr(t, 0, Dseq([0.5, 0.1], inf));
    var e = EnvGen.kr(Env([0,1,0],[0.01, 0.5], [0, -4]), gate: t);
    var sig = MiBraids.ar(
        pitch: ~toMidi.("B5") + -12 + [melo + 12, melo2 - 24 - 12, melo2 - 24 - 12 + 0.1],
        timbre: 0.75*e.lag(0.01), color: 0.285, model: 14
    );
    var bass = [sig[1], sig[2]];
    var drums = MiBraids.ar(
        pitch: 79 - 36 - 0,
        timbre: 0.75, color: 0.5, model: 34, trig: b
    ) * dd.lag(0.05);
    var sna = MiBraids.ar(
        pitch: 79,
        timbre: 0.25, color: 0.2, model: 36, trig: d, resamp: 2, decim: 2, bits: 0
    ) * dd.lag(0.05) * 1;
        drums = drums + (MiPlaits.ar(
        pitch: 79 - 24,    engine: 15,
        harm: m,      timbre: 1,     morph: m,
        trigger: t,   level: t.lag(0.1) * m2 * 2,
        fm_mod: 0,    timb_mod: 0,     morph_mod: 0
    )[0] * 0.4 * 0);
    sig = [sig[0] + sig[1], sig[0] + sig[2]];
    sig = ~v.(sig, 9000 * e + 100);
    sig = ~v.(sig, 500, 0, 5);
    sig = MiVerb.ar(sig + (sna*0.5), time: 0.7, drywet: 0.5, damp: 0.1);
    // sig = ~v.(sig, 1500, 0, 1);
    bass = VAKorg35.ar(bass, 1000, 0, 1, 0) * 0.5;
    sig = ~v.(bass*1, 500) * 1 + (drums*2+(sna)) * 0.1 * 2 * dd.lag(0.05);
}.play(fadeTime: 0);
)


(
x.free;
x = {
    var input = Impulse.ar(\scratch.kr(1));
    var b = \bright.kr(0.5);
    var scratch = MiRings.ar(input,
        pit: ~toMidi.("B3"), struct: 0.25, bright: 0.4,
        damp: 0.1, pos: 0.125, model: 4
    );
    var sig = MiWarps.ar(
    scratch, scratch, b, 0.25, 
    algo: 1, timb: 0.25, osc: 0, 
    freq:~toFreq.("E2"),
        vgain: 1, easteregg: 0);
        sig = [sig[0][0], sig[1][0]];
    // sig = VadimFilter.ar(sig, 100, 0, 5);
    // sig = sig + (scratch);
    // sig = ~v.(sig, 1000, 0, 5);
    sig = MiClouds.ar(
        inputArray: sig, pit: 0, pos: 0,
        size: 0, dens: 0.01, tex: 0.25,
        drywet: 0.75, in_gain: 1, spread: 0,
        rvb: 0.8, fb: 0, freeze: 0,
        mode: 1, lofi: 0
    );
    sig * 0.5;
}.play;
)


(
x.free;
x = {    
    | trigGate = 1 |
    var tr = In.kr(~cb, 2) * trigGate;
    var dd = Demand.kr(tr[0], 0, Dseq([1]));
    var t = tr[1] * dd;
    var d = t * Demand.kr(t, 0, Dseq([0, 0, 0, 0, 1, 0, 0, 0], inf));
     var melo2 = Demand.kr(t, 0, Dseq([0, 2, 5, 3].stutter(16*2), inf));
    var input = Impulse.ar(\scratch.kr(1));
    var b = \bright.kr(0.5);
    var scratch = MiRings.ar(input,
        pit: ~toMidi.("B3")+melo2, struct: 0.25, bright: b,
        damp: 0.1, pos: 0.125, model: 3
    );
    var sig = MiWarps.ar(
    scratch, scratch, b, 0.25, 
    algo: 1, timb: 0.25, osc: 0, 
    freq:~toFreq.("E2"),
        vgain: 1, easteregg: 0);
        sig = [sig[0][0], sig[1][0]];
    // sig = VadimFilter.ar(sig, 100, 0, 5);
    // sig = sig + (scratch);
    // sig = ~v.(sig, 1000, 0, 5);
    sig = MiClouds.ar(
        inputArray: sig, pit: 0, pos: 0,
        size: 0, dens: 0.01, tex: 0.25,
        drywet: 0.75, in_gain: 1, spread: 0,
        rvb: 0.8, fb: 0, freeze: 0,
        mode: 1, lofi: 0
    );
    sig * 0.5;
}.play;
)


(
x.free;
x = {    
    | trigGate = 1 |
    var tr = In.kr(~cb, 2) * trigGate;
    var dd = Demand.kr(tr[0], 0, Dseq([1]));
    var t = tr[1] * dd;
    var d = t * Demand.kr(t, 0, Dseq([0, 0, 0, 0, 1, 0, 0, 0], inf));
     var melo2 = Demand.kr(t, 0, Dseq([0, -5, -2, -7].stutter(16*2), inf));
    var input = Impulse.ar(\scratch.kr(1));
    var b = \bright.kr(0.5);
    var scratch = MiRings.ar(input,
        pit: ~toMidi.("B3")+melo2, struct: 0.25, bright: b,
        damp: 0.1, pos: 0.125, model: 4
    );
    var sig = MiWarps.ar(
    scratch, scratch, b, 0.25, 
    algo: 1, timb: 0.25, osc: 0, 
    freq:~toFreq.("E2"),
        vgain: 1, easteregg: 0);
        sig = [sig[0][0], sig[1][0]];
    // sig = VadimFilter.ar(sig, 100, 0, 5);
    // sig = sig + (scratch);
    // sig = ~v.(sig, 1000, 0, 5);
    sig = MiClouds.ar(
        inputArray: sig, pit: 0, pos: 0,
        size: 0, dens: 0.01, tex: 0.25,
        drywet: 0.75, in_gain: 1, spread: 0,
        rvb: 0.8, fb: 0, freeze: 0,
        mode: 1, lofi: 0
    );
    sig * 0.5;
}.play;
)



(
x.free;
x = {    
    | trigGate = 1 |
    var tr = In.kr(~cb, 2) * trigGate;
    var dd = Demand.kr(tr[0], 0, Dseq([1]));
    var t = tr[1] * dd;
    var d = t * Demand.kr(t, 0, Dseq([0, 0, 0, 0, 1, 0, 0, 0], inf));
     var melo2 = Demand.kr(t, 0, Dseq([0, 2, 5, 3].stutter(16*2), inf));
    var input = Impulse.ar(\scratch.kr(1));
    var b = \bright.kr(0.5);
    var scratch = MiRings.ar(input,
        pit: ~toMidi.("B5")+melo2, struct: 0, bright: b*2,
        damp: 0.5, pos: b, model: 2
    );
    var sig;
    scratch = VadimFilter.ar(scratch, 2000, 0, 5);
    sig = MiWarps.ar(
    scratch, DelayN.ar(scratch,1,0.01), b*8, 0.5, 
    algo: 2, timb: 0.25, osc: 0, 
    freq:~toFreq.("E2"),
        vgain: 1, easteregg: 0);
        sig = [sig[0][0], sig[1][0]];
    // sig = VadimFilter.ar(sig, 100, 0, 5);
    // sig = sig + (scratch);
    // sig = ~v.(sig, 1000, 0, 5);
    sig = MiClouds.ar(
        inputArray: sig, pit: 0, pos: 0,
        size: 0, dens: 0.01, tex: 0.25,
        drywet: 0.75, in_gain: 1, spread: 0,
        rvb: 0.8, fb: 0, freeze: 0,
        mode: 1, lofi: 0
    );
    sig * 0.5;
}.play;
)