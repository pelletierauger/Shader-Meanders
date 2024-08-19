s.boot;
s.quit
~toOSC = NetAddr.new("127.0.0.1", 57121);    // create the NetAddr
~toOSC.sendMsg("/hello", "there");    // send the application the message "hello" with the parameter "there"
~clock7 = TempoClock.new(80/60).permanent_(true);
s.mute;
s.unmute;

~reverbBus = Bus.audio(s, 2);
(
~reverb.set(\gate, 0, \fadeTime, 0.1);
~reverb = {
    | freeze = 0 |
    var in = In.ar(~reverbBus, 2);
    var sig = MiClouds.ar(
        inputArray: in, pit: 0, pos: 0,
        size: 0, dens: 0.01, tex: 0.25,
        drywet: 0.75, in_gain: 1, spread: 0,
        rvb: 0.8, fb: 0, freeze: freeze,
        mode: 1, lofi: 0
    );
    sig;
}.play;
)
~reverb.set(\freeze, 0)
(
SynthDef.new(\pizzicato, {
    arg note = 24, amp = 1, mult = 1, pan = 0;
    var f = note.midicps * 8;
    var env = EnvGen.kr(Env.new([0, 1, 0.0125, 0], [0.01, 0.9, 4], [3, -3, -3]), doneAction: 2);
    var env2 = Env.new([0, 1, 0], [0.01, 4], [3, -7]).kr;
    var env3 = Env.new([0, 1, 0], [0.0001, 0.025], [3, -7]).kr;
    var pEnv = Env.new([0.9, 1], [0.15], [3]).kr;
    var lfo = SinOsc.ar(4, [0, pi]).range(0.5, 1);
    var op4 = SinOsc.ar(f * 0.0625) * env3 * 10;
    var op3 = SinOsc.ar(f * 1, lfo * 12);
    var op2 = SinOsc.ar(f * 1, op4 * 12 + (op3 * 4) * (1 - env2)) * env2;
    var op5 = SinOscFB.ar(f * 0.25, 0.125) * 2;
    var op1 = SinOsc.ar(f * [1, 1.001] * 0.5, op2 * mult + op4 + op5) * lfo * 0.1;
    var op6 = SinOsc.ar(f * 0.25) * 0.1;
    var sig = op1 + op6 * env * amp;
    sig = sig * LFTri.ar(f * 0.5).range(0.92, 1);
    sig = Balance2.ar(sig[0], sig[1], pan, 1);
    sig = sig + (LPF.ar(sig, 110) * 12) + (LPF.ar(sig, 55) * 24);
    Out.ar(0, sig);
}).add;
)

(
SynthDef.new(\pizzicato, {
    arg note = 24, amp = 1, mult = 1, pan = 0;
    var env = EnvGen.kr(Env.new([0, 1, 0.06, 0], [0.01, 0.6, 12], [3, -3, -3]), doneAction: 2);
    var sig = MiBraids.ar(note+12, timbre: 0.75, color: 0.1, model: 3) * 0.1 * env;
    // sig = ~v.(sig, 1000, 0, 3);
    Out.ar(0, sig!2);
}).add;
)

(
SynthDef.new(\pizzicato, {
    arg note = 24, amp = 1, mult = 1, pan = 0;
    var env = EnvGen.kr(Env.new([0, 1, 0.06, 0], [0.01, 0.6, 12], [3, -3, -3]), doneAction: 2);
    var sig = MiBraids.ar(note+12, timbre: 0.5, color: 0.1, model: 17) * 0.1 * env;
    // sig = ~v.(sig, 1000, 0, 3);
    Out.ar(0, sig!2);
}).add;
)

(
SynthDef.new(\pizzicato, {
    arg note = 24, amp = 1, mult = 1, pan = 0;
    var env = EnvGen.kr(Env.new([0, 1, 0.06, 0], [0.01, 0.6, 2], [3, -3, -3]), doneAction: 2);
    var sig = MiRings.ar(
        in: 0, trig: Impulse.kr(1/64), pit: note, struct: 0.25,
        bright: 0.75, damp: 0.85, pos: 0.4, model: 4, poly: 0,
        intern_exciter: 1,
        easteregg: 0
    );
    // sig = ~v.(sig, 1000, 0, 3);
    Out.ar(~reverbBus, sig[0]!2);
    // Out.ar(0, sig[0]!2* 0.1);
}).add;
)

(
SynthDef.new(\pizzicato, {
    arg note = 24, amp = 1, mult = 1, pan = 0;
    var env = EnvGen.kr(Env.new([0, 1, 0.06, 0], [0.01, 0.6, 2], [3, -3, -3]), doneAction: 2);
    var sig = MiRings.ar(
        in: 0, trig: Impulse.kr(1/64), pit: note+12, struct: 0.1,
        bright: 0.75, damp: 0.25, pos: 0.4, model: 2, poly: 0,
        intern_exciter: 1,
        easteregg: 0
    );
    sig = ~v.(sig, 4000, 0, 5)*2;
    Out.ar(~reverbBus, sig[0]!2 * 4);
    Out.ar(0, sig[0]!2* 0.2);
}).add;
)

(
x.free;
x = {
var sig = MiRings.ar(
in: 0,
        pit: ~toMidi.("A6")
);
sig = sig + SinOsc.ar(220, mul: 0.3);
sig * 0.1!2;
}.play;
)

~toMidi.("A3")+12
Synth.new(\pizzicato, [\note, ~toMidi.("A3")+12])

