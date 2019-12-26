
/*
Copyright (c) 2019 Thomas Lehmann

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the “Software”),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

import { whiteNoiseGenerator } from "./whiteNoiseGenerator.js";

const HUMAN_VOICE_FREQ = 500;
const HUMAN_VOICE_GAIN = 12;
const HUMAN_VOICE_Q_FACTOR = 0.5;

const HUMAN_VOICE_LOWPASS_CORNER_FREQ = 2000;

/**
 * Noise generator encapsulating the Web Audio API to provide a
 * speech blocking noise generator.
 *
 * This is not an optimized implementation yet.
 */
export class SpeechBlocker {
	constructor() {
		const ctx = this.ctx = new AudioContext();

		this.noise = whiteNoiseGenerator(ctx);
		this.peaking = ctx.createBiquadFilter();
		this.lowpass = ctx.createBiquadFilter();
		this.gain = ctx.createGain();

		this.noise.connect(this.peaking);
		this.peaking.connect(this.lowpass);
		this.lowpass.connect(this.gain);
		this.gain.connect(ctx.destination);

		this.peaking.type = "peaking";
		this.peaking.frequency.value = HUMAN_VOICE_FREQ;
		this.peaking.gain.value = HUMAN_VOICE_GAIN;
		this.peaking.Q.value = HUMAN_VOICE_Q_FACTOR;

		this.lowpass.type = "lowpass";
		this.lowpass.frequency.value = HUMAN_VOICE_LOWPASS_CORNER_FREQ;

		this.setVolume(0.2);
	}

	/**
	 * Set the volume
	 *
	 * @param {Number} newVolume the valume (0-1)
	 */
	setVolume(newVolume) {
		this.gain.gain.value = newVolume;
	}

	/**
	 * Mute ouput by disconnecting nodes from the destination
	 */
	mute() {
		this.gain.disconnect(this.ctx.destination)
	}


	/**
	 * Unmute ouput by connecting nodes from the destination
	 */
	unmute() {
		this.gain.connect(this.ctx.destination)
	}
}
