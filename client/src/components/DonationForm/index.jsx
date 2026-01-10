import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { donate } from "../../services/api";
import './donation.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Inner form component
const DonationForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(2500); // in cents
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  // Handle custom amount input
  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
      
      if (value) {
        const dollars = parseFloat(value);
        if (!isNaN(dollars) && dollars > 0) {
          // Convert dollars to cents for Stripe
          const cents = Math.round(dollars * 100);
          setAmount(cents);
          setIsCustomAmount(true);
        }
      }
    }
  };

  // Handle preset amount button click
  const handlePresetAmountClick = (cents) => {
    setAmount(cents);
    setIsCustomAmount(false);
    setCustomAmount(''); // Clear custom input
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;

    // Validate amount
    if (amount < 50) { // Minimum $0.50
      alert('Minimum donation is $0.50');
      return;
    }

    if (amount > 1000000) { // Maximum $10,000
      alert('Maximum donation is $10,000');
      return;
    }

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
        alert('Error processing donation: ' + result.error.message);
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
        alert('Payment failed: ' + error.message);
      } else {
        alert('Thank you for your donation!');
        // Reset form
        setDonorName('');
        setEmail('');
        setCustomAmount('');
        setIsCustomAmount(false);
        setAmount(2500); // Reset to default
      }
    } catch (error) {
      console.error('Donation error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="donation-form">
      <h2>Support St Anthony's Findings</h2>
      <form onSubmit={handleSubmit} className="donation-input">
        <div className="form-group">
          <input
            type="text"
            placeholder="Your Name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        <div className="amount-section">
          <h3>Select Donation Amount</h3>
          
          <div className="amount-options">
            {[100, 500, 1000, 2500, 5000, 10000].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => handlePresetAmountClick(amt)}
                className={`amount-button ${amount === amt && !isCustomAmount ? 'selected' : ''}`}
              >
                ${(amt / 100).toFixed(amt % 100 === 0 ? 0 : 2)}
              </button>
            ))}
          </div>
          
          <div className="custom-amount-section">
            <div className="custom-amount-label">Or enter custom amount:</div>
            <div className="custom-amount-input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                type="text"
                placeholder="0.00"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className={`custom-amount-input ${isCustomAmount ? 'active' : ''}`}
              />
            </div>
            <div className="amount-hint">
              {isCustomAmount && customAmount && (
                <span>You're donating: ${(amount / 100).toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>

        <div className="card-element">
          <CardElement />
        </div>

        <button 
          type="submit" 
          disabled={!stripe || isLoading}
          className="submit-button"
        >
          {isLoading ? 'Processing...' : `Donate $${(amount / 100).toFixed(2)}`}
        </button>
        
        <div className="security-note">
          <span className="lock-icon">🔒</span>
          Secure payment processed by Stripe
        </div>
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