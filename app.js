 var express = require("express"),
 app = express(),
 redis = require("redis"),
 client = redis.createClient(),
 methodOverride = require("method-override"),
 bodyParser = require("body-parser");

 // Some middleware
 app.set("view engine", "ejs");
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(methodOverride('_method'));

 // If I want to include css/js/imgs
 app.use(express.static(__dirname + '/public'));

 app.get('/', function(req, res){
   client.lrange("students", 0, -1, function(err, students){

     res.render("index",{students: students});
   });
 });

 // Post to create a student
 app.post("/create", function(req,res){
 console.log(req.body);
 // Push req.body.student into the students list
 client.lpush("students", req.body.person);
 // GO TO redis-cli
 // RUN LRANGE students 0 -1
 // If you see your student, you got it!
 // Do some creating
   res.redirect("/");
 });

 app.delete("/remove/:student", function(req,res) {
  client.lrange("students", 0, -1, function(err,students) {
    students.forEach(function(student) {
      if(req.params.student===student){
        client.lrem("students",1,student);
        res.redirect("/");
      }
    });
  });
 });

 app.delete("/remove/all/:students", function(req,res) {
  client.DEL("students");
  res.redirect("/");
});

 // Start the sever
 app.listen(3000, function(){
   console.log("Server starting on port 3000");
 });