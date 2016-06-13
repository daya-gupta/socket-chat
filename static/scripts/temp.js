// // speak in mictophone and listen 
//     navigator.getUserMedia = ( navigator.getUserMedia ||
//                                navigator.webkitGetUserMedia ||
//                                navigator.mozGetUserMedia ||
//                                navigator.msGetUserMedia);
//     window.requestAnimFrame = (function(){
//       return  window.requestAnimationFrame       ||
//               window.webkitRequestAnimationFrame ||
//               window.mozRequestAnimationFrame    ||
//               function(callback, element){
//                 window.setTimeout(callback, 1000 / 60);
//               };
//     })();
//     window.AudioContext = (function(){
//         return  window.webkitAudioContext || window.AudioContext || window.mozAudioContext;
//     })();

//     // Global Variables for Audio
//     var audioContext;
//     var analyserNode;
//     var javascriptNode;
//     var sampleSize = 1024;  // number of samples to collect before analyzing
//                             // decreasing this gives a faster sonogram, increasing it slows it down
//     var amplitudeArray;     // array to hold frequency data
//     var audioStream;
//     // Global Variables for Drawing
//     var column = 0;
//     var canvasWidth  = 800;
//     var canvasHeight = 256;
//     var ctx;


//     var audioInput = null,
//         realAudioInput = null,
//         inputPoint = null,
//         audioRecorder = null;
//     var rafID = null;
//     var analyserContext = null;
//     var canvasWidth, canvasHeight;
//     var recIndex = 0;
//     $(document).ready(function() {
//         ctx = $("#canvas").get()[0].getContext("2d");
//         try {
//             audioContext = new AudioContext();
//         } catch(e) {
//             alert('Web Audio API is not supported in this browser');
//         }
//         // When the Start button is clicked, finish setting up the audio nodes, and start
//         // processing audio streaming in from the input device
//         $("#audio-start-btn").click(function(e) {
//             e.preventDefault();
//             clearCanvas();
//             // get the input audio stream and set up the nodes
//             try {
//                 navigator.getUserMedia(
//                   { video: false,
//                     audio: true},
//                   setupAudioNodes,
//                   onError);
//             } catch (e) {
//                 alert('webkitGetUserMedia threw exception :' + e);
//             }
//         });
//         // Stop the audio processing
//         $("#audio-stop-btn").click(function(e) {
//             e.preventDefault();
//             javascriptNode.onaudioprocess = null;
//             if(audioStream) audioStream.stop();
//             if(sourceNode)  sourceNode.disconnect();
//         });
//     });
//     var range = {value: 10};
    
//     function setupAudioNodes(stream) {
//         // var audio = document.querySelector('audio')

//         // var source = audioCtx.createMediaStreamSource(stream);
//         // audio.src = window.URL.createObjectURL(stream);
//         // audioStream = stream;
        

//             inputPoint = audioContext.createGain();

//             // Create an AudioNode from the stream.
//             realAudioInput = audioContext.createMediaStreamSource(stream);
//             audioInput = realAudioInput;
//             audioInput.connect(inputPoint);

//         //    audioInput = convertToMono( input );

//             analyserNode = audioContext.createAnalyser();
//             analyserNode.fftSize = 2048;
//             inputPoint.connect( analyserNode );

//             audioRecorder = new Recorder( inputPoint );

//             zeroGain = audioContext.createGain();
//             zeroGain.gain.value = 0.0;
//             inputPoint.connect( zeroGain );
//             zeroGain.connect( audioContext.destination );
//             updateAnalysers();
//     }

//     function updateAnalysers(time) {
//         if (!analyserContext) {
//             var canvas = document.getElementById("analyser");
//             canvasWidth = canvas.width;
//             canvasHeight = canvas.height;
//             analyserContext = canvas.getContext('2d');
//         }

//         // analyzer draw code here
//         {
//             var SPACING = 3;
//             var BAR_WIDTH = 1;
//             var numBars = Math.round(canvasWidth / SPACING);
//             var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

