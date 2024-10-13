// 初始化 EmailJS
(function() {
    emailjs.init("Public-Key");  // 替换为你的公共密钥
})();

// 定义一个发送邮件的函数
export function sendEmail(to,message) {
    const templateParams = {
        contact_number: Math.floor(Math.random() * 100000),  // 随机生成一个联系号码
        user_name: "xxx",  // 动态设置名字
        user_email: "sss@test.com",  // 动态设置邮箱
        message: "Hello, this is a test message!"  // 动态设置消息内容
    };

    emailjs.send('xxx', 'xxx', templateParams)
        .then(() => {
            console.log('SUCCESS!');
        }, (error) => {
            console.error('FAILED...', error);
        });
}
