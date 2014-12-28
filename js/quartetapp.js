// app.js

// ‘Anything … may happen. A “mistake” is beside the point, for once anything happens it authentically is.’
//   from:
// ‘Composition: To Describe the Process of Composition Used in Music of Changes and Imaginary Landscape No. 4’
// Silence, 1961

// TODO: add ember for quiz?

// TODO: http://www.tulane.edu/~rscheidt/rcc_calendar.html ?
// TODO: http://freemusicarchive.org/api ?

var gBirds = new PlaceTimeBirdSongs();

// GLOBAL initialize audio context and listener
window.AudioContext = window.AudioContext||window.webkitAudioContext;
var gAudioContext = new AudioContext();
var gListener = gAudioContext.listener;
var gLastActionTime = gAudioContext.currentTime;

gListener.dopplerFactor = 1;
gListener.speedOfSound = 343.3;
gListener.setOrientation(0,0,-1,0,1,0);

// GLOBAL sound sources for bird song playback
gBirdSongPlayers = [];
gBirdSongPlayers[0] = new BirdSongPlayer(gAudioContext, 'volumeMeter0');
gBirdSongPlayers[1] = new BirdSongPlayer(gAudioContext, 'volumeMeter1');
gBirdSongPlayers[2] = new BirdSongPlayer(gAudioContext, 'volumeMeter2');
gBirdSongPlayers[3] = new BirdSongPlayer(gAudioContext, 'volumeMeter3');

function resetLastActionTime() {
	gLastActionTime = gAudioContext.currentTime;
}

$(document).ready(function(){ 
	// does the initial url have a saved session?
	if (window.location.href.split('#')[1]) {
		console.log('document ready! ' + window.location.href.split('#')[1]);

		// restore from session
		$.getJSON('/saved/' + window.location.href.split('#')[1], function(data) {
			console.log('retrieved saved session data');
			console.log(data);
			gBirdSongPlayers[0].initializeFromSavedSession(data.savedPlayer[0], '#player0');
			gBirdSongPlayers[1].initializeFromSavedSession(data.savedPlayer[1], '#player1');
			gBirdSongPlayers[2].initializeFromSavedSession(data.savedPlayer[2], '#player2');
			gBirdSongPlayers[3].initializeFromSavedSession(data.savedPlayer[3], '#player3');
		}.bind(this))
		.fail(function(e) {
			console.log("failure to get saved session");
			console.log(e);
			$('#sightings').text('error while retrieving saved session');
		});

	} else {
		console.log('document ready without saved session!');

		gBirds.setLocation({ coords: { latitude: 48.856667, longitude: 2.350987 }}, function(position) {
			$('#position').text(Math.round(position.coords.latitude * 100) / 100.0 + '°, ' + Math.round(position.coords.longitude * 100) / 100.0 + '°');

			gBirds.getSightings(function() {
				for (var i = 0; i < gBirdSongPlayers.length; i++) {
					gBirdSongPlayers[i].chooseSightingAndPlayRandomSound('#player' + i);
				}
			});
		});
	}


	// TODO: can we incorporate the vocoder demo?

	$('#playbackRates').click(function(e) {
		console.log('RANDOMIZE PLAYBACK RATES');
		resetLastActionTime();

		for (var i = 0; i < gBirdSongPlayers.length; i++) {
			gBirdSongPlayers[i].randomizePlaybackRate('#player' + i);
		}
	});

	$('#panners').click(function(e) {
		console.log('RANDOMIZE PANNERS');
		resetLastActionTime();

		for (var i = 0; i < gBirdSongPlayers.length; i++) {
			gBirdSongPlayers[i].randomizePanner('#player' + i);
		}
	});

	$('#reverse').click(function(e) {
		console.log('REVERSE PLAYBACK');
		resetLastActionTime();

		for (var i = 0; i < gBirdSongPlayers.length; i++) {
			gBirdSongPlayers[i].reversePlayback('#player' + i);
		}
	});

	$('#share').click(function(e) {
		console.log('SHARE');
		resetLastActionTime();

		// TODO: put up alert asking user to type description?

		var savedState = {};
		savedState.savedPlayer = [
				gBirdSongPlayers[0].saveData(),
				gBirdSongPlayers[1].saveData(),
				gBirdSongPlayers[2].saveData(),
				gBirdSongPlayers[3].saveData()
			]

		$.post(
			"/share", 
			savedState,
			function(data, status) {
				console.log('success sharing');
				console.log(data);
				// TODO: put up floating alert with URL to copy
			},
			'json');		
	});

	$('#recording0').click(function(e) {
		gBirdSongPlayers[0].chooseRandomRecording('#player0');
		resetLastActionTime();
	});
	$('#recording1').click(function(e) {
		gBirdSongPlayers[1].chooseRandomRecording('#player1');
		resetLastActionTime();
	});
	$('#recording2').click(function(e) {
		gBirdSongPlayers[2].chooseRandomRecording('#player2');
		resetLastActionTime();
	});
	$('#recording3').click(function(e) {
		gBirdSongPlayers[3].chooseRandomRecording('#player3');
		resetLastActionTime();
	});

	$('#nextSighting0').click(function(e) {
		gBirdSongPlayers[0].chooseSightingAndPlayRandomSound('#player0');
		resetLastActionTime();
	});
	$('#nextSighting1').click(function(e) {
		gBirdSongPlayers[1].chooseSightingAndPlayRandomSound('#player1');
		resetLastActionTime();
	});
	$('#nextSighting2').click(function(e) {
		gBirdSongPlayers[2].chooseSightingAndPlayRandomSound('#player2');
		resetLastActionTime();
	});
	$('#nextSighting3').click(function(e) {
		gBirdSongPlayers[3].chooseSightingAndPlayRandomSound('#player3');
		resetLastActionTime();
	});

	window.setInterval(function() {
		// TODO: call "update last action" method from each button above or other event handler
		// TODO: that function should set a global that holds the last active time
		// TODO: here, compare that stashed time to current time
		// TODO: if it exceeds threshold, do something and update last action
		// console.log('last action ' + gLastActionTime + ', currently ' + gAudioContext.currentTime);
	}, 1000);
});



