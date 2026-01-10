import DonationPage from "./components/DonationForm"
import TotalDonations from "./components/totalDonations"



function App() {
  

  return (
    <>
    <h1 className="title">
     st anthonys findings
    </h1>
    <section className="donation-section">  
     <TotalDonations />   
     <DonationPage />
    </section>
     
    </>
  )
}

export default App
