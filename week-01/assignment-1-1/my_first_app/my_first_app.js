if (Meteor.isClient) {
  // counter starts at 0
  // Session.setDefault('now', new Date());

// var now = new Date();

  Template.hello.helpers({
    now: function () {
      return new Date();
    }
  });

} /* isClient*/




if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
