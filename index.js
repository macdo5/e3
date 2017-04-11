var express = require('express');
var fs = require('fs');
var url = require("url");
var bodyParser = require('body-parser');
var app = express();
var index = fs.readFileSync('public/index.html');
var scientistArray = JSON.parse(fs.readFileSync('public/listOfScientists.json', "UTF-8"));

app.use(express.static('public'));

//http://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function (req, res) {
  res.send(index)
})

app.get('/scientists', function (req, res) {
  res.write("<h1>All Scientists</h1>");
  res.write("<ul id=\"listOfScientists\">");
  for(var i = 0; i < scientistArray.listOfScientists.length; i++)
  {
	  var stringBuilder = scientistArray.listOfScientists[i].firstName + " " + scientistArray.listOfScientists[i].lastName;
	  var stringHref = "/scientist/" + scientistArray.listOfScientists[i].lastName.toLowerCase();
	  res.write("<li><a href = " + stringHref + ">" + stringBuilder +"</a></li>");
  }
  res.write("</ul>");
  res.end("<a href = \"/scientist/suggest\">suggest a scientist</a>");
})

app.get('/scientist/suggest', function (req, res) {
  var suggest = fs.readFileSync('public/suggest.html');
  res.end(suggest);
})

app.get('/jsonParseScientist.js', function (req, res) {
  console.log("receivedRequest4Json");
  var javascript = fs.readFileSync('public/jsonParseScientist.js');
  res.end(javascript);
})

app.post('/scientist/suggest', function (req, res) {
	scientistArray.listOfScientists.push(req.body);
	var writer = fs.createWriteStream('public/listOfScientists.json');
	var scientistArrayJson = JSON.stringify(scientistArray);
	writer.write(scientistArrayJson,"UTF-8");
	writer.end();
	writer.on('finish', function() {
		scientistArray = JSON.parse(fs.readFileSync('public/listOfScientists.json', "UTF-8"));
		var scientistIndex = scientistArray.listOfScientists.length - 1;
		var scientist = scientistArray.listOfScientists[scientistIndex];
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(`<!DOCTYPE html>
				<html>
				<body>
				<h1> Thank You! </h1>
				<p> Thanks for your contribution. We have added it to our list of famous scientists.</p>
				<p> Here is a copy of your suggestion for your records</p>
				<h1> Scientist name: ${scientist.firstName} ${scientist.lastName} </h1>
				<img src="${scientist.picUrl}"/>
				<h2>Bio</h2>
				<p>${scientist.bio}</p>
				<p><a href="/scientists/">return to the scientists list</a></p>
				</body>
				</html>
		`);
	});
})

app.get('/scientist/*', function (req, res) {
  for(var i = 0; i < scientistArray.listOfScientists.length; i++)
  {
	  if ("/scientist/" + scientistArray.listOfScientists[i].lastName.toLowerCase() == req.url)
	  {
		  var scientist = scientistArray.listOfScientists[i];
		  res.writeHead(200, {"Content-Type": "text/html"});
		res.end(`<!DOCTYPE html>
                <html>
				<body>
				<h1> ${scientist.firstName} ${scientist.lastName} </h1>
				<h2>${scientist.years}</h2>
				<img src="${scientist.picUrl}"/>
				<h2>Bio</h2>
				<p>${scientist.bio}</p>
				<p><a href="/scientists/">return to the scientists list</a></p>
				</body>
				</html>
		`);
	  }
  }
})

app.listen(3000, function () {
  console.log('Listening on port 3000')
})