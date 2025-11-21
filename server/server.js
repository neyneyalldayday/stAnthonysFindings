// server.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('./config/connection.js')

const app = express();


app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata
    });

    // Store donation record in PostgreSQL
    const donationRecord = await pool.query(
      `INSERT INTO donations (amount, donor_name, email, project, stripe_payment_intent_id, status)
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [amount, metadata.donorName, metadata.email, metadata.project, paymentIntent.id]
    );

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
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
    await pool.query(
      'UPDATE donations SET status = $1 WHERE stripe_payment_intent_id = $2',
      ['completed', paymentIntent.id]
    );
  }

  res.json({received: true});
});