const port = process.env.PORT || 3001;

const express = require('express');
const app = express();

//NOSERVER?
const NOSERVER = process.env.NOSERVER || 0;
if(NOSERVER) console.log("Debugging with NOSERVER="+NOSERVER);

const FAKE_DATABASE = [
	{ id: 0, name: "Name1", animal: "Panda" },
	{ id: 1, name: "Name2", animal: "Penguin" },
	{ id: 2, name: "Name3", animal: "Dolphin"}
];

//Handling MongoDB
const { MongoClient, ObjectId } = require('mongodb');

//Set this yourself
const DB_USERNAME = "mongo";
const DB_NAME = process.env.MONGONAME || "admin";

//Should be automatically setup on npm start; see README > Database Setup for more details
const DB_PASSWORD = process.env.MONGOPASSWORD || "password";
const DB_HOST_URL = process.env.MONGOHOST || "192.168.27.100";
const DB_PORT = process.env.MONGOPORT || "27017";

const MONGODB_URL = "mongodb://"+DB_USERNAME+":"+DB_PASSWORD+"@"+DB_HOST_URL+":"+DB_PORT+"/"+DB_NAME;
//const MONGODB_URL = "mongodb+srv://admin:<password>@pandas-ef9ir.mongodb.net/test?retryWrites=true";

console.log("Connecting to "+MONGODB_URL+"...");

const client = new MongoClient(MONGODB_URL, { useNewUrlParser: true });
let db;
const COLLECTION_NAME = "votes";

if(!NOSERVER){
	client.connect(err => {
		if(err) return console.log("ERROR: "+err);

		db = client.db("cuddly-animals");

		console.log("Connected to MongoDB server at "+MONGODB_URL);

		app.listen(port, () => {
			console.log("Listening on http://localhost:" + port);
		});
	});
}

app.set('view engine', 'ejs');
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));

//Handling index.html and subsequent votes
app.get('/', (req, res) => {
	console.log("Retrieving from collection "+COLLECTION_NAME+"...");

	if(NOSERVER){
		// send HTML file populated with quotes here
		res.render('index.ejs', {
			"votes": FAKE_DATABASE
		});
		return;
	}

	if(!db){
		res.sendFile(__dirname + '/index.html'); //note, path must be absolute
		console.log("ERROR: MongoDB is not connected.");
		return;
	}

	db.collection(COLLECTION_NAME).find().toArray((err, results) => {
		if(err){
			res.sendFile(__dirname + '/index.html'); //note, path must be absolute
			return console.log("ERROR: "+err);
		}

		console.log("Results: ",JSON.stringify(results, null, 2))

		// send HTML file populated with quotes here
		res.render('index.ejs', {
			"votes": results
		})
	});
});

//Handling forms
app.post('/votes_form', (req, res)=>{
	if(!req.body.name.length || !req.body.animal.length){
		res.redirect('/');
		return;
	}

	db.collection(COLLECTION_NAME).insertOne(req.body, (err, result) => {
		if(err) return console.log("ERROR: "+err);

		console.log('Saved to database: '+result);
		res.redirect('/');
	})
})

app.put('/votes_form', (req, res) => {
	//console.log("Panda Invasion!", req, res);
	console.log(req.body);
	db.collection(COLLECTION_NAME).findOneAndUpdate({
		_id: ObjectId(req.body._id)
	}, {
		$set: {
			name: req.body.name,
			animal: req.body.animal
		}
	}, {
		//sort: {_id: -1},
		//upsert: true,
		returnOriginal: false
	}, (err, result) => {
		if (err) return res.send(err);
		res.send(result);
	})
})

app.delete('/votes_form', (req, res) => {
	db.collection(COLLECTION_NAME).findOneAndDelete({
		_id: ObjectId(req.body._id)
	},
	(err, result) => {
		if (err) return res.send(500, err)
		res.send({
			_id: req.body._id,
			subject: 'delete',
			message: 'Deleted vote with id '+req.body.id
		})
	})
})

// NOSERVER
if(NOSERVER){
	app.listen(port, () => {
		console.log("Listening on http://localhost:" + port);
	});
}

//Handling 404 not found
// 404
app.use(function(req, res, next) {
	return res.status(404).sendFile(__dirname + '/public/404.html'); //note, path must be absolute
});

// 500 - Any server error
app.use(function(err, req, res, next) {
	return res.status(404).sendFile(__dirname + '/public/500.html'); //note, path must be absolute
});