//             analyserNode.getByteFrequencyData(freqByteData); 

//             analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
//             analyserContext.fillStyle = '#F6D565';
//             analyserContext.lineCap = 'round';
//             var multiplier = analyserNode.frequencyBinCount / numBars;

//             // Draw rectangle for each frequency bin.
//             for (var i = 0; i < numBars; ++i) {
//                 var magnitude = 0;
//                 var offset = Math.floor( i * multiplier );
//                 // gotta sum/average the block, or we miss narrow-bandwidth spikes
//                 for (var j = 0; j< multiplier; j++)
//                     magnitude += freqByteData[offset + j];
//                 magnitude = magnitude / multiplier;
//                 var magnitude2 = freqByteData[i * multiplier];
//                 analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
//                 analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
//             }
//         }
        
//         rafID = window.requestAnimationFrame( updateAnalysers );
//     }

//     $('#record').click(toggleRecording);

//     function toggleRecording( ) {
//         e = this;
//         if (e.classList.contains("recording")) {
//             // stop recording
//             audioRecorder.stop();
//             e.classList.remove("recording");
//             audioRecorder.getBuffers( gotBuffers );
//         } else {
//             // start recording
//             if (!audioRecorder)
//                 return;
//             e.classList.add("recording");
//             audioRecorder.clear();
//             audioRecorder.record();
//         }
//     }

//     function gotBuffers( buffers ) {
//         console.log(buffers);

//             var blob = new Blob([buffers]);
//             console.log(blob)
//             socket.emit('audioStream', blob);


//             // var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//             // // audioCtx.decodeAudioData(buffers, function(buffer) {
//             // //     console.log(buffer);
//             // // });

//             // var frameCount = audioCtx.sampleRate * 10.0;

//             // var myArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);

//             // var myBuffer = myArrayBuffer.getChannelData(0);
//             // var myBuffer1 = myArrayBuffer.getChannelData(1);

//             // for(var i = 0; i < buffers[0].length; i++) {
//             //     myBuffer[i] = buffers[0][i];
//             //     // myBuffer[i] = Math.abs(buffers[0][i] * 5) > 1 ? Math.random()*2 - 1 : buffers[0][i] * 5;
//             //     // console.log(myBuffer[i]);
//             //     // console.log(buffers[0][i]*5);
//             // }
//             // for(var i = 0; i < buffers[0].length; i++) {
//             //     myBuffer1[i] = buffers[1][i];
//             //     // myBuffer1[i] = Math.abs(buffers[1][i] * 5) > 1 ? Math.random()*2 - 1 : buffers[1][i] * 5;
//             // }

//             // // myBuffer = buffers[0];
//             // // myBuffer1 = buffers[1];

//             // var source = audioCtx.createBufferSource();
//             // source.buffer = myArrayBuffer;
//             // source.connect(audioCtx.destination);
//             // source.start();
            
            

//             // // create a audioBuffer and play
//             // var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//             // // var button = document.querySelector('button');
//             // var button = document.getElementById('buttonId');
//             // // var pre = document.querySelector('pre');
//             // // var myScript = document.querySelector('script');

//             // // pre.innerHTML = myScript.innerHTML;

//             // // Stereo
//             // var channels = 2;
//             // // Create an empty two second stereo buffer at the
//             // // sample rate of the AudioContext
//             // var frameCount = audioCtx.sampleRate * 4.0;

//             // var myArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);

//             //   // Fill the buffer with white noise;
//             //   //just random values between -1.0 and 1.0
//             //   for (var channel = 0; channel < channels; channel++) {
//             //    // This gives us the actual ArrayBuffer that contains the data
//             //    var nowBuffering = myArrayBuffer.getChannelData(channel);
//             //    for (var i = 0; i < frameCount; i++) {
//             //      // Math.random() is in [0; 1.0]
//             //      // audio needs to be in [-1.0; 1.0]
//             //      nowBuffering[i] = Math.random() * 2 - 1;
//             //    }
//             //   }

