// REQUIRES
var mongoose   = require("mongoose");
var Campground = require("./models/campground.js");
var Comment    = require("./models/comment.js");

var data = [
   {
      name: "Cloud's Rest",
      image: "https://farm8.staticflickr.com/7068/6780970858_9b0e519daf.jpg",
      description: "Bacon ipsum dolor amet hamburger ribeye beef ribs, turkey tenderloin sirloin swine meatball tongue bacon short ribs fatback spare ribs. Sausage beef jerky pork chop, ham hock venison pancetta tongue fatback drumstick. Tri-tip brisket salami, frankfurter turducken short ribs pig. Ball tip shoulder porchetta meatloaf jowl tenderloin strip steak, salami chuck sausage. Pork tri-tip drumstick meatloaf tongue. Rump boudin frankfurter chuck bacon biltong."
   },
   {
      name: "Mountain Pass",
      image: "https://farm7.staticflickr.com/6105/6381606819_df560e1a51.jpg",
      description: "Bacon ipsum dolor amet hamburger ribeye beef ribs, turkey tenderloin sirloin swine meatball tongue bacon short ribs fatback spare ribs. Sausage beef jerky pork chop, ham hock venison pancetta tongue fatback drumstick. Tri-tip brisket salami, frankfurter turducken short ribs pig. Ball tip shoulder porchetta meatloaf jowl tenderloin strip steak, salami chuck sausage. Pork tri-tip drumstick meatloaf tongue. Rump boudin frankfurter chuck bacon biltong."
   },
   {
      name: "Dark Forest",
      image: "https://farm4.staticflickr.com/3659/3662521481_4a7bcce691.jpg",
      description: "Bacon ipsum dolor amet hamburger ribeye beef ribs, turkey tenderloin sirloin swine meatball tongue bacon short ribs fatback spare ribs. Sausage beef jerky pork chop, ham hock venison pancetta tongue fatback drumstick. Tri-tip brisket salami, frankfurter turducken short ribs pig. Ball tip shoulder porchetta meatloaf jowl tenderloin strip steak, salami chuck sausage. Pork tri-tip drumstick meatloaf tongue. Rump boudin frankfurter chuck bacon biltong."
   }
]

function seedDB() {
   
   // Remove existing campgrounds
   Campground.remove({}, function(err) {
      if (err) {
         console.log(err);
      } else {
         console.log("Removed campgrounds!");
         
         // Add a few campgrounds
         data.forEach(function(seed) {
            Campground.create(seed, function(err, campground){
               if (err) {
                  console.log(err);
               } else {
                  console.log("Added a Campground");
                  
                  // Create a comment
                  Comment.create(
                     {
                        text: "This place is great, but I wish it had internet",
                        author: "Homer Simpson"
                     }, function(err, comment) {
                        if (err) {
                           console.log(err);
                        } else {
                           campground.comments.push(comment);
                           campground.save();
                           console.log("Created new comment");
                        }
                     });
               }
            });
         });   
      }
   });
   
}

module.exports = seedDB;