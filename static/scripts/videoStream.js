$(function() {

    var canvasPreview = document.querySelector('#canvasPreview');
    var streamingVideoContainer = document.querySelector('#streamingVideoContainer');
    var liveVideoContainer = document.querySelector('#liveVideo')
    var videoTrack = null;
    var intervalHandler = null;
    
    function loadCam(stream) {
        videoTrack = stream.getTracks()[0];
        liveVideo.src=window.URL.createObjectURL(stream);
        // liveVideoContainer.attr('src',URL.creatObjectURL(stream));
    }

    function loadCamError() {
        alert ("camera not detected");
    }

    function viewVideo (context) {
        context.drawImage(liveVideoContainer, 0, 0, context.width,context.height);
        socket.emit('stream', canvasPreview.toDataURL('image/webp'));
    }

    $('#video-start-btn').click(function() {
        navigator.getUserMedia = (navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msgGetUserMedia);
        
        if(navigator.getUserMedia) {
            navigator.getUserMedia({video:true}, loadCam, loadCamError);
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
        liveVideoContainer.src = '';
        clearInterval(intervalHandler);
        streamingVideoContainer.src = '';
    });

    socket.on('stream', function(image) {
        // var img = $('#streamingVideoContainer')[0];
        // img.src=image;
        streamingVideoContainer.src = image;
    });

});