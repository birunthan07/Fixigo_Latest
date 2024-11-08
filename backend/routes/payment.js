// const express = require('express');
// const Stripe = require('stripe');
// const Payment = require('../models/Payments');
// const router = express.Router();

// const stripe = Stripe('sk_test_51Q7DZt1RpkHfFiUIiMz9Ouj9DTkPqGcp6PynCn75Y1jCS03KYzYyM9SGRJU86U6nfLQh9eAWbyUtRaC4ZlvyL9ge006oBsjR0J');

// router.post('/create-payment-intent', async (req, res) => {
//   const { amount, currency } = req.body;

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//     });

//     const newPayment = new Payment({
//       amount,
//       currency,
//       paymentIntentId: paymentIntent.id,
//       status: paymentIntent.status,
//     });

//     await newPayment.save();

//     res.status(200).json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error('Error creating payment intent:', error.message);
//     res.status(500).json({ error: 'Failed to create payment intent' });
//   }
// });

// module.exports = router;
const express = require('express');
const Stripe = require('stripe');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

const paymentSchema = new mongoose.Schema({
  paymentIntentId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  clientSecret: { type: String, required: true },
  cardholderName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

const isSubscriptionExpired = (createdAt) => {
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  return new Date() - new Date(createdAt) > thirtyDaysInMs;
};

router.post('/payment-intent', async (req, res) => {
  const { amount, cardholderName } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  if (!cardholderName || typeof cardholderName !== 'string' || !cardholderName.trim())
    return res.status(400).json({ error: 'Cardholder name is required' });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    const newPayment = new Payment({
      paymentIntentId: paymentIntent.id,
      amount,
      currency: 'usd',
      clientSecret: paymentIntent.client_secret,
      cardholderName: cardholderName.trim(),
    });

    await newPayment.save();
    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: 'Error creating payment intent', details: error.message });
  }
});

router.get('/subscription-status', async (req, res) => {
  try {
    const lastPayment = await Payment.findOne().sort({ createdAt: -1 });
    if (!lastPayment) return res.status(200).json({ isExpired: true });

    const isExpired = isSubscriptionExpired(lastPayment.createdAt);
    res.status(200).json({ isExpired });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving subscription status', details: error.message });
  }
});

module.exports = router;
