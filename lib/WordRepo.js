//constructor
var WordRepo = function (db) {
    this.wl = db;
};

WordRepo.prototype = {

    add: function (obj) {

        var scope = this;

        this.wl.Word.count({text: obj.text}).done(function (err, count) {
            if (count > 0) {
                scope.wl.Word.update({text: obj.text}, obj).exec(function (err) {
                    console.log("This word already exists and was updated.");
                });
                return;
            }

            scope.wl.Word
                .create(obj)
                .done(function (err, user) {

                });
        });
    },
    in: function( words, callback ){
        return this.wl.collections.word.find({ name: words }).exec(callback);
    }
};

module.exports = WordRepo;