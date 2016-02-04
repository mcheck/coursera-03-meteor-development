

Meteor.methods({
	getURL: function(url){
		console.log("on server url is: "+url);

		// return url+" (from server)";
		var response = HTTP.get( url, {'headers': {"User-Agent" : "Mozilla/4.0 (compatible; MSIE 6.0b; Windows NT 5.1; .NET CLR 1.0.2914)"}});
		console.log("server response is: "+response);

		var $ = cheerio.load(response.content);
		var title = $('title').text();

		console.log("server url title is: "+title);


		var description = $('meta[name="description"]').attr("content");
		var description = $('meta[property="og:description"]').attr("content");
		if (description) {
			console.log("server url desc is: "+description);	
		} 
		return title;
		}
});

