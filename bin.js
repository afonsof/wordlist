#!/usr/bin/env node

function add(wl, obj) {
    wl.collections.word.count({name: obj.name}).exec(function (err, count) {
        if (count > 0) {
            wl.collections.word.update({name: obj.name}, obj).exec(function (err, users) {
                console.log("This word already exists and was updated.");
            });
            return;
        }

        wl.collections.word
            .create(obj)
            .exec(function (err, user) {
            });
    });
}
function action_add(args, wl) {
    var obj = {name: args.arg(1).toLowerCase(), know: args.opt("iknow")};
    add(wl, obj);
}

function processOpenSubMovies(results) {
    var movies = {};
    results.forEach(function (item) {
        var mv = item.MovieName.toLowerCase();
        var sn = item.SubFileName.toLowerCase();
        if (movies[mv]) {
            movies[mv][sn] = item;
        }
        else {
            var subs = {};
            subs[sn] = item
            movies[mv] = subs;
        }
    });
    return movies;
}
function action_review(args, wl) {
    var opensub = require("opensubtitles-client");
    var movieName = args.arg(1).toLowerCase();
    opensub.api
        .login()
        .done(function (token) {
            opensub.api
                .search(token, "eng", movieName)
                .done(function (results) {
                    var movies = processOpenSubMovies(results);
                    var movieNames = [];
                    for (var movie in movies) {
                        movieNames.push(movie);
                    }

                    var question = [{
                        type: 'list',
                        name: 'question1',
                        message: 'What movie do you want?',
                        choices: movieNames
                    }];

                    var inquirer = require("inquirer");
                    inquirer.prompt(question, function (answer) {
                        var subtitles = [];
                        for (var sub in movies[answer.question1]) {
                            subtitles.push(sub);
                        }
                        var question2 = {
                            type: 'list',
                            name: 'question2',
                            message: 'What subtitle do you want?',
                            choices: subtitles
                        };

                        inquirer.prompt(question2, function (answer2) {
                            var selected = movies[answer['question1']][answer2['question2']];
                            opensub.downloader.download([selected], 1, null, function () {
                                var fs = require('fs');
                                var parser = require('subtitles-parser');

                                var data = fs.readFileSync(selected.SubFileName);
                                data = parser.fromSrt(data.toString(), true);

                                var items = {};

                                for (var i = 0; i < data.length; i++) {
                                    var matches = data[i].text.match(/\w+/g);
                                    for (var idx in matches) {
                                        var match = matches[idx].toLowerCase();
                                        if (items[match]) {
                                            items[match]++;
                                        }
                                        else {
                                            items[match] = 1;
                                        }
                                    }
                                }

                                var sortable = [];
                                for (var item in items) {
                                    sortable.push([item, items[item]]);
                                }
                                sortable.sort(function (a, b) {
                                    return a[1] - b[1]
                                });

                                items = [];
                                for (i = 0; i < sortable.length; i++) {
                                    wl.collections.word.count({name: sortable[i][0]}).exec(function (err, count) {
                                        if (count > 0) items.push(sortable[i][0]);
                                    });
                                }

                                var question3 = {
                                    type: 'checkbox',
                                    name: 'question3',
                                    message: 'Check the words you already know',
                                    choices: items
                                };

                                inquirer.prompt(question3, function (answer3) {
                                    for (var i = 0; i < answer3.question3.length; i++) {
                                        var word = answer3.question3[i];
                                        add(wl, {name: word, know: true});
                                    }
                                });
                            });
                        });
                    });
                });
        });
}

function main(wl) {
    var args = require('argparser')
        .nonvals("iknow")
        .err(function (e) {
            console.log(e);
            process.exit(0);
        })
        .parse();

    if (args.arg(0) == "add") {
        action_add(args, wl);
    }
    if (args.arg(0) == "review") {
        action_review(args, wl);
    }
}

var setupWaterline = require('./waterline-bootstrap');
setupWaterline({
    adapters: {
        'sails-disk': require('sails-disk')
    },
    collections: {
        word: {
            connection: 'tmp',
            attributes: {
                name: 'string',
                know: 'boolean'
            }
        }
    },
    connections: {
        tmp: {
            adapter: 'sails-disk'
        }
    }
}, function waterlineReady(err, ontology) {
    if (err) throw err;
    main(ontology);
});
