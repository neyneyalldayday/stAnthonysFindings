const router = require('express').Router();
const { Sequelize } = require('sequelize');
const Donation = require('../../models/Donation');



router.get("/donationInfo", async (req, res) => {
   try {
    const allDonations = await Donation.findAll();
    res.status(200).json(allDonations);
   } catch (err) {
    console.error(err);
    
   }
})


router.get('/donationTotal', async (req,res)  => {
    try {
        const result = await Donation.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.cast(Sequelize.col('amount'),
                     'DECIMAL(10,2)')), 
                     'totalAmount'
                ]               
            ],
            raw: true
        });

        const totalCents = parseFloat(result.totalAmount) || 0;
        const totalDollars = totalCents / 100


        res.status(200).json({
            totalAmount : totalDollars,
            formatedTotal:  `$${totalDollars.toFixed(2)}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to calculate total donations' });
    }
});


router.get('/topDonations', async (req, res) => {
    try {
        const topDonations = await Donation.findAll({
            attributes: [
                'id',
                'amount',
                'donor_name',
                'email',
                'stripe_payment_intent_id',
                
            ],
            order: [
                [Sequelize.cast(Sequelize.col('amount'), 'DECIMAL(10,2)'), 'DESC']
            ],
            limit:5,
            raw:true
        });


        const formattedDonations = topDonations.map(donation => ({
            ...donation,
            amount: parseFloat(donation.amount) || 0,
            formattedAmount: `$${(parseFloat(donation.amount) || 0).toFixed(2)}`
        }));


        res.status(200).json({
            topDonations: formattedDonations,
            count: formattedDonations.length
        })





    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch top donations'});
        
    }
})






module.exports = router;