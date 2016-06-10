$(function() {
    $('#joinForm').submit(function() {
        socket.emit('join', $('#name').val());
        $('#joinForm').hide();
        $('ul').append('<li>'+'You have connected successfully to the server!!'+'</li>')
        $('#messageForm').delay(1000).show();
        return false;
    });

    $('#messageForm').submit(function() {
        socket.emit('message', $('#m').val().replace(/</g,''));
        $('#m').val('');
        return false;
    });

    socket.on('message', function(msg) {
        $('ul').append('<li>'+msg+'</li>')
    });
                        
});
