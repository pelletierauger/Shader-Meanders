(
SynthDef.new(\pizzicato, {
    arg note = 24, amp = 1, mult = 1, pan = 0;
    var env = EnvGen.kr(Env.new([1, 1, 0], [4, 0.1], [3, -3]), doneAction: 2);
    var sig = MiRings.ar(
        in: 0, trig: Impulse.kr(1/64), pit: note, struct: 0.25,
        bright: 0.75, damp: 0.75, pos: 0.5, model: 5, poly: 0,
        intern_exciter: 1,
        easteregg: 0
    ) * env * 0.5;
    // sig = ~v.(sig, 1000, 0, 3);
    Out.ar(~reverbBus, sig[0]!2);
    // Out.ar(0, sig[0]!2* 0.1);
}).add;
)


(
~b.free;
~b = {
    var melo = Demand.kr(Impulse.kr(~clock7.tempo/7*2), 0, Dseq([7,3,0,2],inf));
    var note = ~toMidi.("A2") + melo;
    var sig = MiPlaits.ar(pitch: note, engine: 2, 
    harm: 0.25, timbre: 0.25, morph: 0.25);
    sig[1] * 0.6!2;
}.play;
)