<?php

define ('MAPS_HOST', 'maps.google.com');
define ('MAPS_KEY', 'ABQIAAAA8oxhOW0OuVL7dPs4Xkh0FxRvJVnkLNdpEf6fKeR6yTI37veTuRSqglJggDbFdnmRhdZMe8I6dkn_TA');

function coords ($city) {
	$maps_request = 'http://' . MAPS_HOST . '/maps/geo?output=json&key=' . MAPS_KEY . '&sensor=false&q=' . urlencode ($city);
	$response = file_get_contents ($maps_request);
	$info = json_decode ($response);
	if (is_object ($info) && is_array ($info->Placemark)) {
		return array (
			$info->Placemark[0]->address,
			$info->Placemark[0]->Point->coordinates[1],
			$info->Placemark[0]->Point->coordinates[0]
		);
	}
	return array ('Not Found', 0, 0);
}

$found = false;

$cities = json_decode (file_get_contents ('cities.json'));
if (! is_array ($cities)) {
	$cities = array ();
}
list ($city, $lat, $lng) = coords ($_REQUEST['input']);
foreach ($cities as $k => $c) {
	if ($city == $c->name) {
		$c->count++;
		$found = true;
		break;
	}
}
if (! $found) {
	$c = new StdClass;
	$c->name = $city;
	$c->count = 1;
	$c->lat = $lat;
	$c->lng = $lng;
	$cities[] = $c;
}
file_put_contents ('cities.json', json_encode ($cities));

?>