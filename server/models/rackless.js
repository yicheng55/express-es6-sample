//Rackless屬性紀錄
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var racklessSchema = new Schema({
    SN: { type: String, required: true }, //架位編號
    // PN: { type: String },           //Product's PN
    //Length: { type: String, required: true },       //長度
    //Color: { type: String, required: true },       //顏色
    Products: [{ PN: String, Count: Number }],
    //Count: { type: Number, required: true },        //數量
    Description: { type: String }, //說明
    systemTime: { type: Date, default: Date.now } //修改時間
});


// Virtual for this Reader URL.
racklessSchema
    .virtual('url')
    .get(function() {
        return '/catalog/racklesslist/' + this._id;
    });


module.exports = mongoose.model('rackless', racklessSchema);