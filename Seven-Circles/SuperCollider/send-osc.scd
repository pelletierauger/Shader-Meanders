s.boot;
~toOSC = NetAddr.new("127.0.0.1", 57121);    // create the NetAddr
~toOSC.sendMsg("/hello", "there");    // send the application the message "hello" with the parameter "there"

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
~clock7.beatDur*7/2
(
SynthDef.new(\bass, {
    arg note = 24, amp = 1, mult = 1, pan = 0;
    var env = EnvGen.kr(Env.new([0, 1, 1, 0], [0.01, 2.625, 0.01], [3, -3, -3]), doneAction: 2);
    var sig = MiBraids.ar(note+12+12, timbre: 0.25, color: 0.5, model: 4) * 0.8 * env;
    // sig = ~v.(sig, 1000, 0, 1);
    Out.ar(0, sig!2);
}).add;
)
s.mute;
s.unmute;
(
SynthDef.new(\kick, {
    arg note = 24, amp = 1, mult = 1, pan = 0;
    var env = EnvGen.kr(Env.new([0, 1, 0.9, 0], [0.01, 0.6, 4], [3, -3, -3]), doneAction: 2);
    var sig = MiBraids.ar(note+12+12, timbre: 0.5, color: 0.5, model: 33) * 1 * env;
    // sig = ~v.(sig, 1000, 0, 1);
    Out.ar(0, sig!2);
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
Synth.new(\kick)

~clock7 = TempoClock.new(80/60).permanent_(true);
~clock7
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
~bassPattern.stop;
~bassPattern = Pbind(
    \instrument, \bass,
    \dur, Pseq([7] * 0.5, inf),
    \amp, 1,
    \mult, 2.85,
    \note, ~toMidi.("A0") + Pseq([7, 3, 0, 2], inf)
).play(~clock7);
~kickPattern.stop;
~kickPattern = Pbind(
    \instrument, \kick,
    \dur, Pseq([1.5, 1.5, 1.5, 1.5, 1] * 0.5, inf),
    \amp, 1,
    \mult, 2.85,
    \note, ~toMidi.("A0")
).play(~clock7);
~hatsPattern.stop;
~hatsPattern = Pbind(
    \instrument, \hats,
    \dur, Pseq([0.5] * 0.5, inf),
    \amp, 1,
    \mult, 2.85,
    \note, ~toMidi.("A0")
).play(~clock7);
)

(
~pizziPattern.stop;
~pizziPattern2.stop;
~bassPattern.stop;
~kickPattern.stop;
~hatsPattern.stop;
)