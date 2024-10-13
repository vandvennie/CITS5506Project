// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const accountSid = 'x';  // 替换为你的 Twilio SID
const authToken = 'x';    // 替换为你的 Twilio Auth Token
const client = twilio(accountSid, authToken);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 发送 SMS 的路由
app.post('/send-sms', (req, res) => {
    const { to, message } = req.body;

    client.messages
        .create({
            body: message,
            from: '+19093475842',  // 替换为你的 Twilio 号码
            to: to
        })
        .then(message => res.json({ sid: message.sid }))
        .catch(error => res.status(500).json({ error: 'Error sending SMS: ' + error.message }));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
