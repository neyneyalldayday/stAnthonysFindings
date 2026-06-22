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


router.get('/donationTotal', async (req, res) => {
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

        // Check if we have a valid total
        let totalDollars = 0;
        
        if (result && result.totalAmount !== null) {
            const totalCents = parseFloat(result.totalAmount);
            totalDollars = totalCents / 100;
        }

        res.status(200).json({
            totalAmount: totalDollars,
            formattedTotal: `$${totalDollars.toFixed(2)}`
        });
        
    } catch (err) {
        console.error('Error calculating donation total:', err);
        res.status(500).json({ error: 'Failed to calculate total donations' });
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
            amount: (parseFloat(donation.amount) || 0) / 100,
            formattedAmount: `$${((parseFloat(donation.amount) || 0) / 100).toFixed(2)}`
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