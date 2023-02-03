'use strict';
const LoggerRFID = require('../comm/logger').rfidlogger;

let fs = require('fs');
let ini = require('ini');

//Paser config.ini
let config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const TAGCOUNT_AAAA = config.passive.tagcount_AAAA;
const TAGCOUNT_BBBB = config.passive.tagcount_BBBB;

const RFIDARRAYRECLENGTH = config.passive.rfidarrayreclength;
const ULTRASONICSTTHRESHOLD = config.passive.ultrasonicstthreshold;

const rfidobj = [{
        EPC: '',
        TID: '',
        TIME: '',
        COUNT: 0
    },
    {
        EPC: '',
        TID: '',
        TIME: '',
        COUNT: 0

        // EPC: 'AAAAAAAAAAAAAA0000000000',
        // TID: '',
        // TIME: '',
        // COUNT: 0
    }
];


let rfidarrayrec = []; //rfid data from reader, 保留 EPC + COUNT
let rfidarrayrec_result = [];
let count = 0;

// Object initializer
// for (let i = 0; i < RFIDARRAYRECLENGTH; i++) {
//     rfidarrayrec.push(rfidobj);
// }
exports.rfidarrayrec_result = rfidarrayrec_result;

/*
 * ***************************************************
 * 移除重複RFID
 * @param {any} rfid
 * var rfid = {
        EPC: '',
        TID: '',
        TIME: '',
        COUNT: 0
    };
 * 依COUNT排序，大->小
 */

