$(function() {
    var audio = document.querySelector('audio');
    var audio2 = document.querySelector('#audio2');
    var oldUrl = ''; 
    var newUrl = '';
    var oldBlob = null;
    var blob = null;
    var player = 1;

    var intervalManager = null;
    var audioStartButton = document.querySelector('#audio-start-btn');
    var audioStopButton = document.querySelector('#audio-stop-btn');
    var soundClips = document.querySelector('#soundClips');
    var mediaRecorder = null;
    var chunks = [];

    var audioSuccess = function(stream) {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      console.log(Date.now());
      audioStartButton.style.background = "red";
      audioStartButton.style.color = "black";

      mediaRecorder.onstop = function(e) {
        console.log('recording stopped !!');
        console.log(Date.now());
        
        var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        
        // emit blob
        socket.emit('audioStream', blob);
        console.log('send!!');
        console.log(Date.now());
        chunks = [];
      }

      mediaRecorder.ondataavailable = function(e) {
        console.log('recording..')
        chunks.push(e.data);
      }

      intervalManager = setInterval(function() {
        if(player == 1) {
          player = 2;
          audio.src = newUrl;
        }
        else {
          player = 1;
          audio2.src = newUrl;
        }
        // audio.src = newUrl;
        console.log('play started !!');
        console.log(Date.now());

        mediaRecorder.stop();
        console.log(Date.now());
        console.log('recording started !!');
        mediaRecorder.start();
        // console.log('recording started !!')
        // console.log(Date.now());
      }, 1500);

    }

    var audioError = function(err) {
      console.log('The following error occured: ' + err);
    }

    function initAudioChat() {
        navigator.getUserMedia = (navigator.getUserMedia ||
                                  navigator.mozGetUserMedia ||
                                  navigator.msGetUserMedia ||
                                  navigator.webkitGetUserMedia);

        if (navigator.getUserMedia) {
          // var chunks = [];
          navigator.getUserMedia({audio: true}, audioSuccess, audioError);
        } else {
           console.log('getUserMedia not supported on your browser!');
        }
    }

    audioStartButton.onclick = function() {
      initAudioChat();
    };

    audioStopButton.onclick = function() {
      clearInterval(intervalManager);
      mediaRecorder.stop();
      mediaRecorder = null;

      console.log("recorder stopped");
      console.log(Date.now());
      audioStartButton.style.background = "";
      audioStartButton.style.color = "";
      // mediaRecorder.requestData();
    };

    socket.on('audioStreamS', function(arrayBuffer) {
        console.log("stream received !!");
        console.log(Date.now());

        oldUrl = newUrl;
        oldBlob = blob;
        blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
        newUrl = window.URL.createObjectURL(blob); 
    })

});