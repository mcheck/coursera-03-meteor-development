
Meteor.startup(function(){
	if (Images.find().count() == 0) {
		for (var i=1;i<23;i++){
			Images.insert({
			    img_src: "img_"+i+".jpg",
			    img_alt: "Image: "+i
			}); // end of images.insert				
		} // end of for loop insert images
	console.log("this is from startup.js:"+Images.find().count());
	} // end of If not have images
}); 
