// app.js

// TODO: add ember for quiz?

var gBirds = new PlaceTimeBirdSongs();

// GLOBAL sound sources for bird song playback
var soundSources = [];
var panners = [];

// GLOBAL initialize audio context
window.AudioContext = window.AudioContext||window.webkitAudioContext;
var audioContext = new AudioContext();

// GLOBAL initialize listener
var listener = audioContext.listener;
listener.dopplerFactor = 1;
listener.speedOfSound = 343.3;
listener.setOrientation(0,0,-1,0,1,0);

gBirdSongPlayers = [];
gBirdSongPlayers[0] = new BirdSongPlayer(audioContext);
gBirdSongPlayers[1] = new BirdSongPlayer(audioContext);
gBirdSongPlayers[2] = new BirdSongPlayer(audioContext);
gBirdSongPlayers[3] = new BirdSongPlayer(audioContext);

function chooseRandomRecording(soundsData, playerIndex) {
	if (soundsData == null || soundsData.recordings.length == 0) {
		$('#status' + playerIndex).text('retrying');
		console.log('FAILED loading recording for player ' + playerIndex + ', retrying');
		chooseBird(playerIndex);
	}

	var randomRecordingID = Math.floor(Math.random() * soundsData.recordings.length);

	var currentSound = soundsData.recordings[randomRecordingID];

	console.log(currentSound);
	$('#label' + playerIndex).text(currentSound.en);

	var soundURL = currentSound.file.replace('http://www.xeno-canto.org','/soundfile');
	console.log(soundURL);

	gBirdSongPlayers[playerIndex].setBufferFromURL(soundURL, $('#status' + playerIndex))
}

function chooseBird(inPlayerIndex) {
	var sighting = gBirds.chooseRandomSighting();
	console.log('chooseBird random sighting ' + sighting);
	console.log(gBirds.sightings[sighting]);

	// get sounds for this species if needed, and pick one at random
	gBirds.getSoundsForSighting(sighting, function(soundsData) {
		if (soundsData == null) {
			console.log('NO SOUNDS');
			$('#status' + inPlayerIndex).text('retrying');
			chooseBird(inPlayerIndex);
		} else {
			$('#label' + inPlayerIndex).text(gBirds.sightings[sighting].comName);
			chooseRandomRecording(soundsData, inPlayerIndex);
		}
	});	
}

$(document).ready(function(){ 
	gBirds.setLocation({ coords: { latitude: 37, longitude: -122 }}, function(position) {
		gBirds.getSightings(function() {
			chooseBird(0);
			chooseBird(1);
			chooseBird(2);
			chooseBird(3);
		});
	});

	// TODO: can we play sounds backwards
	// TODO: can we incorporate the vocoder demo?

	$('#playbackRates').click(function(e) {
		console.log('RANDOMIZE PLAYBACK RATES');

		gBirdSongPlayers[0].randomizePlaybackRate();		
		gBirdSongPlayers[1].randomizePlaybackRate();		
		gBirdSongPlayers[2].randomizePlaybackRate();		
		gBirdSongPlayers[3].randomizePlaybackRate();		
	});

	$('#panners').click(function(e) {
		console.log('RANDOMIZE PANNERS');

		gBirdSongPlayers[0].randomizePanner();
		gBirdSongPlayers[1].randomizePanner();
		gBirdSongPlayers[2].randomizePanner();
		gBirdSongPlayers[3].randomizePanner();
	});

	window.setInterval(function() {
		console.log('WAKEY');
	}, 5000);

});



