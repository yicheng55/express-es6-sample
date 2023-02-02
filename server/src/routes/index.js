'use strict';
import { Router } from 'express';
var router = Router();

/* GET home page. */
router.get('/', function (req, res) {
    // console.log('req = %s', req);
    res.redirect('/catalog');
});

export default router;