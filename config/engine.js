module.exports = function (app) {
    var path      = require("path");
    app.set('views', path.join(__dirname, '../', 'app'));
    app.set('view engine', 'ejs');
};