//Passive Reader屬性紀錄
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var preaderSchema = new Schema(
    {
        Hostname: { type: String },             //Host name
        IP: { type: String, required: true },   //Reader IP address
        Model: { type: String },                //Model name AL510
        Stacker: { type: String },              //堆高機編號
        Description: { type: String },          //說明
        systemTime: { type: Date, default: Date.now }   //修改時間
    }
);


// Virtual for this Reader URL.
preaderSchema
    .virtual('url')
    .get(function () {
        return '/catalog/preader/' + this._id;
    });


module.exports = mongoose.model('preader', preaderSchema);