var osc = require('./openSubService');

var App = function (wordRepo) {
    this.wordRepo = wordRepo;
    this.openSubService = new osc.OpenSubService();
    this.inquirer = require("inquirer");
    this.args = require('argparser')
        .nonvals("know")
        .err(function (e) {
            console.log(e);
            process.exit(0);
        })
        .parse();
};

App.prototype = {

    processConsole: function () {
        if (this["_" + this.args.arg(0)]) {
            this["_" + this.args.arg(0)](this.args);
        }
    },
    _add: function (args) {
        var obj = {name: args.arg(1).toLowerCase(), known: args.opt("known")};
        this.wordRepo.add(obj);
    },

    _reviewMovie: function (args) {
        var scope = this;
        var movieName = args.arg(1).toLowerCase();

        this.openSubService.getMoviesByName(movieName, function (movies, movieNames) {
            this._askForMovieName(movieNames, function (movieName) {
                var subtitles = [];
                for (var sub in movies[movieName]) {
                    subtitles.push(sub);
                }
                scope._askForSubtitle(subtitles, function (subtitle) {
                    var movie = movies[movieName][subtitle];
                    scope.openSubService.downloadMovie(movie, function (movieData) {
                        var movieWords = scope._getMovieWords(movieData);
                        scope._askForKnownWords(movieWords, function (knownWords) {
                            for (var i = 0; i < knownWords.length; i++) {
                                scope.wordRepo.add({name: knownWords[i], know: true});
                            }
                        });
                    });
                });
            });
        });
    },

    _askForMovieName: function (movieNames, callback) {
        var question = [{
            type: 'list',
            name: 'question',
            message: 'What movie do you want?',
            choices: movieNames
        }];

        this.inquirer.prompt(question, function (answer) {
            callback(answer['question']);
        });
    },
    _askForSubtitle: function (subtitles, callback) {
        var question = {
            type: 'list',
            name: 'question',
            message: 'What subtitle do you want?',
            choices: subtitles
        };

        this.inquirer.prompt(question, function (answer) {
            callback(answer['question']);
        });
    },
    _askForKnownWords: function (words, callback) {
        var question = {
            type: 'checkbox',
            name: 'question',
            message: 'Check the words you already know',
            choices: words
        };

        this.inquirer.prompt(question, function (answer) {
            callback(answer["question"]);
        });
    },

    _getMovieWords: function (movieData) {
        var wordCountPair = {};

        for (var i = 0; i < movieData.length; i++) {
            var matches = movieData[i].text.match(/\w+/g);
            for (var idx in matches) {
                var match = matches[idx].toLowerCase();
                if (wordCountPair[match]) {
                    wordCountPair[match]++;
                }
                else {
                    wordCountPair[match] = 1;
                }
            }
        }

        var sortable = [];
        for (var item in wordCountPair) {
            sortable.push([item, wordCountPair[item]]);
        }
        sortable.sort(function (a, b) {
            return a[1] - b[1];
        });

        var words = [];
        for (i = 0; i < sortable.length; i++) {
            this.wordRepo.wl.count({name: sortable[i][0]}).exec(function (err, count) {
                if (count > 0) words.push(sortable[i][0]);
            });
        }
        return words;
    }
};

module.exports = {
    App: App
};