$(function() {

    var canvasPreview = document.querySelector('#canvasPreview');
    var streamingVideoContainer = document.querySelector('#streamingVideoContainer');
    var liveVideoContainer = document.querySelector('#live-video')
    var videoTrack = null;
    var intervalHandler = null;
    
    function loadCam(stream) {
        videoTrack = stream.getTracks()[0];
        liveVideoContainer.src=window.URL.createObjectURL(stream);
        // liveVideoContainer.attr('src',URL.creatObjectURL(stream));
    }

    function loadCamError() {
        alert ("camera not detected");
    }

    function viewVideo (context) {
        context.drawImage(liveVideoContainer, 0, 0, context.width,context.height);
        socket.emit('videoStream', canvasPreview.toDataURL('image/webp'));
    }

    $('#video-start-btn').click(function() {
        // navigator.getUserMedia = (navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msgGetUserMedia);
        
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // navigator.getUserMedia({video:true}, loadCam, loadCamError);
            navigator.mediaDevices.getUserMedia({video: true})
            .then((mediaStream) => {
                // videoTrack = stream.getTracks()[0];
                // liveVideoContainer.src=window.URL.createObjectURL(stream);
                // liveVideoContainer.attr('src',URL.creatObjectURL(stream));
                // var video = document.querySelector('video');
                liveVideoContainer.srcObject = mediaStream;
                // liveVideoContainer.onloadedmetadata = function(e) {
                //     liveVideoContainer.play();
                // };
            })
            .catch((error) => {
                console.log('camera error', error);
                alert ("camera not detected");
            });
        }

        var context = canvasPreview.getContext('2d');

        canvasPreview.width=200;
        canvasPreview.height=200;
        context.width=canvasPreview.width;
        context.height=canvasPreview.height;

        intervalHandler = setInterval(function() {
            viewVideo(context);
        },200);

    });

    $('#video-stop-btn').click(function() {
        videoTrack.stop();
        socket.emit('mediaEnd', 'video');
        liveVideoContainer.src = '';
        clearInterval(intervalHandler);
        // streamingVideoContainer.src = '';
    });

    socket.on('videoStreamS', function(image) {
        // var img = $('#streamingVideoContainer')[0];
        // img.src=image;
        streamingVideoContainer.src = image;
    });

    socket.on('mediaEndS', function(media) {
        streamingVideoContainer.src = '';
    });

});