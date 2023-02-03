'use strict';

// logger.trace('Some trace messages')
// logger.debug('Some debug messages')
// logger.info('Some info messages')
// logger.warn('Some warn messages')
// logger.error('Some error messages')
// logger.fatal('Some fatal messages')

const log4js = require('log4js');

log4js.configure({
    appenders: {
        std: { type: "stdout", level: "all", layout: { type: "basic", } },
        std1: { type: "stdout", level: "all", layout: { type: "messagePassThrough", } },
        file: {
            type: "file",
            filename: "./log/RFIDAtag.log",
            maxLogSize: 20000000, // 20 MB
            backups: 10, //10 copies
            encoding: "utf-8"
        },
        moverfid: {
            type: "file",
            filename: "./log/moverfid.log",
            maxLogSize: 200000, // 0.2MB
            backups: 2, //2 copies
            encoding: "utf-8"
        },
        al510lowdata: {
            type: "file",
            filename: "./log/al510lowdata.log",
            maxLogSize: 4000000, // 4 MB
            backups: 20, //2 copies
            encoding: "utf-8"
        }
    },
    categories: {
        default: { appenders: ["std"], level: "all" },
        RFID: { appenders: ["std", "file"], level: "all" },
        Atag: { appenders: ["std", "file"], level: "info" },
        Moverfid: { appenders: ["std", "moverfid"], level: "info" },
        Al510lowdata: { appenders: ["std", "al510lowdata"], level: "info" }
    }

})

//const logger = log4js.getLogger();  //拿到 log4js 系統中預設的 log
const rfidlogger = log4js.getLogger('RFID');
const ataglogger = log4js.getLogger('Atag');
const moverfidlogger = log4js.getLogger('Moverfid');
const al510lowdatalogger = log4js.getLogger('Al510lowdata');
//logger.level = 'all';

module.exports = { rfidlogger, ataglogger, moverfidlogger, al510lowdatalogger };
//module.exports = { log4js };