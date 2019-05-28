const port = process.env.PORT || 3001;

const express = require('express');
const app = express();

//Handling MongoDB
const MongoClient = require('mongodb').MongoClient;
const db_url = "mongodb+srv://admin:admin@pandas-ef9ir.mongodb.net/test?retryWrites=true";

const client = new MongoClient(db_url, { useNewUrlParser: true });
let db;
const COLLECTION_NAME = "votes";

client.connect(err => {
	if(err) return console.log("ERROR: "+err);

	db = client.db("cuddly-animals");

	console.log("Connected to MongoDB server at "+db_url);
	app.listen(port, () => {
		console.log("Listening on http://localhost:" + port);
	});
});

const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));

//Handling index.html and subsequent votes
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html'); //note, path must be absolute

	console.log("Hello!");

	db.collection(COLLECTION_NAME).find().toArray((err, results) => {
		if(err) return console.log("ERROR: "+err);

		console.log("Obtained from database: "+JSON.stringify(results))
		// send HTML file populated with quotes here
	});
});

app.post('/', (req, res) => {
	console.log("Hello?!?");
});

//Handling forms
app.post('/form1', (req, res)=>{
	db.collection(COLLECTION_NAME).insertOne(req.body, (err, result) => {
		if(err) return console.log("ERROR: "+err);

		console.log('Saved to database: '+result)
		res.redirect('/')
	})
})
