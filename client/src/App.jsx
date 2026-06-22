import { useState } from 'react';
import DonationPage from "./components/DonationForm";
import TotalDonations from "./components/totalDonations";
import TopDonations from './components/TopDonations';

import StAnthonyImage from "./assets/IMG_0241.jpeg"

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const extendedPitch = `St. Anthony's Findings is a new community art project from Clamp Light Studios that celebrates the "lost" people, places, and stories that shaped San Antonio.

Our artists are creating original works across many mediums — from sculpture and embroidery to painting, film, and music — each inspired by the spirit of St. Anthony, the patron saint of lost things.

The project aims to rediscover forgotten histories, honor overlooked voices, and highlight the beauty and resilience woven into the fabric of this city.

Through these artworks, we hope to reconnect our community with the stories that make San Antonio truly unique.`;

  return (
    <>
      <div className="about-container">
        <div className="about-header">
          <h1 className="title">
            St Anthony's <span className="title-accent">Findings</span>
          </h1>
          <div className="tagline">Rediscovering San Antonio Through Art</div>
        </div>
        
        <div className="about-content">
          <div className="about-left">
            <div className="icon-circle"><img src={StAnthonyImage} alt=""  id='stantimg'/></div>
            <h3 className="about-subtitle">The St Anthony's Findings</h3>
            <p>
              St. Anthony's Findings is a place to explore unearthed local legends, places and iconography i San Antonio that make it unique and special
            </p>
            <button 
              className="learn-more-btn"
              onClick={openModal}
            >
              Learn More
              <span className="btn-icon">→</span>
            </button>
          </div>
          
          <div className="about-divider"></div>
          
          <div className="about-right">
            <div className="funding-box">
              <div className="funding-item">
                <div className="funding-amount awarded">$15,000</div>
                <div className="funding-label">Grant Awarded</div>
              </div>
              <div className="funding-arrow">➞</div>
              <div className="funding-item">
                <div className="funding-amount goal">$15,000</div>
                <div className="funding-label">Matching Goal</div>
              </div>
            </div>
            <p className="funding-note">
              Your support helps artists receive fair wages to fully realize this creative vision.
            </p>
          </div>
        </div>
      </div>

      <section>
        <TopDonations />
      </section>
      
      <section className="donation-section">  
        <TotalDonations />   
        <DonationPage />
      </section>

      {/* Modal/Popup */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">
                St Anthony's <span className="modal-title-accent">Findings</span>
              </h2>
              <div className="modal-subtitle">
                A Community Art Project by Clamp Light Studios
              </div>
            </div>
            
            <div className="modal-body">
              {extendedPitch.split('\n\n').map((paragraph, index) => (
                <p key={index} className="modal-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="modal-footer">
              <button className="modal-donate-btn" onClick={() => {
                closeModal();
                // Optional: Scroll to donation section
                document.querySelector('.donation-section')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}>
                Support This Project
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
