'use strict';

// logger.trace('Some trace messages')
// logger.debug('Some debug messages')
// logger.info('Some info messages')
// logger.warn('Some warn messages')
// logger.error('Some error messages')
// logger.fatal('Some fatal messages')
import log4js from 'log4js';

log4js.configure({
    appenders: {
        std: { type: "stdout", level: "all", layout: { type: "basic", } },
        std1: { type: "stdout", level: "all", layout: { type: "messagePassThrough", } },
        file: {
            type: "file",
            filename: "./log/controller.log",
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
        },
        LogErr: {
            type: "file",
            filename: "./log/LogErr.log",
            maxLogSize: 4000000, // 4 MB
            backups: 20, //2 copies
            encoding: "utf-8"
        }
    },
    categories: {
        default: { appenders: ["std"], level: "all" },
        RFID: { appenders: ["std", "file"], level: "all" },
        Controller: { appenders: ["std", "file"], level: "all" },
        Moverfid: { appenders: ["std", "moverfid"], level: "info" },
        Al510lowdata: { appenders: ["std", "al510lowdata"], level: "info" },
        LogErr: { appenders: ["std", "LogErr"], level: "info" }
    }

})

export const rfidlogger = log4js.getLogger('RFID');
export const Controllerlogger = log4js.getLogger('Controller');
export const logErr = log4js.getLogger('LogErr');

// export { rfidlogger, Controllerlogger, logErr };
