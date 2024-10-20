import board 

import busio 

import time 

import adafruit_mlx90614 

from flask import Flask, jsonify, send_file 

from hx711 import HX711 

from sound_sensor import read_sound_sensor 

import sys 

import RPi.GPIO as GPIO 

from flask_cors import CORS 

from picamera2 import Picamera2 

import time 

import os 

import datetime 

 

app = Flask(__name__) 

CORS(app) 

 

def get_pressure(): 

    hx = HX711(5, 6) 

    hx.set_reading_format("MSB", "MSB") 

    referenceUnit = 114 

    hx.set_reference_unit(referenceUnit) 

    hx.reset() 

    hx.tare() 

    try:      

        data = hx.get_weight(5) 

        hx.power_down() 

        hx.power_up() 

        time.sleep(0.1) 

        return data 

    except (KeyboardInterrupt, SystemExit): 

        sys.exit() 

     

@app.route('/pressure', methods=['GET']) 

def pressure_data(): 

    pressure = get_pressure() 

    data = { 

        'pressure': pressure 

    } 

    return jsonify(data) 

 

 

class cameraManager: 

    _i = None 

     

    @classmethod 

    def start_camera(cls): 

        if cls._i is None: 

            time.sleep(2) 

            try: 

                cls._i = Picamera2() 

                cls._i.configure( 

                    cls._i.create_still_configuration() 

                ) 

                cls._i.start() 

            except Exception as e: 

                cls._i = None 

                 

        return cls._i 

 

 

# capture picture 

@app.route('/capture', methods=['GET']) 

def capture_image(): 

     

    try: 

        camera = cameraManager.start_camera() 

        current_time = datetime.datetime.now() 

        timestamp_str = current_time.strftime("%Y%m%d_%H%M%S") 

        IMAGE_PATH = f"{timestamp_str}.jpg" 

        camera.capture_file(IMAGE_PATH) 

        return send_file(IMAGE_PATH, mimetype='image/jpeg') 

    except Exception as e: 

        return jsonify({"status": " Shooting failure ", "error": str(e)}) 

 

# read sound data 

def get_sound_level(): 

    sound_detected = read_sound_sensor() 

    if sound_detected == 1: 

        return True 

    else: 

        return False 

     

# read temperature data 

def get_temperature(): 

    i2c = busio.I2C(board.SCL, board.SDA) 

    return adafruit_mlx90614.MLX90614(i2c) 

 

# Returns sound sensor data 

@app.route('/start', methods=['GET']) 

def sensor_data(): 

    mlx = get_temperature() 

    data = { 

        'ambient_temperature':mlx.ambient_temperature, 

        'object_temperature':mlx.object_temperature, 

        'sound_status': get_sound_level(), 

        'pressure': get_pressure() 

    } 

    return jsonify(data) 

 

@app.route('/on', methods=['GET']) 

def relay_on(): 

    try: 

        GPIO.setmode(GPIO.BCM) 

        relay_pin= 17 

        GPIO.setup(relay_pin, GPIO.OUT) 

        GPIO.output(relay_pin, GPIO.HIGH) 

    except KeyboardInterrupt: 

        pass  

    return jsonify("on") 

     

@app.route('/clean', methods=['GET']) 

def relay_clean(): 

    GPIO.cleanup() 

    return jsonify("clean") 

 

 

# light up LED 

@app.route('/led_on', methods=['GET']) 

def led_on(): 

    LED_PIN = 23   

 

    GPIO.setmode(GPIO.BCM) 

    GPIO.setup(LED_PIN, GPIO.OUT) 

 

    GPIO.output(LED_PIN, GPIO.HIGH)  # lighten 

    return jsonify({"status": "LED lit"}) 

 

# Turn off LED 

@app.route('/led_off', methods=['GET']) 

def led_off(): 

    LED_PIN = 23  

 

    GPIO.setmode(GPIO.BCM) 

    GPIO.setup(LED_PIN, GPIO.OUT) 

 

    GPIO.output(LED_PIN, GPIO.LOW)  # turnoff 

    return jsonify({"status": "LED off"}) 

 

 

if __name__ == '__main__': 

    app.run(debug=True, host='0.0.0.0', port=4000) 

 