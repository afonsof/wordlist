module.exports = function (app, db) {
    var passport = require("passport");
    var FacebookStrategy = require('passport-facebook').Strategy;

    var env = process.env.NODE_ENV || "development";
    var config = require(__dirname + '/config.json')[env].passport;

    passport.use(new FacebookStrategy(config, function (accessToken, refreshToken, profile, done) {
            var obj = {userName: profile.emails[0].value};
            db.User.findOne({where: obj}).done(function (err, user) {
                if (user) {
                    //process.nextTick(function() {
                    done(null, user);
                    //});
                }
                else {
                    db.User.create(obj, function (err, user) {
                        if (err) {
                            return done(err);
                        }
                        done(null, user);
                    });
                }
            });
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });
};