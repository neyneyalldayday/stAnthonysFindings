// server.js
const express = require('express');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sequelize = require('./config/connection.js');
const Donation = require('./models/Donation.js');

const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata
    });

    // Store donation record in PostgreSQL
    const donationRecord = await Donation.create({
      amount: amount,
      donor_name: metadata.donorName,
      email: metadata.email,      
      stripe_payment_intent_id: paymentIntent.id,
      status: 'pending'
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook for successful payments
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // Update donation status in database
     await Donation.update(
      { status: 'completed' },
      { where: { stripe_payment_intent_id: paymentIntent.id } }
    );
  }

  res.json({received: true});
});


sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database sync failed:', err);
  });