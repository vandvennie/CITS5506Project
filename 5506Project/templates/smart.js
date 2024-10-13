import { sendEmail } from './email.js';  // 导入 sendEmail 函数

let email = "sunmengdaily@gmail.com"
let mobile = "+610405448072"
let userSettings ={
    email,mobile
}


// // 初始化 EmailJS
// (function() {
//     emailjs.init("pOm59_oDr0Vk3US-3");  // 替换为你的公共密钥
// })();

// // 定义一个发送邮件的函数
// function sendEmail(to,message) {
//     const templateParams = {
//         contact_number: Math.floor(Math.random() * 100000),  // 随机生成一个联系号码
//         user_name: "Meng Sun",  // 动态设置名字
//         user_email: to||"sunmengdaily@gmail.com",  // 动态设置邮箱
//         message: message||"Hello, this is a test message!"  // 动态设置消息内容
//     };

//     emailjs.send('service_rqwfvb1', 'template_rqphmlu', templateParams)
//         .then(() => {
//             console.log('SUCCESS!');
//             alert('Email sent successfully!');
//         }, (error) => {
//             console.error('FAILED...', error);
//             alert('Failed to send email. Please try again.');
//         });
// }



// Power Switch Listener
const powerSwitch = document.getElementById('powerSwitch');
powerSwitch.addEventListener('change', function() {
    const alert = document.getElementById('customAlert');
    const message = event.target.checked ? 'Power On' : 'Power Off';

    // Set alert message
    document.getElementById('alertMessage').innerText = message;

    // Show the alert
    alert.classList.add('show');
    alert.style.display = 'block';

    // Hide the alert after 3 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        alert.style.display = 'none';
    }, 3000);
});

// Settings Modal Control
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));

settingsBtn.addEventListener('click', function () {
    settingsModal.show();
});

// Settings Submit Button
const submitSettings = document.getElementById('submitSettings');
submitSettings.addEventListener('click', function() {

    userSettings = {
        email: document.getElementById('Email').value,
        mobile: document.getElementById('Mobile').value
    };

    const alert = document.getElementById('customAlert');
    const message = 'Settings Saved';

    // Set alert message
    document.getElementById('alertMessage').innerText = message;

    // Show the alert
    alert.classList.add('show');
    alert.style.display = 'block';
    settingsModal.hide();

    // Hide the alert after 3 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        alert.style.display = 'none';
    }, 3000);
});

// Power Switch Listener
const alarmSwitch = document.getElementById('alarmSwitch');
alarmSwitch.addEventListener('change', function() {
    event.preventDefault();  // 防止表单默认提交行为
    const alert_display = document.querySelector('.alert_display');
    alert_display.style.display =  event.target.checked ?'block':'none'; 

    const alert = document.querySelector('.alert');
    alert.style.display = event.target.checked ?'none':'block'; 

    if(event.target.checked){
        const to = userSettings.mobile;
        const message = "Your baby's temperature is too high. The current temperature is 37°C."
        sendEmail(userSettings.email,message)

        // 发送请求到后端
        fetch('http://localhost:3000/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ to, message })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Message sent:', data.sid);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
});

