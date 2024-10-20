# UWA-CITS5506 IoT Project

# **Smart Cradle: Baby Monitoring System Using IoT and AI**

## **Project Overview**

The **Smart Cradle** is a real-time baby monitoring system that uses IoT and Artificial Intelligence (AI) to ensure the safety and comfort of infants. The system continuously tracks the baby’s movements, sounds, and room temperature through multiple sensors. If the system detects any risks, such as the baby waking up, leaving the cradle, or an unsafe room temperature, it sends instant alerts to parents via email or SMS. This helps reduce parents’ stress and ensures quick responses to any potential dangers.

## **Features**

- **Real-time Monitoring**: Monitors baby’s movements, sound, and room temperature using IoT sensors.
- **AI Analysis**: Uses AI to analyze data and detect potential risks.
- **Alerts**: Sends real-time notifications to parents via email or SMS when issues are detected.
- **User Interface**: Displays baby’s status through a web interface with easy-to-use controls.
- **Warning Lights**: Turns on LED warning lights in case of emergencies.

## **Installation Instructions**

### **Hardware Setup**

1. **Connect Sensors**: Attach the pressure sensor, sound sensor, and temperature sensor to the Raspberry Pi via GPIO pins.
2. **Set Up Power**: Make sure the system is connected to a stable power source, with a relay managing the cradle’s power.
3. **Camera**: Attach a camera to the Raspberry Pi for capturing images when anomalies are detected.

### **Software Setup**

Product Requirements Document (PRD): https://xprjn4.axshare.com

1. **Clone the Repository**:

   ```
   bash
   
   
   Copy code
   git clone https://github.com/your-repository/smart-cradle.git
   cd smart-cradle
   ```

2. **Install Dependencies**:

   - Install the required Python packages:

     ```
     Copy code
     pip install -r requirements.txt
     ```

   - Set up the 

     Flask

      server for the web interface:

     ```
     Copy code
     python app.py
     ```

3. **Configure Notification Settings**:

   - Update the email and SMS settings in the `config.py` file with your own credentials.

4. **Run the System**:

   - Start the monitoring system with the following command:

     ```
     css
     
     
     Copy code
     python main.py
     ```

## **Usage**

1. **Real-Time Monitoring**: Once the system is running, it will continuously monitor the baby’s condition and environment.
2. **Alerts**: If the baby wakes up, leaves the cradle, or the room temperature becomes unsafe, you will receive an email or SMS notification.
3. **User Interface**: Open the web interface in your browser to view real-time data and change settings.

## **Future Improvements**

- Adding a **humidity sensor** for better environmental monitoring.
- Enhancing the **AI algorithm** to reduce false positives.
- Improving the **camera performance** in low-light conditions.

## **Contributors**

- Wei Young
- Sun Meng
- Lyu Veronica
- Rahman Md Riduanur Rahman