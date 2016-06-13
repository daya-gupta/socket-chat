$(function() {
    var audio = document.querySelector('audio');
    var oldUrl = ''; 
    var newUrl = '';
    var blob = null;

    var intervalTemp = null;
    var record = document.querySelector('#audio-start-btn');
    var stop = document.querySelector('#audio-stop-btn');
    var soundClips = document.querySelector('#soundClips');

    function audioChat() {
        navigator.getUserMedia = (navigator.getUserMedia ||
                                  navigator.mozGetUserMedia ||
                                  navigator.msGetUserMedia ||
                                  navigator.webkitGetUserMedia);


        if (navigator.getUserMedia) {
          console.log('getUserMedia supported.');

          var constraints = { audio: true };
          var chunks = [];

          var onSuccess = function(stream) {
            var mediaRecorder = new MediaRecorder(stream);

            // visualize(stream);

            record.onclick = function() {
              mediaRecorder.start();
              record.style.background = "red";
              record.style.color = "black";

              intervalTemp = setInterval(function() {
                mediaRecorder.stop();
                console.log('recording stopped !!');
                console.log(Date.now());

                if(audio.scr !== newUrl) {
                    audio.src = newUrl;
                    console.log('play started !!');
                    console.log(Date.now());
                }
                mediaRecorder.start();
                console.log('recording started !!')
                console.log(Date.now());

              }, 1500);
              
            }

            stop.onclick = function() {
              clearInterval(intervalTemp);
              mediaRecorder.stop();

              console.log("recorder stopped");
              console.log(Date.now());
              record.style.background = "";
              record.style.color = "";
              // mediaRecorder.requestData();
            }

            mediaRecorder.onstop = function(e) {
              var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
              chunks = [];
              console.log('send!!');
              console.log(Date.now());

              // emit blob
              socket.emit('audioStream', blob);
            }

            mediaRecorder.ondataavailable = function(e) {
              chunks.push(e.data);
            }
          }

          var onError = function(err) {
            console.log('The following error occured: ' + err);
          }

          navigator.getUserMedia(constraints, onSuccess, onError);
        } else {
           console.log('getUserMedia not supported on your browser!');
        }
    }
    audioChat();

    socket.on('audioStreamS', function(arrayBuffer) {
        console.log("stream received !!");
        console.log(Date.now());

        oldUrl = newUrl;
        blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
        newUrl = window.URL.createObjectURL(blob); 
        
    })

});