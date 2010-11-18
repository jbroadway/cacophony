// Using Three.js to render a spinning cube

var three_c, three_last_y, three_last_dir = 1.5;

// Usage:
//
//     {a:'three_on', d:{func:three_cube, colour:[.2, .2, .25, 1]}}
function three_cube (data) {
	if (! three_c) {
		var colour, geometry;
		colour = (data.colour) ? data.colour : [.2, .2, .25, 1];
		geometry = new Cube (800, 600, 800);
		for (var i = 0; i < geometry.faces.length; i++) {
			geometry.faces[i].color.setRGBA (colour[0], colour[1], colour[2], colour[3]);
		}

		three_c = new THREE.Mesh (geometry, new THREE.MeshFaceColorFillMaterial ());

		three_scene.addObject (three_c);
		three_last_y = three_c.rotation.y;
	} else if (three_c.rotation.y == three_last_y) {
		three_c.rotation.y += 0.01 * three_last_dir;
		three_last_y = three_c.rotation.y;
	}
}

cacophony.mousemove (function () {
	if (! three_is_on || ! three_c) {
		return;
	}

	var dir;

	if (cacophony.mousex < cacophony.width / 2) {
		dir = cacophony.width / 2 - cacophony.mousex;
		three_c.rotation.y -= dir * 0.0003;
		three_last_dir = -1.5;
	} else {
		dir = cacophony.mousex - cacophony.width / 2;
		three_c.rotation.y += dir * 0.0003;
		three_last_dir = 1.5;
	}
	three_last_y = three_c.rotation.y;
});
