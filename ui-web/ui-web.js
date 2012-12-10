if (Meteor.isClient) {

  $(document).ready(function(){

    var socket = io.connect('http://localhost:3010');

    socket.on('connect', function(){
      socket.emit("set type", "web ui");
    });

    socket.on('crew', function(crew){
      crew.forEach(function(c){
        c.type = c.type.replace(' ', '-');
      });

      Session.set('crew', crew);
    });

    setInterval(function(){
      socket.emit('get crew');
    }, 500);

  });

  Template.list_cylons.cylons = function(){
    return Session.get('crew');
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
