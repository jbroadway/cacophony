// Effects to render a scene from [Three.js](http://github.com/mrdoob/three.js/).

var three_camera, three_scene, three_renderer, three_func, three_args, three_int, three_is_on;

// Turn on and render a scene from Three.js.
// TODO: Transparent background.
//
// Usage:
//
//     {a:'three_on', d:{func:three_demo, arg1:'foo', arg2:'bar'}}
function three_on (data) {
	func = data.func;
	three_args = data;
	three_is_on = true;
	three_func = func;

	cacophony.visible ([0, 0, 0, 0, 1, 0]);

	if (! three_camera) {
		three_camera = new THREE.Camera (75, cacophony.width / cacophony.height, 1, 10000);
		three_camera.position.z = 1000;

		three_scene = new THREE.Scene ();

		three_renderer = new THREE.CanvasRenderer ();
		three_renderer.setSize (cacophony.width, cacophony.height);
		$('#cacophony-canvas4').append (three_renderer.domElement);
	}

	three_int = setInterval (three_loop, 1000 / 60);
}

// Demo function to show how to use Three.js with Cacophony.
// Use this as a basis for writing your own Three.js code that
// will work in your video.
function three_demo (data) {
	for (var i = 0; i < 1000; i++) {
		var particle = new THREE.Particle (new THREE.ParticleCircleMaterial (Math.random () * 0x808008 + 0x808080, 1));
		particle.position.x = Math.random () * 2000 - 1000;
		particle.position.y = Math.random () * 2000 - 1000;
		particle.position.z = Math.random () * 2000 - 1000;
		particle.scale.x = particle.scale.y = Math.random () * 10 + 5;
		three_scene.addObject (particle);
	}
}

// Handles the Three.js loop for updating the scene.
function three_loop () {
	if (! cacophony.playing) {
		return;
	}
	three_func (three_args);
	three_renderer.render (three_scene, three_camera);
}

// Turn off Three.js.
//
// Usage:
//
//     {a:'three_off'}
function three_off () {
	three_is_on = false;
	clearInterval (three_int);
	cacophony.visible ([1, 1, 0, 0, 0, 0]);
}

// Register all effects.
_e['three_on'] = three_on;
_e['three_off'] = three_off;
