(
    if(~crushedNoise.isPlaying, {~crushedNoise.set(\trigGate, 0, \gate, 0, \fadeTime, 0.1)});
    ~crushedNoise = {
        | trigGate = 1 |
        var sig, env, delrd, r, n;
        var br = \lfp.kr(1);
        sig = MiBraids.ar(
            pitch: 10,
            timbre: br * 2,
            color: 0.2,
            model: 37,
            resamp: 2,
            decim: 32*br,
            bits: br*10,
            ws: 1,
        );
        sig = VadimFilter.ar(sig, min(15000, 5000 + (br * 15000)), 0, 1);
        sig = ~v.(sig, 2200, 0, 5) * 16 * min(0.5, br);
        sig = MiClouds.ar(
            inputArray: sig, pit: 0, pos: 0,
            size: 0, dens: 0.01, tex: 0.5,
            drywet: 0.125, in_gain: 1, spread: 1,
            rvb: 1, fb: 0.5, freeze: 0,
            mode: 1, lofi: 0
        );
        sig;
    }.play(fadeTime: 0.01).register;
)

(
OSCdef.new(
    \fromnode,
    {
        arg msg, time, addr, port;
        // [msg, time, addr, port].postln;
        // msg[1].postln;
        // x.set(\scratch, msg[1] * 300);
        // x.set(\bright, msg[1]*2);
        ~crushedNoise.set(\lfp, msg[1]);
        // x.set(\scratch, pow(msg[1]*20,5) * 30);
        // d = Synth.new(\pinkTest, [\frequency, msg[1] * 2]);
        // d = Synth.new(\pulseTest, [\frequency, msg[1] * 0.5]);
    },
    '/hello/from/oscjs'
);
)


(
    if(~crushedNoise.isPlaying, {~crushedNoise.set(\trigGate, 0, \gate, 0, \fadeTime, 0.1)});
    ~crushedNoise = {
        | trigGate = 1 |
        var sig, env, delrd, r, n;
        var br = \lfp.kr(1);
        sig = MiBraids.ar(
            pitch: ~toMidi.("B2"),
            timbre: br * 0.5,
            color: 0.9,
            model: 37,
            resamp: 2,
            decim: 32*br,
            bits: br*1,
            ws: 1,
        );
        sig = VadimFilter.ar(sig, min(15000, 5000 + (br * 15000)), 0, 1);
        // sig = ~v.(sig, 2200, 0, 5) * 16 * min(0.5, br);
        sig = sig * 0.25 * min(0.5, br * 4);
        sig = MiClouds.ar(
            inputArray: sig, pit: 0, pos: 0,
            size: 0, dens: 0.01, tex: 0.5,
            drywet: 0.125, in_gain: 1, spread: 1,
            rvb: 1, fb: 0.5, freeze: 0,
            mode: 1, lofi: 0
        );
        sig;
    }.play(fadeTime: 0.01).register;
)


(
    if(~crushedNoise.isPlaying, {~crushedNoise.set(\trigGate, 0, \gate, 0, \fadeTime, 0.1)});
    ~crushedNoise = {
        | trigGate = 1 |
        var sig, env, delrd, r, n;
        var br = \lfp.kr(1);
        sig = MiBraids.ar(
            pitch: ~toMidi.("B2"),
            timbre: br * 2,
            color: 0.0,
            model: 37,
            resamp: 2,
            decim: 32*br,
            bits: br*1,
            ws: 1,
        );
        sig = VadimFilter.ar(sig, min(15000, 5000 + (br * 15000)), 0, 1);
        // sig = ~v.(sig, 2200, 0, 5) * 16 * min(0.5, br);
        sig = sig * 0.25 * min(0.5, br * 4);
        sig = MiClouds.ar(
            inputArray: sig, pit: 0, pos: 0,
            size: 0, dens: 0.01, tex: 0.5,
            drywet: 0.125, in_gain: 1, spread: 1,
            rvb: 1, fb: 0.7, freeze: 0,
            mode: 1, lofi: 0
        );
        sig;
    }.play(fadeTime: 0.01).register;
)