if (Meteor.isClient) {

  setInterval(function(){
    $.get('http://localhost:3009/crew',function(data){
     Session.set('crew', data);
    });
  }, 500);

  Template.list_cylons.cylons = function(){
    return Session.get('crew');
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
