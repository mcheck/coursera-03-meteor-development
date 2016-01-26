Images = new Mongo.Collection("images");

console.log(Images.find().count());

if (Meteor.isClient) {

   Template.images.helpers({images:Images.find()});

   Template.images.events({
             'click .js-image': function(event) {
                 $(event.target).css("width", "50px");
             },
             'click.js-del-image': function(event) {
                 var image_id = this._id;
                 $("#"+image_id).hide('slow', function(){
                   Images.remove({"_id":image_id}); 
                 })
                 
                 console.log("You have deleted: "+image_id);
             }

   }); // end template image events

}

if (Meteor.isServer) {
   console.log("I am the server");
}


console.log("where am I running");

