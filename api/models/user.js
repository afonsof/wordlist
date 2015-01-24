"use strict";
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        userName: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                User.hasMany(models.Word);
            }
        }
    });
    return User;
};