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
