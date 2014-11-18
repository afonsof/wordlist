//constructor
var WordRepo = function (wl) {
    this.wl = wl;
};

WordRepo.prototype = {

    add: function (obj) {

        var scope = this;

        this.wl.collections.word.count({name: obj.name}).exec(function (err, count) {
            if (count > 0) {
                scope.wl.collections.word.update({name: obj.name}, obj).exec(function () {
                    console.log("This word already exists and was updated.");
                });
                return;
            }

            scope.wl.collections.word
                .create(obj)
                .exec(function (err, user) {
                });
        });
    },
    in: function( words, callback ){
        return this.wl.collections.word.find({ name: words }).exec(callback);
    }
};

module.exports = {
  WordRepo: WordRepo
};