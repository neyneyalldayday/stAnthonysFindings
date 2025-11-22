import { useState } from 'react';

const SimpleDonation = () => {
  const [amount, setAmount] = useState(25);
  
  return (
    <div>
      <h2>Donation Form (Simplified)</h2>
      <p>Selected amount: ${amount}</p>
      <button onClick={() => setAmount(25)}>$25</button>
      <button onClick={() => setAmount(50)}>$50</button>
    </div>
  );
};

export default SimpleDonation;