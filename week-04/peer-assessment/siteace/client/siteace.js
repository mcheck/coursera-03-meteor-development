
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
    'time_from_now',
    function(context) {
        return moment(context).calendar();
    });

UI.registerHelper(
	'getUser',
	function(context) {
    var filter = {_id: context};
    var user = Meteor.users.findOne(filter)
    if (user) {
        return user.username;
    } else {
        return "Unknown";
    }
});



/////
// template renderings 
// we're going to attach the jquery-validation package to our form.
// 
/////

Template.website_form.onRendered(function(){
	$('#add-site').validate({
		rules: {
			url: {
				required: true,
				url: true 
			}
		}
	});
});


// Template.body.helpers({
//     username: function() {
//         if (Meteor.user()) {
//             return Meteor.user().username;
//         } else {
//             return "Anon";
//         }
//     }
// });

// helper function that returns all available websites
Template.website_list.helpers({
	websites:function(){

		return Websites.find({}, {sort: {totalvotes: -1}});
	}
});

Template.website_item.helpers({
	totalVotes:function(){
		console.log(this.upvotes.value);
		return (this.upvotes - this.downvotes);
	}
});


// helper function that returns all available websites
Template.website_detail.helpers({
	comments:function(){
		var website_id = this._id;
		// console.log(website_id);
		return Comments.find({website_id:website_id}, {sort: {createdOn: -1}});
		// return Comments.find({}, {sort: {createdOn: -1}});
	}
});



Template.searchBox.helpers({
  sitesIndex: () => SitesIndex
});

/////
// template events 
/////
Template.website_list.events({
	"click .js-toggle-website-form":function(event){
		
		$("#website_form").toggle('slow');		
	}
});



var voting_events = {
"click .js-upvote":function(event){
		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		var upvotes = this.upvotes+1;
		var downvotes = this.downvotes;
		var totalvotes = upvotes - downvotes;
		// console.log("Up voting website with id "+website_id);
		// put the code in here to add a vote to a website!
		Websites.update({_id: website_id}, {$set: {upvotes:upvotes, totalvotes:totalvotes}});

		return false;// prevent the button from reloading the page
	},

	"click .js-downvote":function(event){

		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		var downvotes = this.downvotes+1;
		var upvotes = this.upvotes;
		var totalvotes = upvotes - downvotes;
		// console.log("Down voting website with id "+website_id);
		// console.log("It has "+votes);
		// put the code in here to remove a vote from a website!
		Websites.update({_id: website_id}, {$set: {downvotes:downvotes, totalvotes:totalvotes}});

		return false;// prevent the button from reloading the page
	}
};

// Add voting events to both listing and detail templates
Template.website_item.events(voting_events);
Template.website_detail.events(voting_events);



Template.website_form.events({

	"submit .js-save-website-form":function(event){

		event.preventDefault();	

		// here is an example of how to get the url out of the form:
		var url = event.target.url.value;
		// var title = event.target.title.value;
		// var description = event.target.description.value;

		// console.log(url, title, description)
		// 
		if (url) {
			// console.log("client url is: "+url);
			Meteor.call('getURL', url, function(err, response) {
				if (err) {
					console.log("getURL error: "+err.reason);
					return;
				};
				// Session.set('serverDataResponse', response);
				// console.log("response is: "+Session.get('serverDataResponse'));
				console.log("client response is: "+response);
				// console.log(response);
					//  put your website saving code in here!	
				
				var title = response;
				var description = response;

				if (Meteor.user()) {
					Websites.insert({
						url: url,
						title: title,
						description: description,
						upvotes: 1,
						downvotes: 0,
						totalvotes: 1,
						createdOn: new Date(),
						createdBy: Meteor.user()._id
					});
				};
				// 
			});
		};

		// close the form
		$("#website_form").toggle('fast');

		// reset the fields on the form
		$('.js-save-website-form')[0].reset();

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
		// who is writing this comment?
		var userid = Meteor.userId();
		// get the comment from the form
		var comment = event.target.comment.value;

		console.log(website_id, comment, userid);
	
	//  Add the comment to the Comments collection
		Comments.insert({
			website_id:website_id,
			comment:comment,
			createdOn: new Date(),
			createdBy: userid
		});

		// reset the fields on the form
		$('.js-save-comment-form')[0].reset();

		return false;// stop the form submit from reloading the page
	}
});

