var express = require('express');
var router = express.Router();

/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

var monk = require('monk');
var db = monk('localhost:27017/vidzy');


router.get('/', function(req, res, next) {
  res.redirect('/videos');
});

router.get('/videos', function(req, res) {
	var collection = db.get('videos');
	collection.find({}, function(err, videos){
		if (err) throw err;
	  	res.render('index', { videos: videos });
	});
});
router.search('/videos', function(req, res) {
  var collection = db.get('videos');
    collection.find({'title': {'$regex': req.body.title,$options:"i"},'genre': {'$regex': req.body.genre,$options:"i"}}, function(err, videos){
        if (err) throw err;

	  	res.render('index', { videos: videos });
    });
});

//new video
router.get('/videos/new', function(req, res) {
	res.render('new');
});

//insert route
router.post('/videos', function(req, res){
    var collection = db.get('videos');
    collection.insert({
        title: req.body.title,
        genre: req.body.genre,
        image: req.body.image,
        description: req.body.desc
    }, function(err, video){
        if (err) throw err;

        res.redirect('/videos');
    });
});


router.get('/videos/:id', function(req, res) {
	var collection = db.get('videos');
	collection.findOne({ _id: req.params.id }, function(err, vid){
		if (err) throw err;
	  	//res.json(video);
	  	res.render('show', { vid: vid });
	});
});

//delete route
router.delete('/videos/:id', function(req, res){
    var collection = db.get('videos');
    collection.remove({ _id: req.params.id }, function(err, video){
        if (err) throw err;

        res.redirect('/');
    });
});
router.get('/videos/:id/edit', function(req, res) {
	var collection = db.get('videos');
	collection.findOne({ _id: req.params.id }, function(err, vid){
		if (err) throw err;
	  	//res.json(video);
	  	res.render('edit', { vid: vid });
	});
});
router.put('/videos/:id', function(req, res){
    var collection = db.get('videos');
     collection.findOneAndUpdate({"_id": req.params.id}, {$set: {
        title: req.body.title,
        genre: req.body.genre,
        image: req.body.image,
        description: req.body.desc
    }},  function(err,doc) {
       if (err) { throw err; }
        res.redirect('/');
     });  
});
module.exports = router;
