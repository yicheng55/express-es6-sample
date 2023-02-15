import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

import catalogRouter from './src/routes/catalog.routes.js';  //Import routes for "catalog" area of site
import productRouter from './src/routes/product.routes.js';  //Import routes for "catalog" area of site
import flds_userRouter from './src/routes/flds_user.routes.js';
import * as userConfig from './src/config/user.config.js';
console.log(userConfig);
global.userConfig = userConfig;
// console.log(global);
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// console.log( __dirname );
// console.log( __filename );

app.use('/', indexRouter);
app.use('/user', usersRouter);

app.use('/catalog/user', flds_userRouter);  // Add product routes to middleware chain.
app.use('/catalog/product', productRouter);  // Add product routes to middleware chain.
// 最後放'/catalog'才不會被攔截
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.


export default app;
