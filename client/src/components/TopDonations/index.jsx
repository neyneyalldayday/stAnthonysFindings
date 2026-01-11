import { useEffect, useState, useCallback } from 'react'
import { topDonations } from '../../services/api'
import './topDonations.css'

const TopDonations = () => {
const [ topDonationArray, setTopDonationArray ] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0)
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState(null)
const [isPaused, setIsPaused] = useState(false)

 const fetchTopFive = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const fetchedTop = await topDonations()
      console.log('Fetched top donations:', fetchedTop)
      
      
      const donations = fetchedTop.topDonations || 
                       fetchedTop.top_donations || 
                       fetchedTop.donations || 
                       fetchedTop || 
                       []
      
      
      const formattedDonations = donations.map(donation => ({
        ...donation,
       
        amount: donation.amount > 1000 ? 
                (donation.amount / 100).toFixed(2) : 
                donation.amount,
        formattedAmount: `$${(donation.amount > 1000 ? 
                              donation.amount / 100 : 
                              donation.amount).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}`
      }))
      
      setTopDonationArray(formattedDonations)
    } catch (err) {
      console.error('Error fetching top donations:', err)
      setError('Unable to load top donations')
      setTopDonationArray([])
    } finally {
      setIsLoading(false)
    }
  }, [])

    useEffect(() => {
    if (topDonationArray.length <= 1 || isPaused) return
    
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => 
        prevIndex === topDonationArray.length - 1 ? 0 : prevIndex + 1
      )
    }, 3000) // Rotate every 3 seconds
    
    return () => clearInterval(interval)
  }, [topDonationArray.length, isPaused])






 useEffect(() => {
    fetchTopFive()
    
   
    const refreshInterval = setInterval(fetchTopFive, 300000)
    
    return () => clearInterval(refreshInterval)
  }, [fetchTopFive])


    const handlePrev = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? topDonationArray.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === topDonationArray.length - 1 ? 0 : prevIndex + 1
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if(isLoading) {
    return (
    <div className="top-donations-container">
        <div className="top-donations-header">
          <h2>A special thank you to top Donors</h2>
        </div>
        <div className="loading-spinner">Loading top donations...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="top-donations-container">
        <div className="top-donations-header">
          <h2>A special thank you to top Donors</h2>
        </div>
        <div className="error-message">
          {error}
          <button onClick={fetchTopFive} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!topDonationArray.length) {
    return (
      <div className="top-donations-container">
        <div className="top-donations-header">
          <h2>A special thank you to top Donors</h2>
        </div>
        <div className="no-donations">
          No donations yet. Be the first!
        </div>
      </div>
    )
  }

  return (
    <div 
      className="top-donations-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="top-donations-header">
        <h2>A special thank you to top Donors</h2>
        <div className="carousel-indicators">
          {topDonationArray.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to donation ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="carousel-wrapper">
        <button 
          className="carousel-btn prev-btn"
          onClick={handlePrev}
          aria-label="Previous donation"
        >
          ‹
        </button>
        
        <div className="carousel">
          {topDonationArray.map((donation, index) => (
            <div
              key={donation.id || index}
              className={`donation-card ${
                index === currentIndex ? 'active' : 
                index === (currentIndex + 1) % topDonationArray.length ? 'next' :
                index === (currentIndex - 1 + topDonationArray.length) % topDonationArray.length ? 'prev' :
                'hidden'
              }`}
            >
              <div className="donation-rank">
                <span className="rank-number">#{index + 1}</span>
              </div>
              
              <div className="donation-content">
                <div className="donor-name">
                  {donation.donor_name || donation.name || 'Anonymous Donor'}
                </div>
                
                <div className="donation-amount">
                  {donation.formattedAmount || `$${Number(donation.amount).toLocaleString()}`}
                </div>
                
                {donation.message && (
                  <div className="donation-message">
                    "{donation.message}"
                  </div>
                )}
                
                <div className="donation-details">
                  {donation.created_at && (
                    <span className="donation-date">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="donation-medal">
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
                {index > 2 && '⭐'}
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="carousel-btn next-btn"
          onClick={handleNext}
          aria-label="Next donation"
        >
          ›
        </button>
      </div>

      <div className="carousel-footer">
        <button 
          className={`pause-btn ${isPaused ? 'paused' : ''}`}
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Resume rotation' : 'Pause rotation'}
        >
          {isPaused ? '▶' : '⏸'}
        </button>
        
        <span className="carousel-counter">
          {currentIndex + 1} / {topDonationArray.length}
        </span>
      </div>
    </div>
  )
  }
  


export default TopDonations