//紀錄RFID入櫃和出櫃
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shelfrecSchema = new Schema({
    SN: { type: String }, //固定貨架編號以利人員搜尋
    Locale: { type: String, required: true }, //架位 TAG ID
    EPC: { type: String, required: true }, //移動貨架 TAG ID
    Action: { type: String, required: true }, //1: 入櫃， 2: 出櫃
    Checked: { type: String, default: '' }, //預設未確認, Checked: 已確認
    systemTime: { type: Date, default: Date.now },
});

/*
// Virtual for this Reader URL.
AreaderSchema
    .virtual('url')
    .get(function () {
        return '/catalog/areader/' + this._id;
    });
*/

module.exports = mongoose.model('shelfrec', shelfrecSchema);