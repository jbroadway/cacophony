// Effects for controlling volume.

var volume_fade_to = 0.1,
	volume_fade_amt = 0.1,
	volume_fade_dur = 0.1;

// Set the volume of the audio.
//
// Usage:
//
//     {a:'set_volume', d:0.7}
function set_volume (v) {
	cacophony.setVolume (v);
}

// Fade the volume of the audio over the specified number
// of beats.
//
// Usage:
//
//     {a:'volume_fade', d:{to:0.7, duration:4}}
function volume_fade (data) {
	if (data) {
		volume_fade_dur = (data.duration) ? cacophony.beatLength () * data.duration : cacophony.beatLength ();
		volume_fade_to = data.to;
		volume_fade_amt = (cacophony.getVolume () - data.to) / 10;
	}

	if (! cacophony.playing) {
		setTimeout (volume_fade, volume_fade_dur / 10);
		return;
	}

	cacophony.setVolume (cacophony.getVolume () - volume_fade_amt);
	if (Math.round (cacophony.getVolume () * 100) != (volume_fade_to * 100)) {
		setTimeout (volume_fade, volume_fade_dur / 10);
	}
}

// Register all effects.
_e['set_volume'] = set_volume;
_e['volume_fade'] = volume_fade;
