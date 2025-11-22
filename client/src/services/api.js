export const donate = async (data) => {
    try {
       const response = await fetch('/api/create-payment-intent' , {
        method: 'POST',        
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(data),
       });
       
       if(!response.ok){
        throw new Error('network response was not ok');
       }

       const responseData = await response.json();
       console.log(responseData);
       return responseData
    } catch (err) {
         console.error('Error:', err);
      throw err;
    }
}