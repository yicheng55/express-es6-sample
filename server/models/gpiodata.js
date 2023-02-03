//Passive Reader屬性紀錄
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var gpiodataSchema = new Schema({
    Powerst: { type: String, required: true }, //Host name
    Wifist: { type: String },
    Ultrasonicst: { type: String },
    Battery: { type: String },
    Res1: { type: String },
    Res2: { type: String },
    systemTime: { type: Date, default: Date.now } //修改時間
});


// Virtual for this Reader URL.
gpiodataSchema
    .virtual('url')
    .get(function() {
        return '/catalog/gpiodata/' + this._id;
    });


module.exports = mongoose.model('gpiodata', gpiodataSchema);