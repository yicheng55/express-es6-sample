import express from 'express';
import path from 'path';
// import bodyParser from 'body-parser';
// import { URL } from 'url';
// global.userConfig = require("./src/config/user.config.js");
// console.log(global.userConfig);

// 匯入json file 方式1.
import * as userConfig from './src/config/user.config.js';
// //  匯入json file 方式2. 會產生 ExperimentalWarning.
// // (node:19044) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
// // (Use `node --trace-warnings ...` to show where the warning was created)
// import userConfig from './src/config/user.config.json' assert {type: 'json'};
console.log(userConfig);
global.userConfig = userConfig;
// Test code global.
// global.studentName = 'Kyle';
console.log(global);

import indexRouter from './src/routes/index.js';
import catalogRouter from './src/routes/catalog.routes.js';  //Import routes for "catalog" area of site
import productRouter from './src/routes/product.routes.js';  //Import routes for "catalog" area of site
// const productRouter = require('./src/routes/product.routes.js');  //Import routes for "product" area of site
// const locationRouter = require('./src/routes/location.routes.js');  //Import routes for "product" area of site
// // const flds_bindRouter = require('./src/routes/flds_bind.routes.js');  //Import routes for "product" area of site
// const flds_userRouter = require('./src/routes/flds_user.routes.js');  //Import routes for "product" area of site
import flds_userRouter from './src/routes/flds_user.routes.js';

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Express web module
const app = express();
// app.locals.moment = require('moment');

//Setup middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(urlencoded({ extended: true }));     /* bodyParser.urlencoded() is deprecated */

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(static(join(__dirname, 'node_modules')));

// console.log( __dirname );
// console.log( __filename );
// console.log( cookieParser );
// console.log( bodyParser.urlencoded() );

// app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

//middleware
app.use('/', indexRouter);
app.use('/catalog/user', flds_userRouter);  // Add product routes to middleware chain.
// // app.use('/catalog/flds_bind', flds_bindRouter);  // Add product routes to middleware chain.
// app.use('/catalog/location', locationRouter);  // Add location routes to middleware chain.
app.use('/catalog/product', productRouter);  // Add product routes to middleware chain.

// 最後放'/catalog'才不會被攔截
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let msg = {
        message: "API Not Found......"
    };
    res.status(400);
    res.json(msg);
});

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
