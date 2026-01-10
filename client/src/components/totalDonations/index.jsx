import { totalDonations  } from "../../services/api"
import { useEffect, useState, useMemo, useCallback, useRef } from "react"
import './totalDonations.css'

const GOAL_AMOUNT = 15000



const TotalDonations = () => {
    const [ total, setTotal ] = useState(0);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);
    const [ isRefreshing, setIsRefreshing ] = useState(false);


    const lastFetchedTotalRef = useRef(0);
    const isInitialLoadRef = useRef(true)


      const progress = useMemo(() => {        
        const numericTotal = typeof total === 'number' ? total : 0
        return Math.min((numericTotal / GOAL_AMOUNT) * 100, 100)
    }, [total])



      const formattedTotal = useMemo(() => {
        if (typeof total === 'number') {
            return `$${total.toLocaleString()}`
        }
        return '$0'
    }, [total])

    const fetchTotal = useCallback(async (isBackgroundRefresh = false) => {

          if (isBackgroundRefresh && isRefreshing) {
            return;
        }


        if (!isBackgroundRefresh) {
             setLoading(true)
        } else {
            setIsRefreshing(true)
        }


        setError(null);
       
        
        
        try {
            const fetchedTotal = await totalDonations()
            
            
            if (fetchedTotal && typeof fetchedTotal === 'object') {
               
                const amount = fetchedTotal.formatedTotal || 
                              fetchedTotal.total || 
                              fetchedTotal.amount || 
                              0
                
                
                const numericAmount = typeof amount === 'string' 
                    ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) 
                    : Number(amount)
                
                if (!isNaN(numericAmount)) {
                 const difference = Math.abs(numericAmount - lastFetchedTotalRef.current);
                  if (isInitialLoadRef.current || difference > 1) {
                        setTotal(numericAmount);
                        lastFetchedTotalRef.current = numericAmount;                        
                      
                        if (isBackgroundRefresh && difference > 1) {
                            console.log(`Donations updated: +$${difference.toFixed(2)}`);
                        }
                    } 
                    
                if (isInitialLoadRef.current) {
                    isInitialLoadRef.current = false;
                }
                } else {
                    throw new Error('Invalid donation amount received')
                }
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            console.error('Error fetching donations:', err)
            setError('Failed to load donation total. Please try again.')
            setTotal(0)
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [isRefreshing]);


        useEffect(() => {
        fetchTotal()        
       
        const intervalId = setInterval(() => {
            fetchTotal(true);
        }, 45000); 
        
        return () => clearInterval(intervalId)
    }, [fetchTotal])

  return (
     <div className="total-donations-container">
            <h1 className="total-donations-title">Fundraising Progress</h1>

            {isRefreshing && (
                <div className="refreshing-indicator">
                    <span className="refreshing-dot"></span>
                    <span>Checking for updates...</span>
                </div>
            )}
            
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={fetchTotal} className="retry-button">
                        Retry
                    </button>
                </div>
            )}
            
            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <>
                    <div className="progress-info">
                        <span className="current-amount">{formattedTotal}</span>
                        <span className="goal-amount">Goal: ${GOAL_AMOUNT.toLocaleString()}</span>
                    </div>
                    
                    {/* PlayStation-style progress bar */}
                    <div className="playstation-progress-bar">
                        <div 
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="progress-glow"></div>
                            <div className="progress-particles"></div>
                        </div>
                        <div className="progress-marker" style={{ left: `${progress}%` }}>
                            <div className="marker-pulse"></div>
                        </div>
                    </div>
                    
                    <div className="progress-text">
                        {progress.toFixed(1)}% Complete
                    </div>
                    
                    {progress >= 100 && (
                        <div className="goal-reached">
                            🎉 Goal Reached! Thank you! 🎉
                        </div>
                    )}
                </>
            )}
        </div>
  )
}

export default TotalDonations