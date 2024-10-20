// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const accountSid = '';  
const authToken = '';   
const client = twilio(accountSid, authToken);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// send SMS 
app.post('/send-sms', (req, res) => {
    const { to, message } = req.body;

    client.messages
        .create({
            body: message,
            from: '',  
            to: to
        })
        .then(message => res.json({ sid: message.sid }))
        .catch(error => res.status(500).json({ error: 'Error sending SMS: ' + error.message }));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
