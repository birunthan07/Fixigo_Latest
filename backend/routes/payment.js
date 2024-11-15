const express = require('express');
const Payment = require('../models/Payments');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



router.post('/create-payment-intent', async (req, res) => {
  try {
    const { mechanicId, amount, currency } = req.body;

    if (!mechanicId || !amount || !currency) {
      return res.status(400).json({ 
        message: 'Missing required fields: mechanicId, amount, and currency are required' 
      });
    }

    // Create payment record first
    const payment = new Payment({
      mechanicId,
      amount,
      currency,
      status: 'pending'
    });
    await payment.save();

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        mechanicId,
        paymentId: payment._id.toString()
      }
    });

    // Update payment record with Stripe ID
    payment.stripePaymentIntentId = paymentIntent.id;
    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/payment-success', async (req, res) => {
  try {
    const { paymentId, transactionId, mechanicId } = req.body;
    
    if (!paymentId || !transactionId || !mechanicId) {
      return res.status(400).json({ 
        message: 'Missing required fields: paymentId, transactionId, and mechanicId are required' 
      });
    }

    // Find the payment by ID
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Ensure that the mechanic ID matches the payment's mechanicId
    if (payment.mechanicId.toString() !== mechanicId) {
      return res.status(403).json({ message: 'Unauthorized access to payment' });
    }

    // Update the payment status to 'completed'
    payment.status = 'completed';
    payment.transactionId = transactionId;
    await payment.save();

    // Now update the mechanic's hasPaid status to true
    const mechanic = await Mechanic.findById(mechanicId);
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }

    mechanic.hasPaid = true; // Update the mechanic's hasPaid status
    await mechanic.save();

    res.json({ 
      message: 'Payment updated successfully and mechanic\'s hasPaid status updated' 
    });
  } catch (error) {
    console.error('Payment success update error:', error);
    res.status(500).json({ 
      message: 'Failed to update payment and mechanic status'
    });
  }
});



module.exports = router;



// const express = require('express');
// const Stripe = require('stripe');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');

// dotenv.config();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const router = express.Router();

// const paymentSchema = new mongoose.Schema({
//   paymentIntentId: { type: String, required: true, unique: true },
//   amount: { type: Number, required: true },
//   currency: { type: String, required: true },
//   clientSecret: { type: String, required: true },
//   cardholderName: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const Payment = mongoose.model('Payment', paymentSchema);

// const isSubscriptionExpired = (createdAt) => {
//   const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
//   return new Date() - new Date(createdAt) > thirtyDaysInMs;
// };

// router.post('/payment-intent', async (req, res) => {
//   const { amount, cardholderName } = req.body;

//   if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
//   if (!cardholderName || typeof cardholderName !== 'string' || !cardholderName.trim())
//     return res.status(400).json({ error: 'Cardholder name is required' });

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: 'usd',
//       payment_method_types: ['card'],
//     });

//     const newPayment = new Payment({
//       paymentIntentId: paymentIntent.id,
//       amount,
//       currency: 'usd',
//       clientSecret: paymentIntent.client_secret,
//       cardholderName: cardholderName.trim(),
//     });

//     await newPayment.save();
//     res.status(201).json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     res.status(500).json({ error: 'Error creating payment intent', details: error.message });
//   }
// });

// router.get('/subscription-status', async (req, res) => {
//   try {
//     const lastPayment = await Payment.findOne().sort({ createdAt: -1 });
//     if (!lastPayment) return res.status(200).json({ isExpired: true });

//     const isExpired = isSubscriptionExpired(lastPayment.createdAt);
//     res.status(200).json({ isExpired });
//   } catch (error) {
//     res.status(500).json({ error: 'Error retrieving subscription status', details: error.message });
//   }
// });

// module.exports = router;
