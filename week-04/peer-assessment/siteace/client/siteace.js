/////
// routing
/////

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function() {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('website_list', {
        to: "content"
    });
});

Router.route('/website/:_id', function() {
    this.render('navbar', {
        to: "navbar"
    });
    this.render('website_detail', {
        to: "content",
        data: function(){
          return Websites.findOne({
            _id: this.params._id,
          });
        }
    });
});



/////
// user authentication
/////

Accounts.ui.config ({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

/////
// template helpers 
/////

// UI helpers are available in ALL templates (tried to register in .body but it did not work...)
UI.registerHelper(
    'website_added_on',
    function(context) {
        return moment(context).fromNow();
    });



Template.body.helpers({
    username: function() {
        if (Meteor.user()) {
            return Meteor.user().username;
        } else {
            return "Anon";
        }
    }
});

// helper function that returns all available websites
Template.website_list.helpers({
	websites:function(){
		return Websites.find({}, {sort: {votes: -1}});
	}
});

// helper function that returns all available websites
Template.website_detail.helpers({
	comments:function(website_id){
		return Comments.find({website_id:website_id}, {sort: {createdOn: -1}});
		// return Comments.find({}, {sort: {createdOn: -1}});
	}
});


/////
// template events 
/////
Template.body.events({
	"click .js-toggle-website-form":function(event){
		console.log("button click");
		$("#website_form").toggle('slow');
		
	}
});


Template.website_item.events({
	"click .js-upvote":function(event){
		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		var votes = this.votes;
		// console.log("Up voting website with id "+website_id);
		// put the code in here to add a vote to a website!
		Websites.update({_id: website_id}, {$set: {votes:votes+1}});

		return false;// prevent the button from reloading the page
	},

	"click .js-downvote":function(event){

		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		var votes = this.votes;
		// console.log("Down voting website with id "+website_id);
		// console.log("It has "+votes);
		// put the code in here to remove a vote from a website!
		Websites.update({_id: website_id}, {$set: {votes:votes-1}});

		return false;// prevent the button from reloading the page
	}
});

Template.website_form.events({

	"submit .js-save-website-form":function(event){

		// here is an example of how to get the url out of the form:
		var url = event.target.url.value;
		var title = event.target.title.value;
		var description = event.target.description.value;

		console.log(url, title, description)
	//  put your website saving code in here!	
		if (Meteor.user()) {
			Websites.insert({
				url: url,
				title: title,
				description: description,
				votes: 1,
				createdOn: new Date(),
				createdBy: Meteor.user()._id
			});
		}
		$("#website_form").toggle('fast');
		return false;// stop the form submit from reloading the page

	},

	    'click .js-set-website-id': function(event) {
        Session.set("userFilter", this.createdBy);
    } // end js-set-website-id
});



Template.website_detail.events({
	"submit .js-save-comment-form":function(event){
		// get the id of the website
		var website_id = this._id;
		// get the comment from the form
		var comment = event.target.comment.value;

		console.log(website_id, comment);
	
	//  Add the comment to the Comments collection
		Comments.insert({
			website_id:website_id,
			comment:comment,
			createdOn: new Date()
		});
		return false;// stop the form submit from reloading the page
	}
});