exports.rfidsole = function(rfid) {
    var len = rfid.length;
    let rfidres = [];
    let rfidarrayrecsort = [];
    let rfidarrayrecsortAA = [];
    let rfidarrayrecsortBB = [];
    let rfidarrayrecsortUltrasonicst = [];
    let foundindex = -1;

    /*
        // LoggerRFID.trace('rfid.length= ' + rfid.length);
        // if (rfid.length === 0) {
        //     return rfidres;
        // }
        // // LoggerRFID.trace('rfidarrayrec0000.length= ' + rfidarrayrec.length);
        // if (rfidarrayrec.length >= RFIDARRAYRECLENGTH) {
        //     rfidarrayrec.shift(); //移除最前面一筆紀錄
        // }
        // rfidarrayrec.push(rfid);

        // // LoggerRFID.trace(rfidarrayrec);
        // LoggerRFID.trace('rfidarrayrec1111.length= ' + rfidarrayrec.length);

        // // LoggerRFID.trace('rfidarrayrec.length= ' + rfidarrayrec.length);

        // // 取代 for loop 2維陣列處理
        // rfidarrayrec.forEach(elem => {
        //     // LoggerRFID.trace('elem.length= %s', elem.length);

        //     // elem.forEach(elem => {
        //     elem.forEach(function(elem, index) {
        //         rfidarrayrecsort.push(elem);
        //         // // LoggerRFID.trace('index = %s, elem.EPC= %s', index, elem.EPC);
        //         // foundindex = rfidarrayrecsort.findIndex(rank => rank.EPC === elem.EPC);
        //         // // LoggerRFID.trace('foundindex = ' + foundindex);
        //         // if (foundindex > -1) {
        //         //     // 如果已有相同EPC則數量累計增加
        //         //     rfidarrayrecsort[foundindex].COUNT += elem.COUNT;
        //         // } else {
        //         //     rfidarrayrecsort.push(elem);
        //         // }
        //     });

        // });

        // // LoggerRFID.trace(rfidarrayrecsort);
        // LoggerRFID.trace('rfidarrayrecsort.length= ' + rfidarrayrecsort.length);


        // var sid = rfidarrayrecsort.filter(function(ele, pos) {
        //     // LoggerRFID.trace('rfidsole: ' + ele.EPC + ',' + pos + ',' + rfid.indexOf(ele.EPC));
        //     var index;
        //     for (let i = 0; i < rfidarrayrecsort.length; i++) {
        //         if (ele.EPC == rfidarrayrecsort[i].EPC) {
        //             index = i;
        //             break;
        //         }
        //     }
        //     return index == pos; //只找第一次出現的
        // });
        // console.log(sid);
        // //Count
        // sid.forEach(elem => {
        //     for (let i = 0; i < rfidarrayrecsort.length; i++) {
        //         if (elem.EPC == rfidarrayrecsort[i].EPC) {
        //             elem.COUNT++;
        //         }
        //     }
        // });

        // sid.sort(function(a, b) {
        //     return b.COUNT - a.COUNT;
        // })

        // // LoggerRFID.trace(sid);
        // LoggerRFID.trace('sid.length= ' + sid.length);
        // console.log(sid);
        // return sid;
     */

    var sid = rfid.filter(function(ele, pos) {
        // LoggerRFID.trace('rfidsole: ' + ele.EPC + ',' + pos + ',' + rfid.indexOf(ele.EPC));
        var index;
        for (let i = 0; i < rfid.length; i++) {
            // console.log(ele.EPC + '  :  ' + rfid[i].EPC);
            if (ele.EPC == rfid[i].EPC) {
                index = i;
                break;
            }
        }
        // console.log(index);
        return index == pos; //只找第一次出現的
    });

    // console.log(sid);

    //Count
    sid.forEach(elem => {
        for (let i = 0; i < rfid.length; i++) {
            if (elem.EPC == rfid[i].EPC) {
                elem.COUNT++;
            }
        }
    });

    sid.sort(function(a, b) {
        return b.COUNT - a.COUNT;
    })

    LoggerRFID.trace(sid);
    LoggerRFID.trace('sid.length= ' + sid.length);
    // console.log(sid);
    // return sid;

    // **************************   累加4筆數量 排序   start   **********************************
    if (sid.length > 0) {
        count = 0;

        if (rfidarrayrec.length >= RFIDARRAYRECLENGTH) {
            rfidarrayrec.shift(); //移除最前面一筆紀錄
        }
        rfidarrayrec.push(sid);
        // rfidarrayrec_result.push(sid);

    } else {
        count++;
        // 連續 RFIDARRAYRECLENGTH 次沒有資料則清空 rfidarrayrec = [].
        if (count > RFIDARRAYRECLENGTH) {
            rfidarrayrec = [];
            // rfidarrayrec_result = []
            // // Object initializer
            // for (let i = 0; i < RFIDARRAYRECLENGTH; i++) {
            //     LoggerRFID.trace(rfidobj);
            //     rfidarrayrec.push(rfidobj);
            // }
            LoggerRFID.trace('Reset rfidarrayrec.length= ' + rfidarrayrec.length);
            count = 0;
            return rfidres;
        };

        // 緩衝移除 rfidarrayrec
        if (rfidarrayrec.length > 0) {
            rfidarrayrec.shift(); //移除最前面一筆紀錄
        };

        if (rfidarrayrec.length === 0) {
            return rfidres;
        };

        // // rfidarrayrec = [];
        // // rfidarrayrec Object initializer
        // for (let i = 0; i < RFIDARRAYRECLENGTH; i++) {
        //     LoggerRFID.trace(rfidobj);
        //     rfidarrayrec.push(rfidobj);
        // }
        // rfidres = [];
        // return rfidres;
    };

    LoggerRFID.trace('rfidarrayrec.length= ' + rfidarrayrec.length);
    LoggerRFID.trace(rfidarrayrec);

    // 取代 for loop 2維陣列處理
    rfidarrayrec.forEach(elem => {
        // LoggerRFID.trace('elem.length= %s', elem.length);

        // elem.forEach(elem => {
        elem.forEach(function(elem, index) {
            // LoggerRFID.trace('index = %s, elem.EPC= %s', index, elem.EPC);
            foundindex = rfidarrayrecsortAA.findIndex(rank => rank.EPC === elem.EPC);
            LoggerRFID.trace('foundindex = ' + foundindex);
            if (foundindex > -1) {
                // 如果已有相同EPC則數量累計增加
                if (elem.EPC[0] === 'A') {
                    rfidarrayrecsortAA[foundindex].COUNT += elem.COUNT;
                }


            } else {
                // 如果沒有相同EPC則push使用深拷貝增加elem.
                if (elem.EPC[0] === 'A') {
                    rfidarrayrecsortAA.push(JSON.parse(JSON.stringify(elem)));
                }
            }
            foundindex = -1;
            foundindex = rfidarrayrecsortUltrasonicst.findIndex(rank => rank.EPC === elem.EPC);
            LoggerRFID.trace('foundindex = ' + foundindex);
            if (foundindex > -1) {
                // 如果已有相同EPC則數量累計增加
                if (elem.EPC[0] === 'F') {
                    rfidarrayrecsortUltrasonicst[foundindex].COUNT += elem.COUNT;
                }
            } else {
                // 如果沒有相同EPC則push使用深拷貝增加elem.
                if (elem.EPC[0] === 'F') {
                    rfidarrayrecsortUltrasonicst.push(JSON.parse(JSON.stringify(elem)));
                }
            }

        });

    });

    rfidarrayrec.forEach(elem => {
        // LoggerRFID.trace('elem.length= %s', elem.length);

        // elem.forEach(elem => {
        elem.forEach(function(elem, index) {
            // LoggerRFID.trace('index = %s, elem.EPC= %s', index, elem.EPC);
            foundindex = rfidarrayrecsortBB.findIndex(rank => rank.EPC === elem.EPC);
            LoggerRFID.trace('foundindex = ' + foundindex);
            if (foundindex > -1) {
                // 如果已有相同EPC則數量累計增加
                if (elem.EPC[0] === 'B') {
                    rfidarrayrecsortBB[foundindex].COUNT += elem.COUNT;
                }

            } else {
                // 如果沒有相同EPC則push使用深拷貝增加elem.
                if (elem.EPC[0] === 'B') {
                    rfidarrayrecsortBB.push(JSON.parse(JSON.stringify(elem)));
                }
            }
        });

    });

    // LoggerRFID.trace('rfidarrayrecsortAA before:');
    // LoggerRFID.trace(rfidarrayrecsortAA);

    // LoggerRFID.trace('rfidarrayrecsortBB before:');
    // LoggerRFID.trace(rfidarrayrecsortBB);

    rfidarrayrecsortAA.sort(function(a, b) {
        return b.COUNT - a.COUNT;
    });


    rfidarrayrecsortBB.sort(function(a, b) {
        return b.COUNT - a.COUNT;
    });

    LoggerRFID.trace('rfidarrayrecsortAA:');
    LoggerRFID.trace(rfidarrayrecsortAA);

    LoggerRFID.trace('rfidarrayrecsortBB:');
    LoggerRFID.trace(rfidarrayrecsortBB);

    LoggerRFID.trace('rfidarrayrecsortUltrasonicst:');
    LoggerRFID.trace(rfidarrayrecsortUltrasonicst);

    // 沒有偵測到超音波，則不做入/出櫃處理. return rfidres = [];
    if (ULTRASONICSTTHRESHOLD > 0) {
        if (rfidarrayrecsortUltrasonicst.length === 0) {
            rfidres = [];
            return rfidres;
        }
    }

    if (rfidarrayrecsortAA.length) {

        // rfidres.push(rfidarrayrecsortAA[0]);
        if (rfidarrayrecsortAA[0].COUNT > TAGCOUNT_AAAA) {
            rfidres.push(rfidarrayrecsortAA[0]);
        }
    }

    if (rfidarrayrecsortBB.length) {
        // rfidres.push(rfidarrayrecsortBB[0]);
        if (rfidarrayrecsortBB[0].COUNT > TAGCOUNT_BBBB) {
            if (rfidarrayrecsortBB.length > 1) {
                if (rfidarrayrecsortBB[1].COUNT > TAGCOUNT_BBBB) {
                    // 同時出現2個B櫃位判斷上下櫃位關係，上櫃編號 > 下櫃編號，取編號較大者.
                    if (rfidarrayrecsortBB[0].EPC > rfidarrayrecsortBB[1].EPC) {
                        rfidres.push(rfidarrayrecsortBB[0]);
                    } else {
                        rfidres.push(rfidarrayrecsortBB[1]);
                    }
                } else {
                    rfidres.push(rfidarrayrecsortBB[0]);
                }
            } else {
                rfidres.push(rfidarrayrecsortBB[0]);
            }
        }
    }

    // for (let i = 0; i < rfidarrayrec.length; i++) {
    //     // rfidarrayrec[i].length
    //     LoggerRFID.trace('rfidarrayrec[%s].length= %s', i, rfidarrayrec[i].length);
    //     for (let j = 0; j < rfidarrayrec[i].length; j++) {
    //         foundindex = rfidarrayrecsort.findIndex(rank => rank.EPC === rfidarrayrec[i][j].EPC);
    //         LoggerRFID.trace('foundindex = ' + foundindex);
    //         if (foundindex > -1) {
    //             // 如果已有相同EPC則數量累計增加
    //             rfidarrayrecsort[foundindex].COUNT += rfidarrayrec[i][j].COUNT;
    //         } else {
    //             rfidarrayrecsort.push(rfidarrayrec[i][j]);
    //         }
    //     }
    // }

    // var forEachIt = rfidarrayrec[i].forEach(function(item, index, array)) {
    //     LoggerRFID.trace('item = %s,  index = %s ', item, index);
    // }


    // console.log('rfidarrayrecsort before:');
    // console.log(rfidarrayrecsort);

    // rfidarrayrecsort.sort(function(a, b) {
    //     return b.COUNT - a.COUNT;
    // });
    // LoggerRFID.trace('rfidarrayrecsort.length= ' + rfidarrayrecsort.length);
    // LoggerRFID.trace(rfidarrayrecsort);

    // // **************************   累加4筆數量 排序   end    **********************************


    // // 歷史資料檢查
    // // 只取 'AAAAAAAA' & 'BBBBBBBBB' EPC 數量最大的... 數量相同則取最前一筆.
    // let foundindexA = rfidarrayrecsort.findIndex(rank => rank.EPC[0] === 'A');
    // // let foundindex = rfidsoled.findIndex(rank => rank.EPC[0] === 'A' && rank.EPC[0] === 'B');
    // LoggerRFID.trace('foundindexA = ' + foundindexA);
    // if (foundindexA > -1) {
    //     if (rfidarrayrecsort[foundindexA].COUNT > TAGCOUNT_AAAA) {
    //         rfidres.push(rfidarrayrecsort[foundindexA]);
    //     } else {
    //         LoggerRFID.trace('foundindexA.COUNT = ' + rfidarrayrecsort[foundindexA].COUNT);
    //     }
    // }
    // let foundindexB = rfidarrayrecsort.findIndex(rank => rank.EPC[0] === 'B');
    // // let foundindex = rfidsoled.findIndex(rank => rank.EPC[0] === 'A' && rank.EPC[0] === 'B');
    // LoggerRFID.trace('foundindexB = ' + foundindexB);
    // if (foundindexB > -1) {
    //     if (rfidarrayrecsort[foundindexB].COUNT > TAGCOUNT_BBBB) {
    //         rfidres.push(rfidarrayrecsort[foundindexB]);
    //     } else {
    //         LoggerRFID.trace('foundindexB.COUNT = ' + rfidarrayrecsort[foundindexB].COUNT);
    //     }
    // }

    LoggerRFID.trace('rfidres:');
    LoggerRFID.trace(rfidres);

    // // 即時資料檢查
    // // 只取 'AAAAAAAA' & 'BBBBBBBBB' EPC 數量最大的... 數量相同則取最前一筆.
    // let foundindexA = sid.findIndex(rank => rank.EPC[0] === 'A');
    // // let foundindex = rfidsoled.findIndex(rank => rank.EPC[0] === 'A' && rank.EPC[0] === 'B');
    // LoggerRFID.trace('foundindexA = ' + foundindexA);
    // if (foundindexA > -1) {
    //     if (sid[foundindexA].COUNT > TAGCOUNT) {
    //         rfidres.push(sid[foundindexA]);
    //     } else {
    //         LoggerRFID.trace('foundindexA.COUNT = ' + sid[foundindexA].COUNT);
    //     }
    // }
    // let foundindexB = sid.findIndex(rank => rank.EPC[0] === 'B');
    // // let foundindex = rfidsoled.findIndex(rank => rank.EPC[0] === 'A' && rank.EPC[0] === 'B');
    // LoggerRFID.trace('foundindexB = ' + foundindexB);
    // if (foundindexB > -1) {
    //     if (sid[foundindexB].COUNT > TAGCOUNT) {
    //         rfidres.push(sid[foundindexB]);
    //     } else {
    //         LoggerRFID.trace('foundindexB.COUNT = ' + sid[foundindexB].COUNT);
    //     }
    // }
    // LoggerRFID.trace('rfidres:');
    // LoggerRFID.trace(rfidres);

    return rfidres;
}

//module.exports = { rfidsole };