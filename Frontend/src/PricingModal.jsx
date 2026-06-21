import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from './MyContext.jsx'; 
import "./PricingModal.css";
const PricingModal = () => {
  const navigate = useNavigate();
  const { setPrevChats, setNewChat } = useContext(MyContext);

  const handleCloseAndGoToNewChat = () => {
    setPrevChats([]); 
    setNewChat(true);  
    navigate('/chat'); 
  };

  return (
    <div className="pricing-fullscreen-wrapper">
      <div className="pricing-card-container">
        
        {/* Navigation Action Close Target Link Trigger Button */}
        <button className="pricing-modal-close" onClick={handleCloseAndGoToNewChat} aria-label="Go back to new chat">
          <i className="fa-solid fa-xmark" style={{ fontSize: '18px' }}></i>
        </button>

        <div className="pricing-modal-header">
          <h1>Upgrade your plan</h1>
          <p>Change or cancel anytime</p>
        </div>

        <div className="pricing-modal-grid">
          {/* Free Tier Card */}
          <div className="pricing-tier-card">
            <div className="tier-info-top">
              <h2 className="tier-title">Free</h2>
              <div className="tier-price-row">
                <span className="tier-currency">₹</span>
                <span className="tier-value">0</span>
                <span className="tier-duration">/ month</span>
              </div>
              <p className="tier-marketing-text">See what AI can do</p>
              <button className="tier-action-btn current-tier-btn" disabled>
                Your current plan
              </button>
            </div>
            
            <div className="tier-features-list">
              <div className="tier-feature-row"><i className="fa-solid fa-wand-magic-sparkles tier-feature-icon"></i> <span>Core model</span></div>
              <div className="tier-feature-row"><i className="fa-solid fa-message tier-feature-icon"></i> <span>Limited messages and uploads</span></div>
              <div className="tier-feature-row"><i className="fa-solid fa-image tier-feature-icon"></i> <span>Limited image creation</span></div>
              <div className="tier-feature-row"><i className="fa-solid fa-microchip tier-feature-icon"></i> <span>Limited memory</span></div>
            </div>
          </div>

          {/* Plus Tier Card */}
          <div className="pricing-tier-card premium-tier-card">
            <span className="tier-popular-tag">POPULAR</span>
            <div className="tier-info-top">
              <h2 className="tier-title">Plus</h2>
              <div className="tier-price-row">
                <span className="tier-currency">₹</span>
                <span className="tier-value">1,999</span>
                <span className="tier-duration">/ month (Inclusive of GST)</span>
              </div>
              <p className="tier-marketing-text">Unlock the full experience</p>
              <button className="tier-action-btn premium-upgrade-btn" onClick={handleCloseAndGoToNewChat}>
                Upgrade to Plus
              </button>
            </div>

            <div className="tier-features-list">
              <div className="tier-feature-row"><i className="fa-solid fa-wand-magic-sparkles tier-feature-icon highlighted-icon"></i> <span>Advanced models</span></div>
              <div className="tier-feature-row"><i className="fa-solid fa-brain tier-feature-icon highlighted-icon"></i> <span>Advanced image creation with Thinking</span></div>
              <div className="tier-feature-row"><i className="fa-solid fa-database tier-feature-icon highlighted-icon"></i> <span>Expanded memory across chats</span></div>
              <div className="tier-feature-row"><i className="fa-solid fa-code tier-feature-icon highlighted-icon"></i> <span>Codex coding agent</span></div>
              <div className="tier-feature-row"><i className="fa-solid fa-magnifying-glass tier-feature-icon highlighted-icon"></i> <span>Expanded deep research</span></div>
              <div className="tier-feature-row"><i className="fa-solid fa-cubes tier-feature-icon highlighted-icon"></i> <span>Projects and custom GPTs</span></div>
            </div>
          </div>
        </div>

        <div className="pricing-outer-footer-row">
          <button onClick={handleCloseAndGoToNewChat} className="pricing-back-text-btn">See all plans</button>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