//             //   console.log(myArrayBuffer);
//             //   // Get an AudioBufferSourceNode.
//             //   // This is the AudioNode to use when we want to play an AudioBuffer
//             //   var source = audioCtx.createBufferSource();
//             //   // set the buffer in the AudioBufferSourceNode
//             //   source.buffer = myArrayBuffer;
//             //   // connect the AudioBufferSourceNode to the
//             //   // destination so we can hear the sound
//             //   source.connect(audioCtx.destination);
//             //   // start the source playing
//             //   source.start();

//               // var source = audioCtx.createBufferSource();
//               // source.buffer = myArrayBuffer;
//               // source.connect(audioCtx.destination);
//               // source.start();





//         // var canvas = document.getElementById( "wavedisplay" );

//         // drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );

//         // the ONLY time gotBuffers is called is right after a new recording is completed - 
//         // so here's where we should set up the download.
//         // audioRecorder.exportWAV( doneEncoding );
//     }

//     function doneEncoding( blob ) {
//         Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
//         recIndex++;
//     }

//     function onError(e) {
//         console.log(e);
//     }

//     // socket.on('audioStream2', function(stream) {
//     //     var audioCtx = new AudioContext();
//     //     var source = audioCtx.createBufferSource();
//     //     source.connect(stream);
//     //     stream.connect(audioCtx.destination);
//     // });

//     function drawTimeDomain() {
//         var minValue = 9999999;
//         var maxValue = 0;
//         for (var i = 0; i < amplitudeArray.length; i++) {
//             var value = amplitudeArray[i] / 256;
//             if(value > maxValue) {
//                 maxValue = value;
//             } else if(value < minValue) {
//                 minValue = value;
//             }
//         }
//         var y_lo = canvasHeight - (canvasHeight * minValue) - 1;
//         var y_hi = canvasHeight - (canvasHeight * maxValue) - 1;
//         ctx.fillStyle = '#ffffff';
//         ctx.fillRect(column,y_lo, 1, y_hi - y_lo);
//         // loop around the canvas when we reach the end
//         column += 1;
//         if(column >= canvasWidth) {
//             column = 0;
//             clearCanvas();
//         }
//     }
//     function clearCanvas() {
//         column = 0;
//         ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//         // ctx.beginPath();
//         ctx.strokeStyle = '#f00';
//         var y = (canvasHeight / 2) + 0.5;
//         ctx.moveTo(0, y);
//         ctx.lineTo(canvasWidth-1, y);
//         ctx.stroke();
//     }







//     // Play an audio file kept at server

//     window.AudioContext = (function(){
//       return  window.webkitAudioContext || window.AudioContext ;
//     })();
//     // Global variables
//     var audioContext;
//     var audioBuffer = 0;
//     // var audioUrl = "/static/horse.ogg";
//     var audioUrl = "/static/mp4.mp3";
    
//     $(document).ready(function() {
//         // check that your browser supports the API
//         try {
//             // the AudioContext is the primary container for all audio  objects
//             audioContext = new AudioContext();
//         }
//         catch(e) {
//             alert('Web Audio API is not supported in this browser');
//         }
    
//         // log if an error occurs
//         function onError(e) {
//             console.log(e);
//         }

//         // load the sound from a URL
//         function load_audio(url) {
//             var request = new XMLHttpRequest();
//             request.open('GET', url, true);
//             request.responseType = 'arraybuffer';
//                 // When loaded decode the data and store the audio buffer in memory
//             request.onload = function() {
//                 console.log(request.response);
//                 var blob = new Blob([request.response]);
//                 console.log(blob)
//                 // socket.emit('audioStream', blob);
//                 // audioContext.decodeAudioData(request.response, function(buffer) {
//                 //     audioBuffer = buffer;
//                 //     // Blob(buffer);
//                 //     // socket.emit('audioStream', new Blob(buffer));
//                 // }, onError);
//             }
//             request.send();
//         }
        
