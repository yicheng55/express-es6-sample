//櫃架屬性紀錄
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shelfSchema = new Schema(
    {
        SN: { type: String },     //編號
        TagID: { type: String, required: true },    //架位RFID
        PtagID: { type: String },                   //架上移動貨架RFID，表示架上有移動貨架
        Description: { type: String},               //說明        
        systemTime: { type: Date, default: Date.now }   //修改時間
    }
);


// Virtual for this Reader URL.
shelfSchema
    .virtual('url')
    .get(function () {
        return '/catalog/shelf/' + this._id;
    });


module.exports = mongoose.model('shelf', shelfSchema);