~clock7.beatDur*7/2
~clock7.tempo*7/2
~clock7.tempo/7/2
~toMidi.("A0")
(
~b.free;
~b = {
    var melo = Demand.kr(Impulse.kr(~clock7.tempo/7*2), 0, Dseq([7,3,0,2],inf));
    var note = ~toMidi.("A1") + melo;
    var sig = MiPlaits.ar(pitch: note, engine: 2, 
    harm: 0.25, timbre: 0.25, morph: 0.25);
    sig[0] * 0.6!2;
}.play;
)

(
~b.free;
~b = {
    var t = Impulse.kr(~clock7.tempo/7*2);
    var melo = Demand.kr(t, 0, Dseq([7,3,0,2],inf));
    var melo2 = Demand.kr(t, 0, Dseq([8,7,10,5],inf));
    var note = ~toMidi.("A1") + [melo, melo2 + 48];
    var sig = MiPlaits.ar(pitch: note, engine: [2, 9], 
    harm: [0.25, 0.7], timbre:[0.25, 0.2], morph: [0.25, 0.7]);
    var bass = sig[0][0] * 0.6;
    var pad = sig[1][0] * 4;
    // (bass + pad) ! 2;
    Out.ar(0, bass ! 2);
    Out.ar(~reverbBus, pad ! 2);
}.play;
)

(
~b.free;
~b = {
    var melo = Demand.kr(Impulse.kr(~clock7.tempo/7*2), 0, Dseq([7,3,0,2],inf));
    var trig = Impulse.kr(~clock7.tempo*2*2);
    var note = ~toMidi.("A1") + melo;
    var sig = MiPlaits.ar(pitch: note, engine: 2, 
    harm: 0.5, timbre: 0.25, morph: 0.5,
    trigger: trig, decay: 0.4);
    sig[0] * 0.6!2;
}.play;
)


(
SynthDef.new(\bass, {
    arg note = 24, amp = 1, mult = 1, pan = 0;
    var env = EnvGen.kr(Env.new([0, 1, 1, 0], [0.01, 2.625, 0.01], [3, -3, -3]), doneAction: 2);
    var sig = MiBraids.ar(note+12+12, timbre: 0.25, color: 0.5, model: 4) * 0.8 * env;
    // sig = ~v.(sig, 1000, 0, 1);
    Out.ar(0, sig!2);
}).add;
)

(
SynthDef.new(\kick, {
    arg note = 24, amp = 1, mult = 1, pan = 0;
    var env = EnvGen.kr(Env.new([0, 1, 0.9, 0], [0.01, 0.6, 4], [3, -3, -3]), doneAction: 2);
    var sig = MiBraids.ar(note+12, timbre: 0.75, color: 0.5, model: 33) * 4 * env;
    // sig = ~v.(sig, 1000, 0, 1);
    Out.ar(~reverbBus, sig!2 *0.01);
}).add;
)

(
SynthDef.new(\kick, {
    arg note = 24, amp = 1, mult = 1, pan = 0;
    var env = EnvGen.kr(Env.new([0, 1, 0.9, 0], [0.01, 0.6, 4], [3, -3, -3]), doneAction: 2);
    var sig = MiBraids.ar(note+12, timbre: 0.25, color: 0.95, model: 36) * 4 * env;
    // sig = ~v.(sig, 1000, 0, 1);
    Out.ar(~reverbBus, sig!2 * 0.3);
}).add;
)

(
SynthDef.new(\hats, {
    arg note = 24, amp = 1, mult = 1, pan = 0;
    var env = EnvGen.kr(Env.new([0, 1, 0.01, 0], [0.005, 0.05, 0.5], [3, -3, -3]), doneAction: 2);
    var sig = WhiteNoise.ar(0.05) * env;
    sig = ~v.(sig, 6000, 0, 5) * 4;
    Out.ar(0, sig!2);
}).add;
)

Synth.new(\kick);

(
var melody = Pseq((0..6), inf).asStream;
~pizziPattern.stop;
~pizziPattern = Pbind(
    \instrument, \pizzicato,
    \dur, 0.5,
    \amp, 0.01,
    \mult, 2.85,
    \freq, FuncStream({
    var f = melody.next;
        ~toOSC.sendMsg("/frequency", f);
        ~toMidi.("A1") + f;
        Rest();
    })
).play(~clock7);
~pizziPattern2.stop;
~pizziPattern2 = Pbind(
    \instrument, \pizzicato,
    \dur, Pseq([1,0.5,0.5,1,1,0.5,0.5,1,1] * 0.5, inf),
    \amp, 1,
    \mult, 2.85,
    \note, ~toMidi.("A4") + Pseq([0, 0, -2, 0, 0, 0, -2, 0, 1], inf)
).play(~clock7);
// ~bassPattern.stop;
// ~bassPattern = Pbind(
//     \instrument, \bass,
//     \dur, Pseq([7] * 0.5, inf),
//     \amp, 1,
//     \mult, 2.85,
//     \note, ~toMidi.("A0") + Pseq([7, 3, 0, 2], inf)
// ).play(~clock7);
~kickPattern.stop;
~kickPattern = Pbind(
    \instrument, \kick,
    \dur, Pseq([1.5, 1.5, 1.5, 1.5, 1] * 0.5, inf),
    \amp, 1,
    \mult, 2.85,
    \note, ~toMidi.("A0")
).play(~clock7);
// ~hatsPattern.stop;
// ~hatsPattern = Pbind(
//     \instrument, \hats,
//     \dur, Pseq([0.5] * 0.5, inf),
//     \amp, 1,
//     \mult, 2.85,
//     \note, ~toMidi.("A0")
// ).play(~clock7);
)

(
~pizziPattern.stop;
~pizziPattern2.stop;
~bassPattern.stop;
~kickPattern.stop;
~hatsPattern.stop;
)

~toFreq.("E0")