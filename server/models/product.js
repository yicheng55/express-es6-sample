//Product屬性紀錄
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    PN: { type: String, required: true }, //Model No.
    Material: { type: String, required: true }, //材質
    Length: { type: String, required: true }, //長度
    // Color: { type: String, required: true },       //顏色
    Color: { type: String }, //顏色
    Locale: [{ Shelf: String, Count: Number }], //存放位置和數量
    Description: { type: String }, //說明
    systemTime: { type: Date, default: Date.now } //修改時間
});


// Virtual for this Reader URL.

productSchema
    .virtual('url')
    .get(function() {

        return '/catalog/product/' + this._id;
    });


module.exports = mongoose.model('product', productSchema);