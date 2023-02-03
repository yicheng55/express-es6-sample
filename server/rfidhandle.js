'use strict';
/***************************************/
/*rfidhandle.js                        */
/*處理RFID Reader AL510                */
/**************************************/
const async = require('async');
const net = require('net'); //Network socket
const mongoose = require('mongoose');
const fs = require('fs');
const ini = require('ini');
const lineReader = require('line-reader');
const GPIOdata = require('./src/models/gpiodata.js');
// //This sets up the file finder
// var finder = require('findit').find(__dirname);
// //This listens for directories found
// finder.on('directory', function(dir) {
//     console.log('Directory: ' + dir + '/');
// });
// //This listens for files found
// finder.on('file', function(file) {
//     console.log('File: ' + file);
// });

// const filename = Path.basename('./log/RFIDAtag.log')
// console.log(filename);

// Synchronously Check if a File Exists
const Fs = require('fs');
const Path = require('path');
let path = Path.join(__dirname, "./log/RFIDAtag.log");
let res = Fs.existsSync(path);
console.log(path + ' == ' + res);

if (res === true) {
    var file = "./log/RFIDAtag.log";
    var dateCreated = fs.statSync(file).birthtime;
    console.log("This File was born on:" + dateCreated);

    // 使用檔案建立日期為檔名
    let today = new fs.statSync(file).birthtime;
    // let today = new Date();
    // let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    let hh = today.getHours();
    let mm = today.getMinutes();
    let ss = today.getSeconds();
    if (dd < 10) dd = '0' + dd;
    if (hh < 10) hh = '0' + hh;
    if (mm < 10) mm = '0' + mm;
    if (ss < 10) ss = '0' + ss;

    let RFIDAtagfile_name = './log/RFIDAtag_' + dd + hh + mm + ss + '.txt'
    console.log(RFIDAtagfile_name);
    fs.rename('./log/RFIDAtag.log', RFIDAtagfile_name, function(err) {
        if (err) throw err;
        console.log('File RFIDAtag Renamed.');
    });

}

path = Path.join(__dirname, "./log/al510lowdata.log");
res = Fs.existsSync(path);
console.log(path + ' == ' + res);

if (res === true) {
    var file = "./log/al510lowdata.log";
    var dateCreated = fs.statSync(file).birthtime;
    console.log("This File was born on:" + dateCreated);

    // 使用檔案建立日期為檔名
    let today = new fs.statSync(file).birthtime;
    // let today = new Date();
    // let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    let hh = today.getHours();
    let mm = today.getMinutes();
    let ss = today.getSeconds();
    if (dd < 10) dd = '0' + dd;
    if (hh < 10) hh = '0' + hh;
    if (mm < 10) mm = '0' + mm;
    if (ss < 10) ss = '0' + ss;

    let al510lowdatafile_name = './log/al510lowdata_' + dd + hh + mm + ss + '.txt'
    console.log(al510lowdatafile_name);
    fs.rename('./log/al510lowdata.log', al510lowdatafile_name, function(err) {
        if (err) throw err;
        console.log('File al510lowdata Renamed.');
    });
}


const Logger = require('./src/comm/logger').rfidlogger;
const moveLogger = require('./comm/logger').moverfidlogger;
const al510lowdata = require('./src/comm/logger').al510lowdatalogger;

const utils = require('./comm/utils');
var shelfInst = require('./models/shelfrec');
var Shelves = require('./models/shelf');

/*
const AL510IP = '192.168.31.33';
//const AL510IP = '192.168.68.11';
const AL510PORT = 1001;   //Reader data port
const CONFIRMCOUNT = 4;    //多次重覆讀到才確認
const READINTERVAL = 500;  //每秒Reader讀一次
const AL510QT = 3;
*/
// const recordfile = './log/shelfrecord.log';
//const configini = path.join(__dirname, 'config.ini');

const LF = String.fromCharCode(0xA); //ASCII Convert
const CR = String.fromCharCode(0xD);

//var rfidarray = [];     //rfid data from reader, 整理一次讀取只有RFID數據

var shelf = {
    LocrfidID: '',
    MatrfidID: '',
    MatatagID: '',
    CarTime: null,
    ShelfTime: null,
    MatID: '',
    Matdesc: ''
};


Logger.info('//*********************** rfidhandle.js start..... *******************// ');
//Connect mongoDB
var mongoDB = 'mongodb://127.0.0.1/ABBApoc';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
Logger.info('Connects MongoDB: ' + mongoDB);
moveLogger.info('moveLogger start.... ');



//Paser config.ini
var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const AL510IP = config.passive.al510ip;
const AL510PORT = config.passive.al510port; //Reader data port
const AL510QT = config.passive.al510tq;

const AL510SINGLEANTENNA = config.passive.al510singleantenna;
const AL510LOOPANTENNA = config.passive.al510loopantenna;
const AL510LOOPTIME = config.passive.al510looptime;
const AL510HEARDBEATTIME = config.passive.al510heardbeattime;
const AL510POWER = config.passive.al510power;

const CONFIRMCOUNTIN = config.passive.confirmcountin; //多次重覆讀到才確認
const CONFIRMCOUNT = config.passive.confirmcount; //多次重覆讀到才確認
const CONFIRMCOUNTOUT = config.passive.confirmcountout; //多次重覆讀到才確認

const READINTERVAL = config.passive.readinterval; //每間隔時間Reader讀一次
const RECONNECTTIME = config.passive.reconnecttime;
const CHANGEPALLET = config.passive.changepallet;
const LOWDATARX = config.passive.lowdatarx;
const AL510_DATASOURCE = config.passive.al510_datasource;
const POWERALARMTIME = config.passive.poweralarmtime;
const POWERTHRESHOLDADC = config.passive.powerthresholdadc;
const ULTRASONICSTTHRESHOLD = config.passive.ultrasonicstthreshold;

//移動架進出儲櫃架位處裡
let IDstate = 0;
let count = 0;
let count0 = 0;
let countarray = [0, 0, 0, 0]; // For sub case 0:, case 1:, case 2:, case 3:
let datatest = '';
let rxnumber = 0;
let rxlosscnt = 0;

// GPIO 控制處理
let Ultrasonicst = 0;
let GPIOdataVal = {};
let PowerAlarmCnt = 0;
let PowerAlarmstate = false;
// // Test code.......
// console.log('Test code.......');
// console.log(utils.rfidarrayrec_result);

function sleepPromise(ms = 0) {
    Logger.debug('sleepPromise ms= ' + ms);
    return new Promise(r => setTimeout(r, ms));
}

// async function sleepPromise(ms = 0) {
//     console.log('sleep ms = ' + ms);
//     return new Promise(function(resolve, reject) {
//         setTimeout(function() {
//             resolve();
//         }, ms);
//     });
// }

