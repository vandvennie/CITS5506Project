(function() {
    emailjs.init(" public key"); 
})();

export function sendEmail(to,message) {
    const templateParams = {
        contact_number: Math.floor(Math.random() * 100000),  
        user_name: "name",  
        user_email: "email@example.com",  
        message: message 
    };

    emailjs.send('service_rqwfvb1', 'template_rqphmlu', templateParams)
        .then(() => {
            console.log('SUCCESS!');
        }, (error) => {
            console.error('FAILED...', error);
        });
}
