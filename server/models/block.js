//紀錄區域內的Active Tag
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var blockSchema = new Schema(
    {
        Area: { type: String },     //區域名稱
        IP: { type: String, required: true },       //Reader IP address
        Atag: [{ type: String, required: true }],   //區域內Tag List
        systemTime: { type: Date, default: Date.now },
    }
);

/*
// Virtual for this Reader URL.
AreaderSchema
    .virtual('url')
    .get(function () {
        return '/catalog/areader/' + this._id;
    });
*/

module.exports = mongoose.model('blockarea', blockSchema);