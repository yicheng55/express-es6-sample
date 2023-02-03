//Active Reader屬性紀錄
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var areaderSchema = new Schema(
    {
        Hostname: { type: String },                 //Host name
        IP: { type: String, required: true },       //Reader IP address
        Areaname: { type: String, required: true }, //區域名稱
        Model: { type: String },                //Model name AL1320
        Description: { type: String },              //說明
        systemTime: { type: Date, default: Date.now }   //修改時間
    }
);


// Virtual for this Reader URL.
areaderSchema
    .virtual('url')
    .get(function () {
        return '/catalog/areader/' + this._id;
    });


module.exports = mongoose.model('areader', areaderSchema);