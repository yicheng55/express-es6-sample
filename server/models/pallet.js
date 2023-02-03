//移動貨架紀錄
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var palletSchema = new Schema(
    {
        SN: { type: String, required: true },       //編號
        TagID: { type: String, required: true },    //Bind RFID
        AtagID: { type: String, required: true },   //Bind active Tag
        Products: [{ PN: String, Count: Number }],
        Description: { type: String },              //說明
        systemTime: { type: Date, default: Date.now }   //修改時間
    }
);


// Virtual for this Reader URL.
palletSchema
    .virtual('url')
    .get(function () {
        return '/catalog/pallet/' + this._id;
    });


module.exports = mongoose.model('pallet', palletSchema);
