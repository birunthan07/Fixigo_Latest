import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';
import FirstMonthPayment from './PaymentPage1.js'; // Assuming this is your payment component

// Load your Stripe publishable key
const stripePromise = loadStripe('pk_test_51Q7DZt1RpkHfFiUIAgrv2uSadu7aTjWwagCmxpPNQ6TG0Mi1ANX5YVngI3AzBNpPd3yCzNDZUxOl6zcoEEcSKqB900yHuw1Cv5');

const PaymentPage = () => {
  // Extract mechanicId and token from the URL
  const { mechanicId, token } = useParams();

  // Debugging: Check if mechanicId and token are being captured correctly
  console.log('Mechanic ID:', mechanicId);
  console.log('Token:', token);

  // Ensure mechanicId and token are present
  if (!mechanicId || !token) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="text-red-600">Error: Missing Mechanic ID or Token. Please use the correct URL.</div>
      </div>
    );
  }

  // Render the Stripe payment form
  return (
    <Elements stripe={stripePromise}>
      <FirstMonthPayment mechanicId={mechanicId} token={token} />
    </Elements>
  );
};

export default PaymentPage;
