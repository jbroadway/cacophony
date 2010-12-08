// A generic image slideshow effect.

var slideshow_duration = 4,
	slideshow_limit = false,
	slideshow_cur = 0,
	slideshow_n = 0,
	slideshow_images = [],
	slideshow_front_img,
	slideshow_back_img,
	slideshow_front_burns,
	slideshow_back_burns;

// Make the calculations for performing the Ken Burns effect on an image
// in the slideshow. Based on the Ken Burns implementation at
// [Adventures in Software](http://adventuresinsoftware.com/blog/?p=209).
function slideshow_burns (proportion) {
	proportion = (isNaN (proportion)) ? 1.5 : proportion;
	var burns = {
		_x0: 0,
		_x1: 0,
		_y0: 0,
		_y1: 0,
		_w0: 0,
		_w1: 0,
		_h0: 0,
		_h1: 0,
		apply: function (img, time) {
			time *= .02;
			img.x = (this._x0 - this._x1) * time - this._x0;
			img.y = (this._y0 - this._y1) * time - this._y0;
			img.dWidth = (this._w1 - this._w0) * time + this._w0;
			img.dHeight = (this._h1 - this._h0) * time + this._h0;
		}
	};

	// Choose rectangles based on more constrained dimension.
	if (proportion < cacophony.width / cacophony.height) {
		burns._w0 = cacophony.width * (1 + (.25 * Math.random ()));
		burns._w1 = cacophony.width * (1 + (.25 * Math.random ()));
		burns._h0 = burns._w0 / proportion;
		burns._h1 = burns._w1 / proportion;
	} else {
		burns._h0 = cacophony.height * (1 + (.25 * Math.random ()));
		burns._h1 = cacophony.height * (1 + (.25 * Math.random ()));
		burns._w0 = burns._h0 * proportion;
		burns._w1 = burns._h1 * proportion;
	}

	// Calculate the translation to keep image within window.
	burns._x0 = (burns._w0 - cacophony.width) * Math.random ();
	burns._x1 = (burns._w1 - cacophony.width) * Math.random ();
	burns._y0 = (burns._h0 - cacophony.height) * Math.random ();
	burns._y1 = (burns._h1 - cacophony.height) * Math.random ();

	return burns;
}

// Used by `slideshow()` to perform the timeout work.
function slideshow_step () {
	if (! cacophony.playing) {
		setTimeout (slideshow_step, (cacophony.beatLength () * slideshow_duration) / 25);
		return;
	}

	slideshow_n++;

	if (slideshow_n == 20) {
		slideshow_cur++;

		if (slideshow_images[slideshow_cur]) {
			slideshow_front_img = new ImageNode (slideshow_images[slideshow_cur]);
			slideshow_front_burns = slideshow_burns (slideshow_front_img.width / slideshow_front_img.height);
			slideshow_front_img.opacity = 0;
			slideshow_front_burns.apply (slideshow_front_img, -5);
			cacophony.canvas.append (slideshow_front_img);
		}
	} else if (slideshow_n == 25) {
		cacophony.canvas.remove (slideshow_back_img);
		slideshow_back_img = slideshow_front_img;
		slideshow_back_burns = slideshow_front_burns;
		if (slideshow_back_img) {
			slideshow_back_img.opacity = 1;
		}
		slideshow_front_img = null;
		slideshow_front_burns = null;
		slideshow_n = 0;
	} else if (slideshow_n > 20) {
		if (slideshow_front_img) {
			slideshow_front_img.opacity += .2;
			slideshow_front_burns.apply (slideshow_front_img, slideshow_n - 25);
		}
		slideshow_back_img.opacity -= .2;
	}

	if (slideshow_back_img) {
		slideshow_back_burns.apply (slideshow_back_img, slideshow_n);

		setTimeout (slideshow_step, (cacophony.beatLength () * slideshow_duration) / 25);
	}
}

// Display a slideshow based on a list of images. Effects include:
//
// * burns - Ken Burns effect
// * slide - Slide images in from a random side
// * offset - Slide left but pause at various offsets
//
// Usage:
//
//     {a:'slideshow', d:{
//         images: ['pix/one.png', 'pix/two.png', 'pix/three.png', 'pix/four.png'],
//         duration: 8,
//         limit: 10,
//         effect: 'burns'
//     }}
function slideshow (data) {
	if (data) {
		slideshow_cur = 0;
		slideshow_limit = (data.limit) ? data.limit : false;
		slideshow_duration = (data.duration) ? data.duration : 4;
		slideshow_images = [];
		for (var i = 0; i < data.images.length; i++) {
			if (slideshow_limit && i == slideshow_limit) {
				break;
			}
			slideshow_images[i] = _i[data.images[i]];
		}
	}

	slideshow_n = 0;
	slideshow_back_img = new ImageNode (slideshow_images[0]);
	slideshow_back_burns = slideshow_burns (slideshow_back_img.width / slideshow_back_img.height);
	slideshow_back_img.opacity = 1;
	slideshow_back_burns.apply (slideshow_back_img, slideshow_n);
	cacophony.canvas.append (slideshow_back_img);

	slideshow_step ();
}

_e['slideshow'] = slideshow;
