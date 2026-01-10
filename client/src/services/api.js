export const donate = async (data) => {
    try {
       const response = await fetch('api/donation/create-payment-intent' , {
        method: 'POST',        
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(data),
       });
       
       console.log('Response status:', response.status, response.statusText);

       if(!response.ok){
       const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText}`);
       }

       const responseData = await response.json();
       console.log(responseData);
       return responseData
    } catch (err) {
         console.error('Error:', err);
      throw err;
    }
}


export const totalDonations = async (data) => {
    try {
        const response = await fetch('/api/records/donationTotal', {
            method: 'GET',
            credentials: 'include',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', }
        });
        if (!response.ok) {
            throw new Error('network dysfunction');
        }

        const  donationData = await response.json();       
        if(donationData){
            return donationData;
        }
    } catch (err) {
        console.error(err);
    }
}


export const topDonations = async (data) => {
    try {
        const response = await fetch('/api/records/topDonations', {
            method: 'GET',
            credentials: 'include',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', }
        });

        if (!response.ok) {
            throw new Error('network dysfunction');
        }

        const topDonationArray = await response.json();
        console.log(topDonationArray)

        if (topDonationArray) {            
            return topDonationArray;
        }
    } catch (err) {
        console.error(err)
    }
}