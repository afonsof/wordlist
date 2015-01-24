module.exports = function (sequelize, DataTypes) {
    var Word = sequelize.define('Word', {

        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        known: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function (models) {
                Word.hasMany(models.Document, { through: 'document_words'});
            }
        }
    });
    return Word;
};