//         function play_audio(buffer) {
//             var audioSourceNode = audioContext.createBufferSource();
//             audioSourceNode.buffer = audioBuffer;
//             audioSourceNode.connect(audioContext.destination);
//             audioSourceNode.start();
//             // audioSourceNode.noteOn(0);
//         }
        
//         load_audio(audioUrl);

//         $("#play_button").click(function(e) {
//             e.preventDefault();
//            play_audio(audioBuffer);
//         });

//         // socket.on('audioStream2', function(stream) {
//         //     console.log('received', stream);
//         //     audioContext.decodeAudioData(stream, function(buffer) {
//         //         audioBuffer = buffer;
//         //         // Blob(buffer);
//         //         // socket.emit('audioStream', new Blob(buffer));
//         //     }, onError);
//         // });

//         socket.on('audioStream2', function(buffers) {
//             // buffers = JSON.parse(buffers);
            
//             var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
//             audioCtx.decodeAudioData(buffers, function(buffer) {
//                 console.log(buffer);
//             });
            
//             var frameCount = audioCtx.sampleRate * 10.0;

//             var myArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);

//             var myBuffer = myArrayBuffer.getChannelData(0);
//             var myBuffer1 = myArrayBuffer.getChannelData(1);

//             for(var i = 0; i < buffers[0].length; i++) {
//                 myBuffer[i] = buffers[0][i];
//                 // myBuffer[i] = Math.abs(buffers[0][i] * 5) > 1 ? Math.random()*2 - 1 : buffers[0][i] * 5;
//                 // console.log(myBuffer[i]);
//                 // console.log(buffers[0][i]*5);
//             }
//             for(var i = 0; i < buffers[0].length; i++) {
//                 myBuffer1[i] = buffers[1][i];
//                 // myBuffer1[i] = Math.abs(buffers[1][i] * 5) > 1 ? Math.random()*2 - 1 : buffers[1][i] * 5;
//             }

//             // myBuffer = buffers[0];
//             // myBuffer1 = buffers[1];

//             var source = audioCtx.createBufferSource();
//             source.buffer = myArrayBuffer;
//             source.connect(audioCtx.destination);
//             source.start();
//         });
//     });






//     // create a audioBuffer and play
//     var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//     // var button = document.querySelector('button');
//     var button = document.getElementById('buttonId');
//     // var pre = document.querySelector('pre');
//     // var myScript = document.querySelector('script');

//     // pre.innerHTML = myScript.innerHTML;

//     // Stereo
//     var channels = 2;
//     // Create an empty two second stereo buffer at the
//     // sample rate of the AudioContext
//     var frameCount = audioCtx.sampleRate * 2.0;

//     var myArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);

//     button.onclick = function() {
//       // Fill the buffer with white noise;
//       //just random values between -1.0 and 1.0
//       for (var channel = 0; channel < channels; channel++) {
//        // This gives us the actual ArrayBuffer that contains the data
//        var nowBuffering = myArrayBuffer.getChannelData(channel);
//        for (var i = 0; i < frameCount; i++) {
//          // Math.random() is in [0; 1.0]
//          // audio needs to be in [-1.0; 1.0]
//          nowBuffering[i] = Math.random() * 2 - 1;
//        }
//       }

//       console.log(myArrayBuffer);
//       // Get an AudioBufferSourceNode.
//       // This is the AudioNode to use when we want to play an AudioBuffer
//       var source = audioCtx.createBufferSource();
//       // set the buffer in the AudioBufferSourceNode
//       source.buffer = myArrayBuffer;
//       // connect the AudioBufferSourceNode to the
//       // destination so we can hear the sound
//       source.connect(audioCtx.destination);
//       // start the source playing
//       source.start();
//     }