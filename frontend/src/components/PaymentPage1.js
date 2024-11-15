// import React, { useState, useEffect } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Initialize Stripe
// const stripePromise = loadStripe('pk_test_51Q7DZt1RpkHfFiUIAgrv2uSadu7aTjWwagCmxpPNQ6TG0Mi1ANX5YVngI3AzBNpPd3yCzNDZUxOl6zcoEEcSKqB900yHuw1Cv5');

// const PaymentForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [subscriptionExpired, setSubscriptionExpired] = useState(false);
//   const [cardholderName, setCardholderName] = useState('');
  
//   const amount = 1000; // Fixed amount in cents
//   const packageDetails = {
//     name: 'Fixed $10 Package',
//     description: 'Payment for a fixed package of $10',
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError(null);

//     if (!cardholderName.trim()) {
//       toast.error("Please enter the cardholder's name");
//       setLoading(false);
//       return;
//     }

//     try {
//       const { data } = await axios.post('http://localhost:5000/create-payment-intent', {
//         amount,
//         cardholderName,
//       });

//       const clientSecret = data.clientSecret;

//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: cardholderName,
//           },
//         },
//       });

//       if (result.error) {
//         setError(result.error.message);
//         toast.error('Payment failed: ' + result.error.message);
//       } else if (result.paymentIntent.status === 'succeeded') {
//         setSuccess(true);
//         toast.success(`Payment of $${(amount / 100).toFixed(2)} successful!`);
//         checkSubscriptionStatus(); // Check subscription status after successful payment
//       } else {
//         toast.error('Payment failed. Please try again.');
//       }
//     } catch (error) {
//       setError('Payment error');
//       toast.error('Payment failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkSubscriptionStatus = async () => {
//     try {
//       const { data } = await axios.get('http://localhost:5000/subscription-status');
//       if (data.isExpired) {
//         setSubscriptionExpired(true);
//         toast.info('Your subscription has expired.');
//       }
//     } catch (error) {
//       console.error('Error checking subscription status:', error);
//       toast.error('Failed to check subscription status.');
//     }
//   };

//   useEffect(() => {
//     // Check subscription status on mount to notify if it’s expired
//     checkSubscriptionStatus();
//   }, []);

//   return (
//     <form onSubmit={handleSubmit} className="payment-form">
//       <h4 className="mb-4">Enter Card Details</h4>

//       <div className="form-group mb-3">
//         <label htmlFor="cardholderName">Cardholder Name</label>
//         <input
//           type="text"
//           id="cardholderName"
//           className="form-control"
//           value={cardholderName}
//           onChange={(e) => setCardholderName(e.target.value)}
//           required
//         />
//       </div>

//       <div className="form-group mb-3">
//         <CardElement className="form-control" />
//       </div>

//       <div className="mb-3">
//         <p><strong>Package Name:</strong> {packageDetails.name}</p>
//         <p><strong>Description:</strong> {packageDetails.description}</p>
//       </div>

//       <button type="submit" className="btn btn-primary w-100" disabled={!stripe || loading}>
//         {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
//       </button>

//       {error && <div className="alert alert-danger mt-3">{error}</div>}
//       {success && <div className="alert alert-success mt-3">Payment successful!</div>}
//       {subscriptionExpired && <div className="alert alert-warning mt-3">Subscription expired!</div>}
//     </form>
//   );
// };

// const PaymentPage = () => (
//   <div className="container payment-container">
//     <div className="row justify-content-center">
//       <div className="col-md-6">
//         <div className="card p-4 mt-5">
//           <h2 className="text-center mb-4">Complete Your Payment</h2>
//           <Elements stripe={stripePromise}>
//             <PaymentForm />
//           </Elements>
//         </div>
//       </div>
//     </div>
//     <ToastContainer
//       position="top-center"
//       autoClose={8000}
//       hideProgressBar={false}
//       newestOnTop={false}
//       closeOnClick
//       rtl={false}
//       pauseOnFocusLoss
//       draggable
//       pauseOnHover
//     />
//   </div>
// );

// export default PaymentPage;


import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51Q7DZt1RpkHfFiUIAgrv2uSadu7aTjWwagCmxpPNQ6TG0Mi1ANX5YVngI3AzBNpPd3yCzNDZUxOl6zcoEEcSKqB900yHuw1Cv5');

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api/mechanic', // Assuming the mechanic API is served from port 8000
  headers: {
    'Content-Type': 'application/json',
  }
});

const FirstMonthPayment = ({ mechanicId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        if (!mechanicId) {
          throw new Error('Mechanic ID is required');
        }

        const response = await api.post('/create-payment-intent', {
          mechanicId,
          amount: 1000, // Amount in cents (e.g., $10)
          currency: 'usd'
        });

        if (!response.data?.clientSecret) {
          throw new Error('Invalid server response');
        }

        setClientSecret(response.data.clientSecret);
        setPaymentId(response.data.paymentId);
        setError('');
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to create payment intent';
        setError(errorMessage);
        console.error('Payment intent error:', err);
      }
    };

    fetchPaymentIntent();
  }, [mechanicId]);

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not been initialized');
      return;
    }

    if (!clientSecret) {
      setError('Payment not initialized properly');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        await api.post('/payment-success', {
          paymentId,
          transactionId: paymentIntent.id,
          mechanicId
        });

        setMessage('Payment successful!');
        setTimeout(() => {
          navigate(`/mechanic-dashboard/${mechanicId}`); // Navigate to mechanic dashboard
        }, 2000);
      } else {
        throw new Error('Payment not completed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Payment failed';
      setError(errorMessage);
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!mechanicId) {
    return <div className="p-4 text-red-600">Mechanic ID is required</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handlePayment} className="space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {message && <div className="text-green-600 text-sm">{message}</div>}
        
        <div className="border p-3 rounded">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#blue',
                '::placeholder': {
                  color: '#black',
                },
              },
              invalid: {
                color: '#red',
              },
            },
          }}/>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading || !mechanicId || !clientSecret}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Pay First Month Fee'}
        </button>
      </form>
    </div>
  );
};

const PaymentPage = ({ mechanicId }) => {
  if (!mechanicId) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="text-red-600">
          Error: Mechanic ID is required. Please ensure you're passing the mechanic ID correctly.
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <FirstMonthPayment mechanicId={mechanicId} />
    </Elements>
  );
};

export default PaymentPage;
