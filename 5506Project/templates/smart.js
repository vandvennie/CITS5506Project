import { sendEmail } from './email.js'; // Import sendEmail function

let email = "";
let mobile = "";
let userSettings = { email, mobile };
let url = "http://192.168.9.172:4000/";
let led_on = url + "led_on";
let led_off = url + "led_off";
let baby_temp = "";
let room_temp = "";
let weight = "";
let Warning_Info = "";
let imageUrl = "";
let tempMinInput = "";
let tempMaxInput = "";
let sound_status = "";
let timer = null;

// Start a timer to repeatedly call the get_start function every 10 seconds
function startTimer() {
    timer = setInterval(() => {
        get_start();
    }, 10000);
}

// Stop the timer
function stopTimer() {
    clearInterval(timer);
    timer = null;
}

// Power switch event listener
const powerSwitch = document.getElementById('powerSwitch');
powerSwitch.addEventListener('change', function () {
    const alert = document.getElementById('customAlert');
    const message = event.target.checked ? 'Power On' : 'Power Off';

    // Update alert message
    document.getElementById('alertMessage').innerText = message;

    // Start or stop the timer based on switch status
    event.target.checked ? startTimer() : stopTimer();

    // Send a request to turn the system on or clean it
    $.get(url + (event.target.checked ? "on" : "clean"), () => { });

    // Display the alert and hide it after 3 seconds
    alert.classList.add('show');
    alert.style.display = 'block';
    setTimeout(() => {
        alert.classList.remove('show');
        alert.style.display = 'none';
    }, 3000);
});

// Settings button to display the settings modal
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));

settingsBtn.addEventListener('click', function () {
    settingsModal.show();
});

// Settings submit button event listener
const submitSettings = document.getElementById('submitSettings');
submitSettings.addEventListener('click', function () {
    userSettings = {
        email: document.getElementById('Email').value,
        mobile: document.getElementById('Mobile').value
    };
    tempMinInput = document.getElementById('tempMin').value;
    tempMaxInput = document.getElementById('tempMax').value;

    const alert = document.getElementById('customAlert');
    const message = 'Settings Saved';

    // Update alert message and display it
    document.getElementById('alertMessage').innerText = message;
    alert.classList.add('show');
    alert.style.display = 'block';
    settingsModal.hide();

    // Hide the alert after 3 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        alert.style.display = 'none';
    }, 3000);
});

// Alarm switch event listener
const alarmSwitch = document.getElementById('alarmSwitch');
alarmSwitch.addEventListener('change', async () => {
    event.preventDefault(); // Prevent form's default behavior
    event.target.checked ? get_start(true) : back_normal(false);
});

// Capture a photo and display it
async function take_photo() {
    const response = await fetch(url + 'capture');
    const blob = await response.blob();
    imageUrl = URL.createObjectURL(blob);

    document.getElementById('uploadedImages').src = imageUrl;
    document.getElementById('uploadedImage').src = imageUrl;
}

// Fetch sensor data and update the interface
function get_start(alarm) {
    $.get(url + "start", async (data) => {
        let flag = false;
        baby_temp = (parseFloat(data.object_temperature) + 11).toFixed(2);
        room_temp = parseFloat(data.ambient_temperature).toFixed(2);
        sound_status = data.sound_status;

        let new_weight = Math.max(0, (parseFloat(data.pressure) * 10).toFixed(2));
        document.getElementById('room_temp').innerText = `${room_temp} °C`;
        document.getElementById('weight').innerText = `${new_weight} kg`;
        document.getElementById('baby_temp').innerText = `${baby_temp} °C`;

        if (tempMaxInput && room_temp > tempMaxInput) {
            flag = true;
            Warning_Info = "Warning: Baby room's temperature is higher than the set value.";
        }
        if (tempMinInput && room_temp < tempMinInput) {
            flag = true;
            Warning_Info = "Warning: Baby room's temperature is lower than the set value.";
        }
        if (sound_status && (new_weight - weight) > 5) {
            Warning_Info = "Warning: Baby is not on the bed.";
            await take_photo();
        }
        if (alarm) flag = true;
        weight = new_weight;

        if (flag) {
            if (!alarm) {
                const alarmSwitch = document.getElementById('alarmSwitch');
                alarmSwitch.checked = !alarmSwitch.checked;
            }
            alarm_func();
        }
    });
}

// Add a log entry for alerts
function append_child(flag) {
    const alert_display = document.querySelector('.alert-items');
    const alertAlarm = document.querySelector('.alert_alarm');
    const alertItem = document.createElement('div');
    alertItem.className = 'alert-item';
    let date = getCurrentTime();

    alertItem.innerHTML = `
        Date: ${date}<br>
        Baby Temperature: ${baby_temp} °C<br>
        Room Temperature: ${room_temp} °C<br>
        Weight: ${weight} kg<br>
        Duration of use: 4 h<br>
        Warning Info: ${Warning_Info}<br>
        <img src="${imageUrl}">
    `;

    alertAlarm.appendChild(alertItem);
    alert_display.style.display = 'none';
    alertAlarm.style.display = 'block';
}

// Get the current date and time
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
}

// Trigger alarm functions
async function alarm_func() {
    stopTimer();
    const alert_display = document.querySelector('.alert_display');
    alert_display.style.display = 'block';

    const alert = document.querySelector('.alert');
    alert.style.display = 'none';

    append_child(true);

    const message = Warning_Info;
    document.getElementById('alert_words_alarm').innerText = message;
    sendEmail(userSettings.email, message);

    fetch('http://localhost:3000/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: userSettings.mobile, message })
    })
    .then(response => response.json())
    .then(data => console.log('Message sent:', data.sid))
    .catch(error => console.error('Error:', error));

    $.get(led_on);
}

// Reset the system to normal state
function back_normal(flag) {
    const alert_display = document.querySelector('.alert_display');
    alert_display.style.display = flag ? 'block' : 'none';

    const alert = document.querySelector('.alert');
    alert.style.display = flag ? 'none' : 'block';

    const alert_display2 = document.querySelector('.alert-items');
    const alertAlarm = document.querySelector('.alert_alarm');

    alert_display2.style.display = flag ? 'none' : 'block';
    alertAlarm.style.display = flag ? 'block' : 'none';

    $.get(led_off);
}

// Observe changes in the on_bed element and trigger alarm if changes occur
let on_bed = document.getElementById('on_bed');
const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
            alarm_func();
        }
    }
});
const config = { childList: true, subtree: true };
observer.observe(on_bed, config);
