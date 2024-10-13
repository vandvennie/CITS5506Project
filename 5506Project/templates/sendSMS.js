const accountSid = 'xxx';  // 替换为你的 Twilio SID
const authToken = 'xxx';    // 替换为你的 Twilio Auth Token
const client = require('twilio')(accountSid, authToken);

export function sendSMS(to, message) {
  client.messages
    .create({
      body: message,
      from: '+19093475842',  // 替换为你的 Twilio 号码
      to: to
    })
    .then(message => console.log(`Message sent: ${message.sid}`))
    .catch(error => console.error('Error sending SMS:', error));
}

// 示例调用
sendSMS('+xxxx', 'Hello from Twilio!');
