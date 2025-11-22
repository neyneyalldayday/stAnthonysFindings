import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react'; // ← CRITICAL: This was missing
import { donate } from "../../services/api";
import './donation.css'
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Inner form component
const DonationForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(2500);
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;

    setIsLoading(true);
    
    try {
      const donationData = {
        amount: amount,
        currency: 'usd',
        metadata: {
          donorName: donorName,
          email: email,
        }
      };

      const result = await donate(donationData);
      
      if (result.error) {
        console.error(result.error);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      
      const { error } = await stripe.confirmCardPayment(result.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: donorName,
            email: email,
          },
        }
      });

      if (error) {
        console.error(error);
      } else {
        alert('Thank you for your donation!');
      }
    } catch (error) {
      console.error('Donation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="donation-form">
      <h2>Support St Anthony's Findings</h2>
      <form onSubmit={handleSubmit}  className="donation-input">
        <input
          type="text"
          placeholder="Your Name"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <div className="amount-options">
          {[100, 500, 1000, 2500, 5000, 10000].map(amt => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmount(amt)}
            >
              ${amt / 100}
            </button>
          ))}
        </div>

        <div className="card-element">
          <CardElement />
        </div>

        <button type="submit" disabled={!stripe || isLoading}>
          Donate ${amount / 100}
        </button>
      </form>
    </div>
  );
};

// Outer wrapper component
const DonationPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <DonationForm />
    </Elements>
  );
};

export default DonationPage;