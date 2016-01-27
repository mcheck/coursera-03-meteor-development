
// Collections.  Needed for client and server
Websites = new Mongo.Collection("websites");

Comments = new Mongo.Collection("comments");

// Websites.allow({
// 	insert: function (userId, doc) {
// 		console.log("Websites: insert");
// 		if (Meteor.user()) {
// 			return true;
// 		} else {
// 		}
// 	},

// 	update: function (userId, doc, fields, modifier) {
// 		console.log("Websites: update");
// 	},

// 	remove: function (userId, doc) {
// 		console.log("Websites: remove");
// 	},

// 	fetch: ['owner'],
// 	transform: function () {
// 		//...
// 	}
// });