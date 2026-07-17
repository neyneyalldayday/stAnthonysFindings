import { useState } from 'react';
import DonationPage from "./components/DonationForm";
import TotalDonations from "./components/totalDonations";
import TopDonations from './components/TopDonations';
import Nav from './components/Nav'
import Footer from './components/Footer'

import StAnthonyImage from "./assets/IMG_0241.jpeg"

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const extendedPitch = `Welcome to St. Anthony’s Findings, a multidisciplinary art project highlighting unearthed local legends, natural landscapes and iconography of San Antonio. 

Artists Bridgette Ralph and Symone Harvey are recipients of the FY2026 Grant from the City of San Antonio Department of Arts & Culture. Together with local artists Brittany Drum, René Trevino, Laura Stevens, Monica Bosch, and Caterina Suttin they are bringing St. Anthony’s Findings to life.  

This art project honors Rafael Gonzalez, Wayne Holtz, Patricia Frausto, Bhagavan Narada Das, and Naradi Lila Devi Dasi, the founders of The Bliss House. Each of the honorees has made significant contributions to the people and the city of San Antonio. 

Join us on Januray 9, 2027 at Little Pinky Gallery 144 Zapata Street San Antonio, Texas for our main exhibition for St. Anthony’s Findings. 

Please follow @stanthonysfindings on Instagram to stay updated on our project and be in the know for any upcoming events we are hosting.
`;

  return (
    <>
    <Nav stAnt='stanthonysfindings' />
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
              St. Anthony's Findings is a place to explore unearthed local legends, places and iconography in San Antonio that make it unique and special
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
      <Footer stAnt="stanthonysfindings"></Footer>
    </>
  );
}

export default App;
