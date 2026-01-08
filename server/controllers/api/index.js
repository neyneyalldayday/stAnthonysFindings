const router = require('express').Router()
const donationController = require('./donation-controller');
const recordController = require('./records-controller');

router.use('/donation', donationController);
router.use('/records', recordController);

 


module.exports = router;