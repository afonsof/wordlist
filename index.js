var fs = require('fs');
var parser = require('subtitles-parser');
var opensubtitles = require("opensubtitles-client");

movies = [ "Cars", "Ice Age", "Toy Story", "The Avengers", "Titanic" ];

function download(movies)
{
	if(movies.length == 0) return;

	var movie = movies.pop(); 
	console.log(movie);

	console.log("logging in...");
	opensubtitles
	.api
	.login()
	.done(function(token){
		console.log("searching...");
		opensubtitles.api
		.search(token, "eng", movie)
		.done(function(results) {
			console.log("downloading...");
			opensubtitles.downloader.download(results, 1, null, function(){
				console.log("done");
			download(movies);
			});
		});
	});
}
download(movies);

fs.readdir(".", function(err, files) {
	var items = {};
	for(var i = 0; i < files.length; i++){
		var file = files[i];
		if(file.indexOf(".srt") > -1) {
			processFile(file, items);
		}
	}
	var sortable = [];
	for (var item in items) {
		sortable.push([item, items[item]]);
	}
	sortable.sort(function(a, b) {return a[1] - b[1]})
	fs.writeFile('teste.json', JSON.stringify(sortable), function(){});
	console.log(sortable);
});

function processFile(fileName, items) {
	var data = fs.readFileSync(fileName);
    	data = parser.fromSrt(data.toString(), true);
	console.log(data);

	for(var i = 0; i < data.length; i++) {
		var matches = data[i].text.match(/\w+/g);
		for(var idx in matches) {
		    var match = matches[idx].toLowerCase();
		    if(items[match]) {
		        items[match]++;
		    }
		    else {
		        items[match] = 1;
		    }
		}
	}
}
