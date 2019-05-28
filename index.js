const express = require('express');
const bodyParser= require('body-parser')
const app = express();

const port = 3001 | process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html'); //note, path must be absolute
})

app.post('/form1', (req, res)=>{
	console.log(req.body);
})

app.use(express.static('public'))

app.listen(port, () => {
	console.log("Listening on http://localhost:" + port);
});