function sleep(ms = 0) {
    Logger.debug('sleep ms= ' + ms);
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


async function promisedDivision(n1, n2) {
    await sleepPromise(10);
    if (n2 === 0) {
        return Promise.reject(new Error('Cannot divide by 0'));
    } else {
        return Promise.resolve(n1 / n2);
    }
}

async function divideWithAwait(data) {
    // await sleepPromise(1000);            // 無法同步等待.
    return await promisedDivision(data, 2);
}


// (async() => {
//     for (let i = 0; i < 9; i++) {
//         console.log(i);
//         const result = await divideWithAwait(i + 6);
//         console.log(result); // logs 3
//         // await sleepPromise(10);
//     }
// })();

async function run() {
    for (let i = 0; i < 9; i++) {
        console.log(i);
        const result = await divideWithAwait(i + 6);
        console.log(result); // logs 3
        // await sleepPromise(10);
    }
}
// run();




// async function logWord(word) {
//     // await sleepPromise(10);
//     return new Promise(function(resolve, reject) {
//         // await sleepPromise(10);          // SyntaxError: await is only valid in async function
//         setTimeout(function() {
//             console.log(word)
//             resolve()
//         }, Math.floor(Math.random() * 100) + 1)
//     })
// }

// // function logAll() {
// //     logWord('A')
// //     .then(function() {
// //         return logWord('B')
// //     })
// //     .then(function() {
// //         return logWord('C')
// //     })
// // }

// async function logAll() {
//     await logWord('A')
//     await logWord('B')
//     await logWord('C')
// }
// logAll();




// async function run() {
//     const result = await divideWithAwait(66);
//     console.log(result); // logs 3
// }
// run();

// async function sleep(milliseconds) {

//     setTimeout(function() {
//         // resolve();
//         console.log('sleep %s ms ', milliseconds);
//     }, milliseconds);

//     // const date = Date.now();
//     // let currentDate = null;
//     // do {
//     //     currentDate = Date.now();
//     // } while (currentDate - date < milliseconds);
// }


//Supports multi-AL510
let clients = [];
let rxStrBuff = '';

for (let i = 0; i < AL510IP.length; i++) {
    var netsocket = {
        socket: new net.Socket(),
        ip: AL510IP[i],
        data: [],
        flag: 0
    };
    clients.push(netsocket);
    //client[i] = new net.Socket();
}

//console.log(clients);

if (AL510_DATASOURCE === '0') {
    //--- Entry point -------------------------------
    clients.forEach(function(tcpsocket, index) {
        connect(tcpsocket);
    });
} else {
    // 重放資料檔案測試
    let data = '';
    lineReader.eachLine('./log/al510lowdata.txt', function(line, last) {
        console.log(`Line from file:${line.slice(53)}`);
        if (line.slice(53).includes("@END")) {
            data = LF + line.slice(53) + CR;
        } else {
            data = LF + '@2022/07/09 20:08:09.210-Antenna2-U3400' + line.slice(53);
        }

        AL510_data(data);
        if (last) {
            console.log('Last line printed.');
            const used = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
        }
    });

}

//Entry point
//connect();

function read_EPC_TID(client_socket) {
    var cmdstr = LF + '@U' + AL510QT + ',R2,0,6' + CR; //'@U3,R2,0,6'
    //console.log('Send command: ' + cmdstr);
    client_socket.write(cmdstr);
}

// 測試WIFI斷線後重心連線機制.因AL510斷線後要60秒才能重新連線無法變更控制時間
// function read_EPC(client_socket) {
//     var cmdstr = LF + '@U' + AL510QT + CR; // '@U3'

//     if (rxStrBuff.length === 0) {
//         rxlosscnt++;
//         Logger.debug('rxlosscnt: ' + rxlosscnt);
//         // Test disconnect active.
//         Logger.debug('rxlosscnt % 30: ' + (rxlosscnt % 20));
//         if (rxlosscnt % 30 === 0) {
//             disconnect(client_socket);
//             return;
//         }

//     } else {
//         rxlosscnt = 0;
//         Logger.debug('rxStrBuff.length: ' + rxStrBuff.length);
//     }

//     rxStrBuff = '';
//     Logger.debug('Send command: ' + cmdstr);
//     // console.log(client_socket);
//     client_socket.write(cmdstr);

//     // Test disconnect active.
//     // if (count++ === 20) {
//     //     disconnect(client_socket);
//     // }
// }


function read_EPC(client_socket) {

    console.log(GPIOdataVal);
    if (GPIOdataVal) {
        if (parseInt(GPIOdataVal.Battery) < parseInt(POWERTHRESHOLDADC)) {
            Logger.debug('GPIOdataVal.Battery=%s < POWERTHRESHOLDADC=%s ', GPIOdataVal.Battery, POWERTHRESHOLDADC);
            PowerAlarmCnt++;
            Logger.debug('PowerAlarmCnt= %s', PowerAlarmCnt);
            if (PowerAlarmCnt === (POWERALARMTIME / READINTERVAL)) {
                // if (PowerAlarmCnt === 10) {
                PowerAlarmstate = PowerAlarmstate ? false : true;
                if (PowerAlarmstate) {
                    // LAMP ON
                    // 每個Port設定需要各別執行，設定4個port則命令要下4次指定
                    // [0x0a][@]OutputRelays{port[[N]]},[state 1,0][0x0d]
                    // port[[N]] ==> N=1~4, 1=NO1, 2=NO2, 3=NO3, 4=NO4
                    // Response: [0x0a][@]OutputRelays000[0x0d]
                    var cmdstr = LF + '@OutputRelays2,1' + CR;
                    Logger.debug('Send command: ' + cmdstr);
                    // console.log(client_socket);
                    client_socket.write(cmdstr);
                } else {
                    // LAMP OFF
                    var cmdstr = LF + '@OutputRelays2,0' + CR;
                    Logger.debug('Send command: ' + cmdstr);
                    // console.log(client_socket);
                    client_socket.write(cmdstr);
                }
                PowerAlarmCnt = 0
            } else {
                var cmdstr = LF + '@U' + AL510QT + CR; // '@U3'
                Logger.debug('Send command: ' + cmdstr);
                // console.log(client_socket);
                client_socket.write(cmdstr);
            }

        } else {
            Logger.debug('GPIOdataVal.Battery=%s < POWERTHRESHOLDADC=%s ', GPIOdataVal.Battery, POWERTHRESHOLDADC);
            Logger.debug('PowerAlarmstate=%s', PowerAlarmstate)
            PowerAlarmCnt = 0;
            if (PowerAlarmstate) {
                PowerAlarmstate = false;
                // LAMP OFF
                // 每個Port設定需要各別執行，設定4個port則命令要下4次指定
                // [0x0a][@]OutputRelays{port[[N]]},[state 1,0][0x0d]
                // port[[N]] ==> N=1~4, 1=NO1, 2=NO2, 3=NO3, 4=NO4
                // Response: [0x0a][@]OutputRelays000[0x0d]
                var cmdstr = LF + '@OutputRelays2,0' + CR;
                Logger.debug('Send command: ' + cmdstr);
                // console.log(client_socket);
                client_socket.write(cmdstr);
            } else {
                var cmdstr = LF + '@U' + AL510QT + CR; // '@U3'
                Logger.debug('Send command: ' + cmdstr);
                // console.log(client_socket);
                client_socket.write(cmdstr);
            }
        }

    } else {
        var cmdstr = LF + '@U' + AL510QT + CR; // '@U3'
        Logger.debug('Send command: ' + cmdstr);
        // console.log(client_socket);
        client_socket.write(cmdstr);

    }

}



// function delay(t, v) {
//     return new Promise(function(resolve) {
//         setTimeout(resolve.bind(null, v), t)
//     });
// }

// Promise.prototype.delay = function(t) {
//     return this.then(function(v) {
//         return delay(t, v);
//     });
// }


// Promise.resolve("hello").delay(500).then(function(v) {
//     console.log('AAAAAAADDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD' + v);
// });

// lineReader.eachLine('./log/al510lowdata.txt', function(line, last) {
//     console.log(`Line from file: ${line}`);
//         if(last) {
//             console.log('Last line printed.');
//             const used = process.memoryUsage().heapUsed / 1024 / 1024;
//             console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
//         }
//     });

function delayms(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function connect(client) {
    let setInterID = 0;
    client.socket.connect(AL510PORT, client.ip, function() {
        //console.log('CONNECTED TO: ' + AL510IP + ':' + AL510PORT);
        Logger.info('CONNECTED TO: ' + client.ip + ':' + AL510PORT);
        // logAll();
        AL510_init(client.socket);

        client.socket.setKeepAlive(true, 60000); //每分鐘，解決中途斷線重連線

    });

    client.socket.on('error', function(err) {
        Logger.fatal('Connect AL510 fail，error code: %s', err.code);
        client.socket.destroy();
    });

    client.socket.on('close', function() {
        Logger.warn('Connection closed');
        // client.socket.end();
        // Logger.warn('Connection end()');
        // client.socket.destroy();
        // Logger.warn('Connection destroy()');
        console.log(new Date() + ', clearInter ID:' + setInterID);
        clearInterval(setInterID);
        reconnect(client);

    });

    client.socket.on("end", () => {
        Logger.warn("Connection ended")
            // client.socket.destroy();
            // reconnect(client)
    });

    //Received data from AL1320
    client.socket.on('data', function(data) {
        AL510_data(data);
    });


    async function sendCommand01(client_socket, cmdstr, milliseconds = 100) {
        return new Promise(function(resolve, reject) {
            console.log('PromiseAAA: ' + cmdstr)
            rxStrBuff = '';
            client_socket.write(cmdstr);

            setTimeout(function() {
                    Logger.trace('PromiseBBBB rxStrBuff: ' + rxStrBuff.length);
                    if (rxStrBuff.length > 10) {
                        resolve(rxStrBuff);
                        // resolve('Success.....');
                    } else {
                        Logger.trace('Promise reject(), rxStrBuff: ' + rxStrBuff.length);
                        reject('Fail.....');
                        // reject('Fail.....');
                    }

                }, milliseconds)
                // Logger.trace(msToTime(new Date().getTime()) + ' PromiseCCCCC rxStrBuff: ' + rxStrBuff.length);
        }).then(function(response) {
            // data = response;
            // console.log(response);
            return response;
        }).catch((response) => {
            console.log(response);
            return response;
        });
    }



    async function sendCommand(client_socket, cmdstr, milliseconds = 3000) {
        Logger.debug('PromiseAAA: ' + cmdstr)
        rxStrBuff = '';
        client_socket.write(cmdstr);
        const date = Date.now();
        let currentDate = null;
        do {
            await sleepPromise(20);
            // await sleep(20);
            currentDate = Date.now();
            if (rxStrBuff.length > 10) {
                Logger.debug('PromiseBBBB rxStrBuff: ' + rxStrBuff.length);
                break;
            }
        } while (currentDate - date < milliseconds);
        return rxStrBuff;

        // return new Promise(function(resolve, reject) {
        //     console.log(msToTime(new Date().getTime()) + ' PromiseAAA: ' + cmdstr)
        //     rxStrBuff = '';
        //     client_socket.write(cmdstr);
        //     const date = Date.now();
        //     let currentDate = null;
        //     do {
        //         // await sleepPromise(20);    //無法用此 sleepPromise(20);
        //         currentDate = Date.now();
        //         if (rxStrBuff.length > 10) {
        //             break;
        //         }
        //     } while (currentDate - date < milliseconds);
        // });
    }


    // function logWord(word) {
    //     return new Promise(function(resolve, reject) {
    //         setTimeout(function() {
    //             console.log(word)
    //             resolve()
    //         }, Math.floor(Math.random() * 1000) + 1)
    //     })
    // }

    // function logAll() {
    //     logWord('A')
    //     .then(function() {
    //         return logWord('B')
    //     })
    //     .then(function() {
    //         return logWord('C')
    //     })
    // }

    // async function logAll() {
    //     await logWord('A')
    //     await logWord('B')
    //     await logWord('C')
    // }




    async function AL510_init(client_socket) {
        let rxdatastr = '';
        let timeoutms = 3000;
        let currentDate = null;
        let date = 0;
        let cmdstr = '';
        let cmdstrarray = [];

        Logger.debug('Start AL510_init: ');
        // // Wifi 無作用. Net連線時有問題才做.
        // //Send 'T' command - Select Reset
        // cmdstr = LF + 'T' + CR;
        // cmdstrarray.push(cmdstr);

        cmdstr = LF + 'V' + CR;
        cmdstrarray.push(cmdstr);
        cmdstr = LF + '@OutputRelays1,0' + CR;
        cmdstrarray.push(cmdstr);
        cmdstr = LF + '@OutputRelays2,0' + CR;
        cmdstrarray.push(cmdstr);
        cmdstr = LF + '@Version' + CR;
        cmdstrarray.push(cmdstr);
        cmdstr = LF + '@Antenna' + AL510SINGLEANTENNA + CR;
        cmdstrarray.push(cmdstr);
        cmdstr = LF + '@LoopAntenna' + AL510LOOPANTENNA + CR; //Ant2(9)
        cmdstrarray.push(cmdstr);
        cmdstr = LF + '@LoopTime' + AL510LOOPTIME + CR;
        cmdstrarray.push(cmdstr);
        cmdstr = LF + '@HeardbeatTime' + AL510HEARDBEATTIME + CR;
        cmdstrarray.push(cmdstr);

        // 每個Port設定需要各別執行，設定4個port則命令要下4次指定
        // [0x0a][@]OutputRelays{port[[N]]},[state 1,0][0x0d]
        // port[[N]] ==> N=1~4, 1=NO1, 2=NO2, 3=NO3, 4=NO4
        // Response: [0x0a][@]OutputRelays000[0x0d]
        cmdstr = LF + '@OutputRelays1,1' + CR;
        cmdstrarray.push(cmdstr);

        cmdstr = LF + '@N1,' + AL510POWER + CR;
        cmdstrarray.push(cmdstr);
        cmdstr = ''; //Last command empty. AL510POWER 會回2筆資料分要2次讀取.
        cmdstrarray.push(cmdstr);

        Logger.debug('cmdstrarray len: ' + cmdstrarray.length);
        for (let i = 0; i < cmdstrarray.length; i++) {
            rxdatastr = await sendCommand(client_socket, cmdstrarray[i]);
            Logger.debug('rxdatastr:' + rxdatastr);
            delayms(500);
            // Logger.trace('Send command: ' + cmdstrarray[i]);
            // client_socket.write(cmdstrarray[i]);
            // rxStrBuff = '';
            // date = Date.now();
            // currentDate = null;
            // do {
            //     await sleepPromise(20);
            //     currentDate = Date.now();
            //     if (rxStrBuff.length > 10) {
            //         Logger.debug('PromiseBBBB rxStrBuff: ' + rxStrBuff.length);
            //         Logger.debug('Rx data: ' + rxStrBuff);
            //         break;
            //     }
            // } while (currentDate - date < timeoutms);

        }

        Logger.debug('End AL510_init: ');
        setInterID = setInterval(read_EPC, READINTERVAL, client_socket); //1 sec period
        Logger.debug('setInterval ID:' + setInterID);
        // console.log(new Date() + ', setInterval ID:' + setInterID);
    }

}

// function that reconnect the client to the server
function reconnect(reclient) {
    Logger.info('Reconnect...rfidhandle.js');

    // console.log(global.userConfig + '  :::  ' + global.count);
    // console.log(`global.userConfig  ::: %s ` ,global.count);
    // console.log(global);
    // global.count++;
    // global.userConfig = 'userConfig....rfidhandle.js';
    setTimeout(() => {
        reclient.socket.removeAllListeners() // the important line that enables you to reopen a connection
        connect(reclient)
    }, RECONNECTTIME); //每30秒重連一次
}

// function that reconnect the client to the server
function disconnect(client_socket) {
    // client_socket.end();
    client_socket.end();
    console.log('client_socket.end()');
    // client_socket.destroy();
    // console.log('client_socket.destroy()');
}


//Received data from Reader
var rfidarray = []; //rfid data from reader, 整理一次讀取只有RFID數據


function AL510_data(data) {
    // Logger.debug('RXDATA: ' + data);
    rxStrBuff = data;
    //var re = /\x0a*\x0d\x0a\x0a|-/; //分成個欄位，但無分每筆資料
    var re = /\x0a*\x0d\x0a\x0a/; //每字串一筆資料
    var arrayData = data.toString().trim().split(re);
    //var arrayString = data.toString().trim().split(/\n*\r\n\n/);

    //console.log(arrayData);

    /* ****************************************************************
     * @2021/11/28 18:33:36.825-Antenna1-VD407,00001601,CA,2
     * @Version:V5.7.200728.1
     * @2021/11/28 18:33:36.838-Antenna1-T
     * @2021/11/28 18:33:46.867-Antenna1-U34001234567890123456789055555A07
     * @2021/11/28 18:33:46.867-Antenna1-U34001234567890123456789055555A07,RE280110520007ACDA6AD0A68
     * @2021/11/28 18:33:46.912-Antenna1-U
     * @END
     *
     * ****************************************************************/
    //Parsing reader replies data
    arrayData.forEach(function(valstr, index, arr) {
        let tempstr = '';
        //console.log(valstr);
        if (valstr.includes('@END')) { //讀取結束

            Logger.trace('RFID count of a session: ' + rfidarray.length);
            if (LOWDATARX === '1') {

                console.log('Ultrasonicst = %s', GPIOdataVal.Ultrasonicst);
                GPIOdata.find()
                    .sort({ '_id': -1 })
                    .limit(1)
                    .exec(function(err, results) {
                        if (err) { return next(err); }
                        console.log(results);
                        GPIOdataVal = results[0];
                        // Ultrasonicst = results[0].Ultrasonicst;
                        // console.log('Ultrasonicst = %s', results[0].Ultrasonicst);
                        // if (results) {
                        //     Ultrasonicst = results.Ultrasonicst;
                        // }
                    });

                if (ULTRASONICSTTHRESHOLD >= 0) {
                    if (GPIOdataVal.Ultrasonicst === '1') {
                        al510lowdata.info('EPC: ' + 'FFFFFFFFFFFFFF0000000000');
                        al510lowdata.info('EPC: ' + 'FFFFFFFFFFFFFF0000000000');
                        al510lowdata.info('EPC: ' + 'FFFFFFFFFFFFFF0000000000');
                        al510lowdata.info('EPC: ' + 'FFFFFFFFFFFFFF0000000000');
                        let rfid = { //Save RFID format
                            EPC: '',
                            TID: '',
                            TIME: '',
                            COUNT: 0
                        };
                        rfid.EPC = 'FFFFFFFFFFFFFF0000000000';
                        rfid.COUNT = 4;
                        rfid.TIME = new Date()
                        rfidarray.push(rfid);
                        Logger.trace('EPC: ' + rfid.EPC);
                    }
                    //加入記錄  low data end.
                    al510lowdata.info('EPC: ' + '@END');
                    // console.log('Test code.......');
                    // console.log(utils.rfidarrayrec_result);
                }
            }
            //移動架進出儲櫃架位處裡
            palletprocess(rfidarray);

            rfidarray = []; //Reset array

        } else if (valstr.includes('@Version')) {
            Logger.info('Firmware Version: ' + valstr.slice(9));

        } else {
            var arrfield = valstr.toString().trim().split('-');
            //console.log(arrfield);

            let rfid = { //Save RFID format
                EPC: '',
                TID: '',
                TIME: '',
                COUNT: 0
            };

            arrfield.forEach(function(valstr, index, arr) {


                if (index == 0) { //Timestamp field
                    if (valstr[0] == '@') {
                        //console.log('Date: ' + valstr.slice(1));
                        rfid.TIME = Date(valstr.slice(1)); //Save to Timestamp
                        //console.log('timestamp: ' + rfid.TIME);
                    }
                } else if (index == 1) { //Antenna ID field
                    //console.log('Antenna: ' + valstr);
                } else if (index == 2) { //RFID data field
                    if (valstr.includes('V')) { //Hardware version
                        Logger.info('Device version: ' + valstr.slice(1));
                    } else if (valstr.includes('T')) {
                        Logger.trace('Reader was select reset!');
                    } else if (valstr.includes('U')) {
                        if (valstr.length > 5) { //had read RFID

                            let epcindex = valstr.indexOf("U3400"); //EPC prefix
                            let tidindex = valstr.indexOf("RE280"); //TID prefix
                            if (epcindex > -1) {
                                // Logger.trace(valstr.slice(0));
                                Logger.trace('EPC: ' + valstr.slice(epcindex + 5, epcindex + 24 + 5)); //跳過'U3400'
                                tempstr = valstr.slice(epcindex + 5, epcindex + 24 + 5);

                                // 檢查字串符合 [A-B]{14位數} + [0-9 A-F]{10位數}規則 === 0 為正確,否則為-1
                                // let re1 = /[A-B]{14}[0-9A-F]{10}/;
                                // let index1 = tempstr.search(re1);
                                let index1 = tempstr.search(/[A-F]{14}[0-9 A-F]{10}/);
                                // Logger.trace('index1 = ' + index1);
                                if (index1 === 0) {
                                    rfid.EPC = tempstr;
                                    if (LOWDATARX === '1') {
                                        //加入記錄  low data
                                        al510lowdata.info('EPC: ' + valstr.slice(epcindex + 5, epcindex + 24 + 5)); //跳過'U3400'
                                    }
                                } else {
                                    Logger.trace('EPC: date error...');
                                }

                                // Logger.trace('EPC length = ' + tempstr.length);
                                // 有時長度會不足.
                                // if (tempstr.length === 24) {
                                //     rfid.EPC = tempstr;
                                // } else {
                                //     Logger.trace('EPC: length error...');
                                // }
                            }
                            if (tidindex > -1) {
                                Logger.trace('TID: ' + valstr.slice(tidindex + 1, tidindex + 25)); //跳過'R'
                                // rfid.TID = valstr.slice(tidindex + 1, tidindex + 25);
                                tempstr = valstr.slice(tidindex + 1, tidindex + 25);

                                // TID
                                // 檢查字串符合 [A-B]{14位數} + 0-F{10位數}規則 >= 0 為正確.
                                // let index2 = tempstr.search(/[A-B]{14}[0-9A-F]{10}/);
                                // console.log(index2);

                                // Logger.trace('TID length = ' + tempstr.length);
                                // 有時長度會不足.
                                if (tempstr.length === 24) {
                                    rfid.TID = tempstr;
                                } else {
                                    Logger.trace('TID: length error...');
                                }
                            }
                            //console.log(rfid);
                            if ((rfid.EPC === '') && (rfid.TID === '')) {
                                return;
                            }
                            rfidarray.push(rfid);
                            //console.log(rfidarray);
                        }

                    }

                } else {
                    Logger.trace('Undefined: ' + arr);
                }

            });
        }
    });
}


function palletprocess(RFIDarray) {
    //console.log(RFIDarray);
    var rfidsoled = utils.rfidsole(RFIDarray); //每Tag只保留一份ID

    //State machine
    switch (IDstate) {
        case 0:
            Logger.trace('case 0:  Initial ID state, rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
            switch (rfidsoled.length) {
                case 0:
                    countarray[0]++;
                    if (countarray[0] > CONFIRMCOUNTIN) {
                        countarray = [0, 0, 0, 0];
                        count = 0;
                    }

                    break;

                case 1:
                    Logger.debug('case 0:  case 1:  Initial ID state, rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
                    // 只有讀到 1張 EPC
                    //Logger.trace('Pallet ID: ' + rfidsoled[0].EPC);
                    countarray[0] = 0;
                    if (rfidsoled[0].EPC[0] === 'A') { //Pallet Tag
                        //Logger.info('移動貨架上車： ' + rfidsoled[0].EPC);
                        countarray[1]++;
                        countarray[2] = 0;
                        count++;
                        if (countarray[1] > CONFIRMCOUNTIN) { //連續 CONFIRMCOUNTIN = 8  次為上車狀態
                            Logger.info('移動貨架上車： ' + rfidsoled[0].EPC);
                            moveLogger.info('移動貨架上車： ' + rfidsoled[0].EPC.slice(-10));
                            shelf.MatrfidID = rfidsoled[0].EPC; //確認上車，Save 移動貨架ID
                            shelf.CarTime = new Date();
                            IDstate = 1; //Pallet up
                            countarray = [0, 0, 0, 0];
                            count = 0;
                        }
                    }
                    break;

                case 2: //出櫃
                    countarray[0] = 0;
                    countarray[1] = 0;
                    countarray[2]++;
                    Logger.debug('case 0:  case 2:  Initial ID state, rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
                    // 同時讀到 2張 EPC 要有A,B同時出現才是出櫃.
                    // Logger.trace('case 0:  case 2: Initial ID state, rfidsoled.length= ' + rfidsoled.length + ',  cnt= ' + count);
                    if (countarray[2] > CONFIRMCOUNT) {

                        rfidsoled.forEach(elem => {
                            //if (elem.EPC != shelf.MatrfidID) {
                            if (elem.EPC[0] === 'B') {
                                shelf.LocrfidID = elem.EPC; //確認入櫃，save shelf ID

                            }
                            if (elem.EPC[0] === 'A') {
                                shelf.MatrfidID = elem.EPC;
                            }
                        });
                        if (shelf.LocrfidID && shelf.MatrfidID) {

                            shelf.ShelfTime = new Date();

                            IDstate = 4; //Shelf down
                            Logger.info('出櫃架位上車中： ' + shelf.LocrfidID + ', ' + shelf.MatrfidID);
                            moveLogger.info('出櫃架位上車中： ' + shelf.LocrfidID.slice(-10) + ', ' + shelf.MatrfidID.slice(-10));
                        }
                        countarray = [0, 0, 0, 0];
                        count = 0;
                    }
                    break;
            }

            break;
        case 1:
            Logger.trace(' case 1:  Pallet up : rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
            switch (rfidsoled.length) {
                case 0:
                    countarray[0]++;
                    // countarray[1] = 0;
                    countarray[2] = 0;
                    countarray[3] = 0;
                    count++;
                    Logger.debug(' case 1: case 0: Pallet up : rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);

                    if (countarray[0] > CONFIRMCOUNT) {

                        Logger.info('移動貨架下車： ' + shelf.MatrfidID);
                        moveLogger.info('移動貨架下車： ' + shelf.MatrfidID.slice(-10));

                        IDstate = 0; //Shelf up
                        countarray = [0, 0, 0, 0];
                        count = 0;
                    }
                    break;

                case 1:
                    countarray[0] = 0;
                    countarray[1]++;
                    countarray[2] = 0;
                    Logger.debug(' case 1: case 1: Pallet up : rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);

                    if (rfidsoled[0].EPC !== shelf.MatrfidID) { //不同一移動貨架
                        countarray[3]++;
                        if (countarray[3] > CONFIRMCOUNT) {
                            Logger.info('不同移動貨架下車： ' + shelf.MatrfidID);
                            moveLogger.info('不同移動貨架下車： ' + shelf.MatrfidID.slice(-10));

                            IDstate = 0; //Shelf up
                            countarray = [0, 0, 0, 0];
                            count = 0;
                        }
                    } else {
                        countarray[3] = 0;
                    }


                    break;

                case 2:
                    countarray[0] = 0;
                    // countarray[1] = 0;
                    countarray[2]++;
                    countarray[3] = 0;
                    count++;
                    Logger.debug(' case 1: case 2: Pallet up : rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
                    //console.log(count);

                    if (countarray[2] > CONFIRMCOUNT) {
                        Logger.info('移動貨架站佔用時間次數： %s', countarray[1]);
                        if (countarray[1] > CHANGEPALLET) {
                            rfidsoled.forEach(elem => {
                                //if (elem.EPC != shelf.MatrfidID) {
                                if (elem.EPC[0] === 'B') {
                                    shelf.LocrfidID = elem.EPC; //確認入櫃，save shelf ID
                                }
                            });
                            if (shelf.LocrfidID) {
                                shelf.ShelfTime = new Date();
                                Logger.info('入櫃架位中： ' + shelf.LocrfidID + ', ' + shelf.MatrfidID);
                                moveLogger.info('入櫃架位中： ' + shelf.LocrfidID.slice(-10) + ', ' + shelf.MatrfidID.slice(-10));
                                IDstate = 2; //Shelf up
                            }
                        } else {
                            rfidsoled.forEach(elem => {
                                //if (elem.EPC != shelf.MatrfidID) {
                                if (elem.EPC[0] === 'B') {
                                    shelf.LocrfidID = elem.EPC; //確認入櫃，save shelf ID
                                }
                                if (elem.EPC[0] === 'A') {
                                    shelf.MatrfidID = elem.EPC;
                                }
                            });

                            if (shelf.LocrfidID && shelf.MatrfidID) {
                                shelf.ShelfTime = new Date();
                                IDstate = 4; //Shelf down
                                Logger.info('出櫃架位上車： ' + shelf.LocrfidID + ', ' + shelf.MatrfidID);
                                moveLogger.info('出櫃架位上車： ' + shelf.LocrfidID.slice(-10) + ', ' + shelf.MatrfidID.slice(-10));
                            }
                        }
                        countarray = [0, 0, 0, 0];
                        count = 0;
                    }
                    break;
            }

            break;

        case 2: //入櫃
            Logger.trace(' case 2:  Shelf up : rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
            // Logger.trace(' case 2:  Shelf up : rfidsoled.length= ' + rfidsoled.length + ',  cnt= ' + count);
            switch (rfidsoled.length) {
                case 0:
                    countarray[0]++;
                    countarray[1] = 0;
                    countarray[2] = 0;
                    countarray[3] = 0;
                    count++;
                    Logger.debug(' case 2:  case 0:  Shelf up : rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
                    if (countarray[0] > CONFIRMCOUNTOUT) { //CONFIRMCOUNT * 2 延長離開時間避免叉車入櫃後又調整位置造成出櫃狀況.

                        Shelves.findOne({ TagID: shelf.LocrfidID })
                            .exec(function(err, results) {
                                if (err) {
                                    Logger.error("%s Database serach fail %s", shelf.LocrfidID, err);
                                    return;
                                }

                                // Logger.info(results);
                                Logger.info(results.SN)
                            });

                        Logger.info('離開架位完成入櫃： %s,  %s', shelf.LocrfidID, shelf.MatrfidID);
                        moveLogger.info('離開架位完成入櫃： %s,  %s', shelf.LocrfidID.slice(-10), shelf.MatrfidID.slice(-10));
                        //Store Record
                        // var recstring = Object.keys(shelf).map(function(key, index) {
                        //     return shelf[key];
                        // }).join(',');

                        // fs.appendFile(recordfile, '入櫃, ' + recstring + '\r\n', function(err) {
                        //     if (err) throw err;
                        // });

                        //Shelves update
                        Shelves.findOneAndUpdate({ TagID: shelf.LocrfidID }, { PtagID: '', systemTime: Date() })
                            .exec(function(err, results) {
                                if (err) {
                                    Logger.error("%s 入櫃架位 Database 更新失敗 %s", results.SN, err);
                                    moveLogger.info('入櫃架位失敗: %s', results.SN);
                                    return;
                                }
                                Logger.info('%s 入櫃架位 Database 更新成功', results.SN);
                                // moveLogger.info('入櫃架位 Database 更新成功: %s', results.SN);
                                moveLogger.info('入櫃架位成功: %s', results.SN);

                                // Logger.info(results.SN);
                                //Save to db
                                var Shelfrec = new shelfInst({
                                    SN: results.SN,
                                    Locale: shelf.LocrfidID,
                                    EPC: shelf.MatrfidID,
                                    Action: '入櫃',
                                    Checked: ''
                                });
                                Shelfrec.save(function(err) {
                                    if (err) {
                                        Logger.error("%s DB save error: %s", shelf.LocrfidID, err);
                                        return;
                                    }
                                });

                            });


                        // //Shelves update, Logger.info(results.SN); 抓不到資料
                        // Shelves.find({ TagID: shelf.LocrfidID })
                        //     .exec(function(err, results) {
                        //         if (err) {
                        //             Logger.error("%s Database serach fail %s", shelf.LocrfidID, err);
                        //             return;
                        //         }


                        //         //console.log(results);
                        //         if (results.length != 0) {
                        //             Shelves.findOneAndUpdate({ TagID: shelf.LocrfidID }, { PtagID: shelf.MatrfidID, systemTime: Date() })
                        //                 .exec(function(err, results1) {
                        //                     if (err) {
                        //                         Logger.error("%s update fail %s", shelf.LocrfidID, err);
                        //                         return;
                        //                     }
                        //                     Logger.info('架位Database更新 %s', shelf.LocrfidID);
                        //                     moveLogger.info('架位Database更新 %s', shelf.LocrfidID.slice(-10));
                        //                     Logger.debug(results1.SN);


                        //                 });


                        //             Logger.info(results);
                        //             Logger.info(results.SN)     // ??????
                        //             //Save status to db
                        //             var Shelfrec = new shelfInst({
                        //                 SN: results.SN,
                        //                 Locale: shelf.LocrfidID,
                        //                 EPC: shelf.MatrfidID,
                        //                 Action: '入櫃',
                        //                 Checked: ''
                        //             });
                        //             Shelfrec.save(function(err) {
                        //                 if (err) {
                        //                     Logger.error("%s DB save error: %s", shelf.LocrfidID, err);
                        //                     return;
                        //                 }
                        //             });

                        //         } else { //Create
                        //             var shelves = new Shelves({
                        //                 TagID: shelf.LocrfidID,
                        //                 PtagID: shelf.MatrfidID

                        //             });
                        //             shelves.save(function(err) {
                        //                 if (err) {
                        //                     Logger.error("%s DB save error: %s", shelf.LocrfidID, err);
                        //                     return;
                        //                 }
                        //                 Logger.info('新增架位Database %s', shelf.LocrfidID);
                        //                 moveLogger.info('新增架位Database %s', shelf.LocrfidID.slice(-10));
                        //             });

                        //         }

                        //     });

                        IDstate = 0;
                        countarray = [0, 0, 0, 0];
                        count = 0;
                    }
                    break;

                case 1:
                    Logger.debug(' case 2: ==> case 1:  Shelf up : rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
                    if (rfidsoled[0].EPC === shelf.MatrfidID) { //同一移動貨架
                        // countarray[1]++;
                        countarray[0] = 0;
                        countarray[1]++;
                        countarray[2] = 0;
                        countarray[3] = 0;
                        // count++;
                        // // al510lowdata_06111535.txt 測試B Tag太短會更換櫃位, shelf.LocrfidID 固定架位ID EPC
                        // 更換櫃位取消此功能.
                        // if (countarray[1] > CONFIRMCOUNT * 3) {
                        //     Logger.info('更換架位： ' + shelf.LocrfidID);
                        //     moveLogger.info('更換架位：' + shelf.LocrfidID.slice(-10));
                        //     //IDstate = 3;
                        //     IDstate = 1;
                        //     countarray = [0, 0, 0, 0];
                        //     count = 0;
                        // }
                    } else { //不同一移動貨架
                        countarray[0] = 0;
                        countarray[1] = 0;
                        countarray[2] = 0;
                        countarray[3]++;
                        // count++;

                        if (countarray[3] > CONFIRMCOUNTOUT) { //CONFIRMCOUNT * 2 延長離開時間避免叉車入櫃後又調整位置造成出櫃狀況.
                            Logger.info('不同一移動貨架......')
                            Shelves.findOne({ TagID: shelf.LocrfidID })
                                .exec(function(err, results) {
                                    if (err) {
                                        Logger.error("%s Database serach fail %s", shelf.LocrfidID, err);
                                        return;
                                    }

                                    // Logger.info(results);
                                    Logger.info(results.SN)
                                });


                            Logger.info('離開架位完成入櫃： %s,  %s', shelf.LocrfidID, shelf.MatrfidID);
                            moveLogger.info('離開架位完成入櫃： %s,  %s', shelf.LocrfidID.slice(-10), shelf.MatrfidID.slice(-10));

                            // Logger.info('離開架位完成入櫃： ' + shelf.LocrfidID);
                            // moveLogger.info('離開架位完成入櫃： ' + shelf.LocrfidID.slice(-10));
                            //Store Record
                            // var recstring = Object.keys(shelf).map(function(key, index) {
                            //     return shelf[key];
                            // }).join(',');

                            // fs.appendFile(recordfile, '入櫃, ' + recstring + '\r\n', function(err) {
                            //     if (err) throw err;
                            // });


                            //Shelves update
                            Shelves.findOneAndUpdate({ TagID: shelf.LocrfidID }, { PtagID: '', systemTime: Date() })
                                .exec(function(err, results) {
                                    if (err) {
                                        Logger.error("%s 入櫃架位 Database 更新失敗 %s", results.SN, err);
                                        moveLogger.info('入櫃架位失敗: %s', results.SN);
                                        return;
                                    }
                                    Logger.info('%s 入櫃架位 Database 更新成功', results.SN);
                                    // moveLogger.info('入櫃架位 Database 更新成功: %s', results.SN);
                                    moveLogger.info('入櫃架位成功: %s', results.SN);

                                    // Logger.info(results.SN);
                                    //Save to db
                                    var Shelfrec = new shelfInst({
                                        SN: results.SN,
                                        Locale: shelf.LocrfidID,
                                        EPC: shelf.MatrfidID,
                                        Action: '入櫃',
                                        Checked: ''
                                    });
                                    Shelfrec.save(function(err) {
                                        if (err) {
                                            Logger.error("%s DB save error: %s", shelf.LocrfidID, err);
                                            return;
                                        }
                                    });

                                });



                            // //Save status to db
                            // var Shelfrec = new shelfInst({
                            //     Locale: shelf.LocrfidID,
                            //     EPC: shelf.MatrfidID,
                            //     Action: '入櫃',
                            //     Checked: ''
                            // });
                            // Shelfrec.save(function(err) {
                            //     if (err) {
                            //         Logger.error("%s DB save error: %s", shelf.LocrfidID, err);
                            //         return;
                            //     }
                            // });

                            // //Shelves update
                            // Shelves.find({ TagID: shelf.LocrfidID })
                            //     .exec(function(err, results) {
                            //         if (err) {
                            //             Logger.error("%s Database serach fail %s", shelf.LocrfidID, err);
                            //             return;
                            //         }
                            //         //console.log(results);
                            //         if (results.length != 0) {
                            //             Shelves.updateOne({ TagID: shelf.LocrfidID }, { PtagID: shelf.MatrfidID, systemTime: Date() })
                            //                 .exec(function(err, results) {
                            //                     if (err) {
                            //                         Logger.error("%s update fail %s", shelf.LocrfidID, err);
                            //                         return;
                            //                     }
                            //                     Logger.info('架位Database更新 %s', shelf.LocrfidID);
                            //                     moveLogger.info('架位Database更新 %s', shelf.LocrfidID.slice(-10));
                            //                 });
                            //         } else { //Create
                            //             var shelves = new Shelves({
                            //                 TagID: shelf.LocrfidID,
                            //                 PtagID: shelf.MatrfidID

                            //             });
                            //             shelves.save(function(err) {
                            //                 if (err) {
                            //                     Logger.error("%s DB save error: %s", shelf.LocrfidID, err);
                            //                     return;
                            //                 }
                            //                 Logger.info('新增架位Database %s', shelf.LocrfidID);
                            //                 moveLogger.info('新增架位Database %s', shelf.LocrfidID.slice(-10));
                            //             });

                            //         }
                            //     });

                            IDstate = 0;
                            countarray = [0, 0, 0, 0];
                            count = 0;
                        }

                    }
                    break;

                case 2:
                    countarray[2]++;
                    break;
            }

            break;

        case 3: //Change Shelf
            Logger.trace('case 3: rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
            countarray[0] = 0;
            countarray[1]++;
            countarray[2] = 0;

            break;

        case 4:
            Logger.trace('case 4: Shelf down: rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
            switch (rfidsoled.length) {
                case 0:
                    countarray[0]++;
                    countarray[1] = 0;
                    countarray[2] = 0;
                    Logger.debug('case 4: case 0:  Shelf down: rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
                    count0++;
                    if (countarray[0] > CONFIRMCOUNT) {
                        //Logger.trace('Done shelf down');
                        Logger.info('放棄架位出櫃! ' + shelf.LocrfidID + ', ' + shelf.MatrfidID);
                        moveLogger.info('放棄架位出櫃! ' + shelf.LocrfidID.slice(-10) + ', ' + shelf.MatrfidID.slice(-10));
                        IDstate = 0;
                        countarray = [0, 0, 0, 0];
                    }
                    break;

                case 1:
                    countarray[0] = 0;
                    countarray[1]++;
                    countarray[2] = 0;
                    Logger.debug('case 4: case 1:  Shelf down: rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
                    count++;
                    count0 = 0;
                    if (countarray[1] > CONFIRMCOUNT) {
                        if (rfidsoled[0].EPC === shelf.MatrfidID) {
                            Logger.info('出櫃架位中： ' + shelf.LocrfidID + ', ' + shelf.MatrfidID);
                            moveLogger.info('出櫃架位中： ' + shelf.LocrfidID.slice(-10) + ', ' + shelf.MatrfidID.slice(-10));
                            // Logger.info('出櫃架位中： ' + shelf.MatrfidID);
                            // moveLogger.info('出櫃架位中： ' + shelf.MatrfidID.slice(-10));
                            IDstate = 5;
                        } else {
                            Logger.info('不同移動貨架--放棄出櫃! ' + shelf.LocrfidID + ', ' + shelf.MatrfidID);
                            moveLogger.info('不同移動貨架--放棄出櫃! ' + shelf.LocrfidID.slice(-10) + ', ' + shelf.MatrfidID.slice(-10));
                            IDstate = 0;
                            // countarray = [0, 0, 0, 0];
                        }
                        countarray = [0, 0, 0, 0];
                    }
                    break;

                case 2:
                    countarray[0] = 0;
                    countarray[1] = 0;
                    countarray[2]++;
                    Logger.debug('case 4: case 2:  Shelf down: rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
                    break;
            }
            break;

        case 5: //出櫃
            Logger.trace('case 5: rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
            //switch(rfidsoled.length) {
            //    case 0:
            countarray[0]++;
            count++;
            if (countarray[0] > CONFIRMCOUNTOUT) {

                Shelves.findOne({ TagID: shelf.LocrfidID })
                    .exec(function(err, results) {
                        if (err) {
                            Logger.error("%s Database serach fail %s", shelf.LocrfidID, err);
                            return;
                        }

                        // Logger.info(results);
                        Logger.info(results.SN);
                    });

                Logger.info('完成出櫃架位： %s,  %s', shelf.LocrfidID, shelf.MatrfidID);
                moveLogger.info('完成出櫃架位： %s,  %s', shelf.LocrfidID.slice(-10), shelf.MatrfidID.slice(-10));
                //Store Record
                // var recstring = Object.keys(shelf).map(function(key, index) {
                //     return shelf[key];
                // }).join(',');

                //console.log(recstring);

                // fs.appendFile(recordfile, '出櫃, ' + recstring + '\r\n', function(err) {
                //     if (err) throw err;
                // });


                //Shelves update
                Shelves.findOneAndUpdate({ TagID: shelf.LocrfidID }, { PtagID: '', systemTime: Date() })
                    .exec(function(err, results) {
                        if (err) {
                            Logger.error("%s 出櫃架位 Database 更新失敗 %s", shelf.LocrfidID, err);
                            moveLogger.info('出櫃架位失敗: %s', results.SN);
                            return;
                        }
                        Logger.info('%s 出櫃架位 Database 更新成功', results.SN);
                        // moveLogger.info('出櫃架位 Database 更新成功: %s', results.SN);
                        moveLogger.info('出櫃架位成功: %s', results.SN);

                        // Logger.info(results);
                        //Save to db
                        var Shelfrec = new shelfInst({
                            SN: results.SN,
                            Locale: shelf.LocrfidID,
                            EPC: shelf.MatrfidID,
                            Action: '出櫃',
                            Checked: ''
                        });
                        Shelfrec.save(function(err) {
                            if (err) {
                                Logger.error("%s DB save error: %s", shelf.LocrfidID, err);
                                return;
                            }
                        });

                    });


                // IDstate = 0; //出櫃後在移動貨架可以更換櫃位動作
                IDstate = 6;
                countarray = [0, 0, 0, 0];
                count = 0;
            }
            break;

        case 6: //完成出櫃後要等移動貨架下車或有其它EPC='BBBBBBB',才再進入Initial state
            Logger.trace(' case 6:  Pallet up : rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
            switch (rfidsoled.length) {
                case 0:
                    countarray[0]++;
                    countarray[1] = 0;
                    countarray[2] = 0;
                    countarray[3] = 0;
                    Logger.debug(' case 6: case 0: Pallet up : rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);

                    count++;
                    if (countarray[0] > CONFIRMCOUNT) {

                        Logger.info('移動貨架下車： ' + shelf.MatrfidID);
                        moveLogger.info('移動貨架下車： ' + shelf.MatrfidID.slice(-10));

                        IDstate = 0; //Initial state
                        countarray = [0, 0, 0, 0];
                        count = 0;
                    }
                    break;

                case 1:
                    countarray[0] = 0;
                    // countarray[1]++;
                    countarray[2] = 0;
                    Logger.debug(' case 6: case 1: Pallet up : rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
                    if (rfidsoled[0].EPC !== shelf.MatrfidID) { //不同一移動貨架
                        countarray[1]++;
                        if (countarray[1] > CONFIRMCOUNT) {
                            Logger.info('不同移動貨架下車： ' + shelf.MatrfidID);
                            moveLogger.info('不同移動貨架下車： ' + shelf.MatrfidID.slice(-10));

                            IDstate = 0; //Initial state
                            countarray = [0, 0, 0, 0];
                            count = 0;
                        }
                    } else {
                        countarray[3]++;
                        if (countarray[3] > CONFIRMCOUNT * 2) {
                            Logger.info('移動貨架下車： ' + shelf.MatrfidID);
                            moveLogger.info('移動貨架下車： ' + shelf.MatrfidID.slice(-10));

                            IDstate = 0; //Initial state
                            countarray = [0, 0, 0, 0];
                            count = 0;
                        }
                    }
                    break;

                case 2:
                    // 等待固定櫃位 B tag 結束才進入其它 state ,避免造成出櫃2次. 固定櫃位id=shelf.LocrfidID
                    Logger.debug(' case 6: case 2: Pallet up : rfidsoled.length= ' + rfidsoled.length + ',  countarray= ' + countarray);
                    Logger.debug('rfidsoled = %s', rfidsoled);


                    // IDstate = 0; //Initial state
                    // countarray = [0, 0, 0, 0];
                    // count = 0;
                    break;
            }
            break;
    };
};
