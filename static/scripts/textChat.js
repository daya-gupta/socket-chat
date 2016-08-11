$(function() {
    var users = [];
    // var recipients = [];
    // $('#joinForm').submit(function() {
    //     socket.emit('join', $('#name').val());
    //     $('#joinForm').hide();
    //     $('ul#messages').append('<li>'+'You have connected successfully to the server!!'+'</li>')
    //     $('#messageForm').delay(1000).show();
    //     return false;
    // });

    debugger;
    
    $('#messageForm').submit(function() {
        var message = $('#m').val().replace(/</g,'');
        var recipients = [];
        
        $('.userCheckbox').each(function(index) {
            if(this.checked) {
                recipients.push(users[index]);
            }
        });

        socket.emit('message', {message: message, recipients: recipients});
        $('#m').val('');
        return false;
    });

    socket.on('message', function(msg) {
        $('ul#messages').append('<li>'+msg+'</li>');
        $('ul#messages').scrollTop($('ul#messages').height());
    });

    socket.on('users', function(connectedUsers) {
        userListHtml = '';
        users = connectedUsers;
        // if(users && users.length) {
        //     $('#joinForm').hide();
        //     $('#messageForm').show();
        // }
        for(var i=0; i<users.length; i++) {
            userListHtml = userListHtml + '<li><input name="userCheckbox" class="userCheckbox" type="checkbox"/>'+users[i].name+'</li>';
        }
        $('ul#users').html(userListHtml);
        $('ul#messages').scrollTop($('ul#messages').height());
    });

    socket.on('customConnect', function(connectedUsers) {
        // if(users && users.length) {
            $('#joinForm').hide();
            $('#messageForm').show();
        // }
    });

    socket.emit('join', $('#loggedInUser').text().trim());

    $('ul#messages').append('<li>'+'You have connected successfully to the server!!'+'</li>');

    
});
