$(function() {



    // speak in mictophone and listen 
    navigator.getUserMedia = ( navigator.getUserMedia ||
                               navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia ||
                               navigator.msGetUserMedia);
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function(callback, element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
    window.AudioContext = (function(){
        return  window.webkitAudioContext || window.AudioContext || window.mozAudioContext;
    })();

    // Global Variables for Audio
    var audioContext;
    var analyserNode;
    var javascriptNode;
    var sampleSize = 1024;  // number of samples to collect before analyzing
                            // decreasing this gives a faster sonogram, increasing it slows it down
    var amplitudeArray;     // array to hold frequency data
    var audioStream;
    // Global Variables for Drawing
    var column = 0;
    var canvasWidth  = 800;
    var canvasHeight = 256;
    var ctx;
    $(document).ready(function() {
        ctx = $("#canvas").get()[0].getContext("2d");
        try {
            audioContext = new AudioContext();
        } catch(e) {
            alert('Web Audio API is not supported in this browser');
        }
        // When the Start button is clicked, finish setting up the audio nodes, and start
        // processing audio streaming in from the input device
        $("#start_button").click(function(e) {
            e.preventDefault();
            clearCanvas();
            // get the input audio stream and set up the nodes
            try {
                navigator.getUserMedia(
                  { video: false,
                    audio: true},
                  setupAudioNodes,
                  onError);
            } catch (e) {
                alert('webkitGetUserMedia threw exception :' + e);
            }
        });
        // Stop the audio processing
        $("#stop_button").click(function(e) {
            e.preventDefault();
            javascriptNode.onaudioprocess = null;
            if(audioStream) audioStream.stop();
            if(sourceNode)  sourceNode.disconnect();
        });
    });
    var range = {value: 10};
    
    function setupAudioNodes(stream) {

        var source = audioCtx.createMediaStreamSource(stream);
        audioStream = stream;
        // Create a biquadfilter
        var biquadFilter = audioCtx.createBiquadFilter();
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 1000;
        biquadFilter.gain.value = range.value;

        // socket.emit('audioStream', biquadFilter);
        // socket.emit('audioStream', JSON.stringify(stream));
        
        source.connect(biquadFilter);
        biquadFilter.connect(audioCtx.destination);
        // biquadFilter.start();
    }

    function onError(e) {
        console.log(e);
    }

    socket.on('audioStream2', function(stream) {
        var audioCtx = new AudioContext();
        var source = audioCtx.createBufferSource();
        source.connect(stream);
        stream.connect(audioCtx.destination);
    });

    function drawTimeDomain() {
        var minValue = 9999999;
        var maxValue = 0;
        for (var i = 0; i < amplitudeArray.length; i++) {
            var value = amplitudeArray[i] / 256;
            if(value > maxValue) {
                maxValue = value;
            } else if(value < minValue) {
                minValue = value;
            }
        }
        var y_lo = canvasHeight - (canvasHeight * minValue) - 1;
        var y_hi = canvasHeight - (canvasHeight * maxValue) - 1;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(column,y_lo, 1, y_hi - y_lo);
        // loop around the canvas when we reach the end
        column += 1;
        if(column >= canvasWidth) {
            column = 0;
            clearCanvas();
        }
    }
    function clearCanvas() {
        column = 0;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // ctx.beginPath();
        ctx.strokeStyle = '#f00';
        var y = (canvasHeight / 2) + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth-1, y);
        ctx.stroke();
    }







    // Play an audio file kept at server

    window.AudioContext = (function(){
      return  window.webkitAudioContext || window.AudioContext ;
    })();
    // Global variables
    var audioContext;
    var audioBuffer = 0;
    // var audioUrl = "/assets/Doctor_Who_theme_excerpt.ogg";
    var audioUrl = "/static/horse.ogg";
    
    $(document).ready(function() {
        // check that your browser supports the API
        try {
            // the AudioContext is the primary container for all audio  objects
            audioContext = new AudioContext();
        }
        catch(e) {
            alert('Web Audio API is not supported in this browser');
        }
        load_audio(audioUrl);
        $("#play_button").click(function(e) {
            e.preventDefault();
            // setTimeout(function() {
            //     play_audio(audioBuffer);
            // }, 1000);
           play_audio(audioBuffer);
        });
    });
    // load the sound from a URL
    function load_audio(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        // When loaded decode the data and store the audio buffer in memory
        request.onload = function() {
            audioContext.decodeAudioData(request.response, function(buffer) {
                audioBuffer = buffer;
                // Blob(buffer);
                // socket.emit('audioStream', new Blob(buffer));
            }, onError);
        }
        request.send();
    }
    function play_audio(buffer) {
        var audioSourceNode = audioContext.createBufferSource();
        audioSourceNode.buffer = audioBuffer;
        audioSourceNode.connect(audioContext.destination);
        audioSourceNode.start();
        // audioSourceNode.noteOn(0);
    }

    // log if an error occurs
    function onError(e) {
        console.log(e);
    }







    // create a audioBuffer and play
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // var button = document.querySelector('button');
    var button = document.getElementById('buttonId');
    // var pre = document.querySelector('pre');
    // var myScript = document.querySelector('script');

    // pre.innerHTML = myScript.innerHTML;

    // Stereo
    var channels = 2;
    // Create an empty two second stereo buffer at the
    // sample rate of the AudioContext
    var frameCount = audioCtx.sampleRate * 2.0;

    var myArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);

    button.onclick = function() {
      // Fill the buffer with white noise;
      //just random values between -1.0 and 1.0
      for (var channel = 0; channel < channels; channel++) {
       // This gives us the actual ArrayBuffer that contains the data
       var nowBuffering = myArrayBuffer.getChannelData(channel);
       for (var i = 0; i < frameCount; i++) {
         // Math.random() is in [0; 1.0]
         // audio needs to be in [-1.0; 1.0]
         nowBuffering[i] = Math.random() * 2 - 1;
       }
      }

      // Get an AudioBufferSourceNode.
      // This is the AudioNode to use when we want to play an AudioBuffer
      var source = audioCtx.createBufferSource();
      // set the buffer in the AudioBufferSourceNode
      source.buffer = myArrayBuffer;
      // connect the AudioBufferSourceNode to the
      // destination so we can hear the sound
      source.connect(audioCtx.destination);
      // start the source playing
      source.start();
    }


});