"use strict";
module.exports = function (sequelize, DataTypes) {
    var Document = sequelize.define("Document", {
        title: DataTypes.STRING,
        text: DataTypes.TEXT,
        type: DataTypes.ENUM('website', 'music', 'movie')
    }, {
        classMethods: {
            associate: function (models) {
                Document.hasMany(models.Word, { through: 'document_words'});
            }
        }
    });
    return Document;
};