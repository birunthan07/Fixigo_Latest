// // import React, { useState } from 'react';
// // import { loadStripe } from '@stripe/stripe-js';
// // import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// // import axios from 'axios';

// // const stripePromise = loadStripe('pk_test_51Q7DZt1RpkHfFiUIAgrv2uSadu7aTjWwagCmxpPNQ6TG0Mi1ANX5YVngI3AzBNpPd3yCzNDZUxOl6zcoEEcSKqB900yHuw1Cv5');

// // function PaymentForm() {
// //   const stripe = useStripe();
// //   const elements = useElements();
// //   const [error, setError] = useState(null);
// //   const [success, setSuccess] = useState(false);

// //   const handleSubmit = async (event) => {
// //     event.preventDefault();

// //     const { data } = await axios.post('http://localhost:8000/create-payment-intent', {
// //       amount: 1000, // Example: amount in cents
// //       currency: 'usd',
// //     });

// //     const clientSecret = data.clientSecret;

// //     const result = await stripe.confirmCardPayment(clientSecret, {
// //       payment_method: {
// //         card: elements.getElement(CardElement),
// //       },
// //     });

// //     if (result.error) {
// //       setError(result.error.message);
// //     } else {
// //       if (result.paymentIntent.status === 'succeeded') {
// //         setSuccess(true);
// //       }
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit}>
// //       <CardElement />
// //       <button type="submit" disabled={!stripe}>
// //         Pay
// //       </button>
// //       {error && <div>{error}</div>}
// //       {success && <div>Payment successful!</div>}
// //     </form>
// //   );
// // }

// // function PaymentPage() {
// //   return (
// //     <Elements stripe={stripePromise}>
// //       <PaymentForm />
// //     </Elements>
// //   );
// // }

// // export default PaymentPage;

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51Q7DZt1RpkHfFiUIAgrv2uSadu7aTjWwagCmxpPNQ6TG0Mi1ANX5YVngI3AzBNpPd3yCzNDZUxOl6zcoEEcSKqB900yHuw1Cv5');

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cardholderName, setCardholderName] = useState('');

  const amount = 1000; // Fixed amount in cents
  const packageDetails = {
    name: 'Fixed $10 Package',
    description: 'Payment for a fixed package of $10',
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!cardholderName.trim()) {
      toast.error("Please enter the cardholder's name");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:5000/create-payment-intent', {
        amount,
        cardholderName,
      });

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: cardholderName,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        toast.error('Payment failed: ' + result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSuccess(true);
        toast.success(`Payment of $${(amount / 100).toFixed(2)} successful!`);
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      setError('Payment error');
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h4 className="mb-4">Enter Card Details</h4>

      <div className="form-group mb-3">
        <label htmlFor="cardholderName">Cardholder Name</label>
        <input
          type="text"
          id="cardholderName"
          className="form-control"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          required
        />
      </div>

      <div className="form-group mb-3">
        <CardElement className="form-control" />
      </div>

      <div className="mb-3">
        <p><strong>Package Name:</strong> {packageDetails.name}</p>
        <p><strong>Description:</strong> {packageDetails.description}</p>
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">Payment successful!</div>}
    </form>
  );
};

const PaymentPage = () => (
  <div className="container payment-container">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card p-4 mt-5">
          <h2 className="text-center mb-4">Complete Your Payment</h2>
          <Elements stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        </div>
      </div>
    </div>
    <ToastContainer
      position="top-center"
      autoClose={8000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </div>
);

export default PaymentPage;
