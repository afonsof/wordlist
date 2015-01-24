
var OpenSubService = function () {
    this.openSubClient = require("opensubtitles-client");
};

OpenSubService.prototype = {
    getMoviesByName: function (movieName, callback) {
        var scope = this;
        this.openSubClient.api
            .login()
            .done(function (token) {
                scope.openSubClient.api
                    .search(token, "eng", movieName)
                    .done(function (results) {
                        var movies = scope._processResults(results);
                        var movieNames = scope._getNamesArray(movies);
                        callback(movies, movieNames);
                    });
            });
    },

    downloadMovie: function (selected, callback) {
        this.openSubClient.downloader.download([selected], 1, null, function () {
            var fs = require('fs');
            var parser = require('subtitles-parser');

            var data = fs.readFileSync(selected['SubFileName']);
            data = parser.fromSrt(data.toString(), true);
            callback(data);
        });
    },

    _processResults: function (results) {
        var movies = {};
        results.forEach(function (item) {
            var mv = item.MovieName.toLowerCase();
            var sn = item.SubFileName.toLowerCase();
            if (movies[mv]) {
                movies[mv][sn] = item;
            }
            else {
                var subs = {};
                subs[sn] = item;
                movies[mv] = subs;
            }
        });
        return movies;
    },
    _getNamesArray: function (movies) {
        var movieNames = [];
        for (var movie in movies) {
            movieNames.push(movie);
        }
        return movieNames;
    }


};

module.exports = {
  OpenSubService: OpenSubService
};