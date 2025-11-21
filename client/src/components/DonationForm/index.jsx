// components/DonationForm.jsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const DonationForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(2500); // $25.00 in cents
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    // Create payment intent on your backend
    const { error: backendError, clientSecret } = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency: 'usd',
        metadata: {
          donorName,
          email,
          project: "St Anthony's Findings"
        }
      }),
    }).then(r => r.json());

    if (backendError) {
      console.error(backendError);
      return;
    }

    // Confirm payment with Stripe
    const { error } = await stripe.confirmCardPayment(clientSecret, {
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
      // Payment succeeded
      alert('Thank you for your donation!');
    }
  };

  return (
    <div className="donation-form">
      <h2>Support St Anthony's Findings</h2>
      <form onSubmit={handleSubmit}>
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
          {[1000, 2500, 5000, 10000].map(amt => (
            <button
              key={amt}
              type="button"
              className={`amount-btn ${amount === amt ? 'active' : ''}`}
              onClick={() => setAmount(amt)}
            >
              ${amt / 100}
            </button>
          ))}
        </div>

        <div className="card-element">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' }
              }
            }
          }} />
        </div>

        <button type="submit" disabled={!stripe}>
          Donate ${amount / 100}
        </button>
      </form>
    </div>
  );
};

// Wrap in Elements provider
export default function DonationPage() {
  return (
    <Elements stripe={stripePromise}>
      <DonationForm />
    </Elements>
  );
}