
// Routing
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});


Router.route('/', function() {
  this.render('welcome', {
    to:"main"
  });
});

Router.route('/images', function() {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('images', {
        to: "main"
    });
});

Router.route('/image/:_id', function() {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('image', {
        to: "main",
        data: function(){
          return Images.findOne({
            _id: this.params._id,
          });
        }
    });
});


// inifinte scroll
Session.set("imageLimit", 8);
lastScrollTop = 0; 
$(window).scroll(function(event){
  // test if we are near the bottom of the window
  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    // where are we in the page? 
    var scrollTop = $(this).scrollTop();
    // test if we are going down
    if (scrollTop > lastScrollTop){
      // yes we are heading down...
     Session.set("imageLimit", Session.get("imageLimit") + 4);
    }

    lastScrollTop = scrollTop;
  }
      
})


// user authentication, use username and email
Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});

Template.images.helpers({
    images: function() {
        if (Session.get("userFilter")) { // a filter has been set!
            return Images.find({
                createdBy: Session.get("userFilter")
            }, {
                sort: {
                    createdOn: -1,
                    rating: -1
                },
                limit: Session.get("imageLimit")
            });
        } else {
            return Images.find({}, {
                sort: {
                    createdOn: -1,
                    rating: -1
                },
                limit: Session.get("imageLimit")
            });
        }
    },

    getUser: function(user_ID) {
        var filter = {
            _id: user_ID
        };
        var user = Meteor.users.findOne(filter)
        if (user) {
            return user.username;
        } else {
            return "anon";
        }
    },

    filtering_images: function() {
        if (Session.get("userFilter")) { // a filter has been set!
            return true;
        } else {
            return false;
        }
    },

    getFilterUser: function() {
        if (Session.get("userFilter")) { // a filter has been set!
            var user = Meteor.users.findOne({
                _id: Session.get("userFilter")
            });
            if (user) {
                return user.username;
            } else {
                return "anon";
            }
        }
    }

});

Template.body.helpers({
    username: function() {
        console.log(Meteor.user());
        if (Meteor.user()) {
            return Meteor.user().username;
        } else {
            return "Anonymous Internetsess User";
        }
    }

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
    }, // end js-del-image

    'click .js-rate-image': function(event) {
        var rating = $(event.currentTarget).data("userrating");
        var image_id = this.image_id;
        Images.update({
            _id: image_id
        }, {
            $set: {
                rating: rating
            }
        });
        console.log("userrating: " + rating + " for image id: " + image_id);
    }, // end js-rate-imate

    'click .js-show-image-form': function(event) {
        $("#image_add_form").modal("show");
    }, //end js-show-image-form

    'click .js-set-image-filter': function(event) {
        Session.set("userFilter", this.createdBy);
    }, // end js-set-image-filter

    'click .js-rm-image-filter': function(event) {
            Session.set("userFilter", undefined);
        } // end js-rm-image-filter


}); // end template image events

Template.image_add_form.events({
    'submit .js-add-image': function(event) {
        var img_alt, img_src;
        img_src = event.target.img_src.value;
        img_alt = event.target.img_alt.value;

        if (Meteor.user()) {
            Images.insert({
                img_alt: img_alt,
                img_src: img_src,
                createdOn: new Date(),
                createdBy: Meteor.user()._id
            });
        }
        $("#image_add_form").modal("hide");
        console.log("src:" + img_src + " alt:" + img_alt);
        return false;
    }
}); // end template image_add_form events


