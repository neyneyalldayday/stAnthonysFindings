const router = require('express').Router()
const donationController = require('./donation-controller');



router.use('/donation', donationController);


 


module.exports = router;