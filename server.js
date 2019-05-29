const port = process.env.PORT || 3001;

const express = require('express');
const app = express();

//Handling MongoDB
const MongoClient = require('mongodb').MongoClient;

//Set this yourself
const DB_USERNAME = "mongo";
const DB_USER = "admin";

//Should be automatically setup on npm start; see README > Database Setup for more details
const DB_PASSWORD = process.env.MONGOPASSWORD;
const DB_HOST_URL = process.env.MONGOHOST || "192.168.27.100";
const DB_PORT = process.env.MONGOPORT || "27017";

const MONGODB_URL = "mongodb://"+DB_USERNAME+":"+DB_PASSWORD+"@"+DB_HOST_URL+":"+DB_PORT+"/"+DB_USER;
//const MONGODB_URL = "mongodb+srv://admin:<password>@pandas-ef9ir.mongodb.net/test?retryWrites=true";

const client = new MongoClient(MONGODB_URL, { useNewUrlParser: true });
let db;
const COLLECTION_NAME = "votes";

client.connect(err => {
	if(err) return console.log("ERROR: "+err);

	db = client.db("cuddly-animals");

	console.log("Connected to MongoDB server at "+MONGODB_URL);
	app.listen(port, () => {
		console.log("Listening on http://localhost:" + port);
	});
});

app.set('view engine', 'ejs');
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));

//Handling index.html and subsequent votes
app.get('/', (req, res) => {
	console.log("Retrieving from database "+COLLECTION_NAME+"...");

	db.collection(COLLECTION_NAME).find().toArray((err, results) => {
		if(err){
			res.sendFile(__dirname + '/index.html'); //note, path must be absolute
			return console.log("ERROR: "+err);
		}

		console.log(JSON.stringify(results, null, 2))

		// send HTML file populated with quotes here
		res.render('index.ejs', {
			"votes": results
		})
	});
});

app.post('/', (req, res) => {
	console.log("Hello?!?");
});

//Handling forms
app.post('/form1', (req, res)=>{
	db.collection(COLLECTION_NAME).insertOne(req.body, (err, result) => {
		if(err) return console.log("ERROR: "+err);

		console.log('Saved to database: '+result);
		res.redirect('/');
	})
})

//Handling 404 not found
// 404
app.use(function(req, res, next) {
	return res.status(404).sendFile(__dirname + '/public/404.html'); //note, path must be absolute
});

// 500 - Any server error
app.use(function(err, req, res, next) {
	return res.status(404).sendFile(__dirname + '/public/500.html'); //note, path must be absolute
});
