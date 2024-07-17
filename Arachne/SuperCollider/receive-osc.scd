s.boot;
(
x.free;
x = {
    var input = Impulse.ar(\scratch.kr(1));
    var scratch = MiRings.ar(input,
        pit: 70, struct: 0.85, bright: 0.5,
        damp: 0.6, pos: 0.125, model: 4
    );
    var sig = MiWarps.ar(
    scratch, scratch, 0.75, 0.5, 
    algo: 0, timb: 0.3, osc: 2, 
    freq: (23 + 12).midicps,
        vgain: 1, easteregg: 0);
    // sig = VadimFilter.ar(sig, 12000, 0, 1);
    sig = sig + scratch;
    sig = MiClouds.ar(
        inputArray: sig, pit: 0, pos: 0,
        size: 0, dens: 0.01, tex: 0.25,
        drywet: 0.75, in_gain: 1, spread: 0,
        rvb: 0.8, fb: 0, freeze: 0,
        mode: 1, lofi: 0
    );
    sig;
}.play;
)

x.set(\scratch, 10)

(
OSCdef.new(
    \fromnode,
    {
        arg msg, time, addr, port;
        // [msg, time, addr, port].postln;
        // msg[1].postln;
        x.set(\scratch, msg[1] * 300);
        x.set(\bright, msg[1]*2);
        // x.set(\scratch, pow(msg[1]*20,5) * 30);
        // d = Synth.new(\pinkTest, [\frequency, msg[1] * 2]);
        // d = Synth.new(\pulseTest, [\frequency, msg[1] * 0.5]);
    },
    '/hello/from/oscjs'
);
)



(
x.free;
x = {
    var input = Impulse.ar(\scratch.kr(1));
    var scratch = MiRings.ar(input,
        pit: ~toMidi.("B1"), struct: 0.25, bright: \bright.kr(0.5),
        damp: 0.6, pos: 0.125, model: 4
    );
    var sig = MiWarps.ar(
    scratch, scratch, 0.25, 0.5, 
    algo: 1, timb: 0.25, osc: 0, 
    freq:~toFreq.("E2"),
        vgain: 1, easteregg: 0);
        sig = [sig[0][0], sig[1][0]];
    // sig = VadimFilter.ar(sig, 100, 0, 5);
    // sig = sig + (scratch);
    sig = ~v.(sig, 100, 0, 5);
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