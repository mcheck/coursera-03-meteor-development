Images = new Mongo.Collection("images");

console.log(Images.find().count());

if (Meteor.isClient) {

    Template.images.helpers({
        images: Images.find({}, {sort: {createdOn: -1, rating: -1}} )
    });

    Template.images.events({
        'click .js-image': function(event) {
            $(event.target).css("width", "50px");
        },
        'click .js-del-image': function(event) {
            var image_id = this._id;
            $("#" + image_id).hide('slow', function() {
                Images.remove({
                    "_id": image_id
                });
            })
        },
        'click .js-rate-image': function(event) {
            var rating = $(event.currentTarget).data("userrating");
            var image_id = this.image_id;
            Images.update({_id:image_id},
                          {$set: {rating:rating}});
            console.log("userrating: "+rating+" for image id: "+image_id);

        }, // end js-rate-imate
        'click .js-show-image-form': function(event) {
            $("#image_add_form").modal("show");
        } //end 

    }); // end template image events

    Template.image_add_form.events({
       'submit .js-add-image': function(event) {
           var img_alt, img_src;
           img_src = event.target.img_src.value;
           img_alt = event.target.img_alt.value;

           Images.insert({
               img_alt: img_alt,
               img_src: img_src,
               createdOn: new Date()
           });
           $("#image_add_form").modal("hide");
           console.log("src:" + img_src + " alt:" + img_alt);
           return false;
       }
   }); // end template image_add_form events



}

if (Meteor.isServer) {
    console.log("I am the server");
}


console.log("where am I running");
