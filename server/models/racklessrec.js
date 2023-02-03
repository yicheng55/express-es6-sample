//紀錄QR code入櫃和出櫃
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var racklessrecSchema = new Schema({
    Locale: { type: String, required: true }, //架位編號
    PN: { type: String, required: true }, //物料編號
    Count: { type: String, required: true }, //數量
    Action: { type: String, required: true }, //1: 入櫃， 2: 出櫃
    Checked: { type: String, default: '' }, //預設未確認, Checked: 已確認
    systemTime: { type: Date, default: Date.now },
});

// Virtual for this Reader URL.
racklessrecSchema
    .virtual('url')
    .get(function() {
        return '/catalog/areader/' + this._id;
    });

module.exports = mongoose.model('racklessrec', racklessrecSchema);