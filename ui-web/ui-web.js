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

  Template.list_cylons.cylons_active = function(){
    var c = Session.get('crew');

    c = _(c).filter(function(m){ return m.active });

    return _(c).sortBy(function(m){ return m.type });
  }

  Template.list_cylons.cylons_inactive = function(){
    var c = Session.get('crew');

    c = _(c).filter(function(m){ return !m.active });

    return _(c).sortBy(function(m){ return m.type });
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
