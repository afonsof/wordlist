module.exports = function (sequelize, DataTypes) {
    var Word = sequelize.define('Word', {

        text: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return Word;
};