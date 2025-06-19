
#!/usr/bin/env python3
"""
M.U.K.H.T.A.R Control System
Multifunctional Utility Keeper Harnessing Technology And Reasoning

A J.A.R.V.I.S.-inspired AI assistant for smart home automation
Built with Bolt IoT, Python, and personality
"""

import requests
import time
import json
import random
import threading
from datetime import datetime
import speech_recognition as sr
import pyttsx3
from twilio.rest import Client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')

class MUKHTAR:
    def __init__(self, config_file='mukhtar_config.json'):
        """Initialize M.U.K.H.T.A.R with configuration"""
        print("🤖 M.U.K.H.T.A.R: System initialization commencing...")
        
        # Load configuration
        with open(config_file, 'r') as f:
            self.config = json.load(f)['mukhtar_config']
        
        # Bolt IoT configuration
        self.api_key = self.config['bolt_iot']['api_key']
        self.device_id = self.config['bolt_iot']['device_id']
        self.base_url = f"https://cloud.boltiot.com/remote/{self.api_key}"
        
        # Device configuration
        self.devices = self.config['devices']
        
        # Sensor configuration
        self.sensors = self.config['sensors']
        
        # Twilio configuration
        self.twilio_client = Client(
            self.config['twilio']['account_sid'],
            self.config['twilio']['auth_token']
        )
        
        # Voice configuration
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.tts_engine = pyttsx3.init()
        self.tts_engine.setProperty('rate', 150)
        
        # System state
        self.device_states = {device: False for device in self.devices.keys()}
        self.auto_mode = True
        self.last_sensor_reading = {}
        
        # Personality responses
        self.responses = self.config['responses']
        
        print("🧠 M.U.K.H.T.A.R: Neural networks online. Personality matrix loaded.")
        print("⚡ M.U.K.H.T.A.R: All systems operational. Ready to serve, Sir.")
        
        # Start background monitoring
        self.start_monitoring()
    
    def log_response(self, message):
        """Log and optionally speak M.U.K.H.T.A.R responses"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        formatted_message = f"[{timestamp}] {message}"
        print(formatted_message)
        logging.info(message)
        
        # Optional: Text-to-speech
        if self.config.get('voice_enabled', False):
            self.tts_engine.say(message.replace('M.U.K.H.T.A.R: ', ''))
            self.tts_engine.runAndWait()
    
    def get_witty_response(self, category, action=None):
        """Generate witty M.U.K.H.T.A.R responses"""
        base_responses = {
            'light_on': [
                "M.U.K.H.T.A.R: Illumination deployed. Let there be light, as someone important once said.",
                "M.U.K.H.T.A.R: Photons successfully activated. Your path is now luminous.",
                "M.U.K.H.T.A.R: Light engaged. Banishing darkness with style."
            ],
            'light_off': [
                "M.U.K.H.T.A.R: Lights extinguished. Embracing the void.",
                "M.U.K.H.T.A.R: Photon cessation complete. Welcome to the dark side.",
                "M.U.K.H.T.A.R: Illumination offline. Power conservation achieved."
            ],
            'fan_on': [
                "M.U.K.H.T.A.R: Cooling systems engaged. Bringing the breeze to you.",
                "M.U.K.H.T.A.R: Fan activated. Air circulation protocols in effect.",
                "M.U.K.H.T.A.R: Atmospheric circulation initiated. Stay cool, Sir."
            ],
            'fan_off': [
                "M.U.K.H.T.A.R: Cooling systems offline. Natural air circulation resumed.",
                "M.U.K.H.T.A.R: Fan deactivated. The wind stops at my command.",
                "M.U.K.H.T.A.R: Air circulation protocols suspended."
            ],
            'gas_alert': [
                "M.U.K.H.T.A.R: ALERT - Atmospheric contamination detected! Initiating anti-doom protocol.",
                "M.U.K.H.T.A.R: Gas levels elevated. Suggesting immediate evacuation or a very good explanation.",
                "M.U.K.H.T.A.R: Toxic atmosphere detected. This is not a drill, Sir!"
            ],
            'temperature_high': [
                "M.U.K.H.T.A.R: Temperature exceeds comfort parameters. Perhaps an arctic vacation?",
                "M.U.K.H.T.A.R: It's getting hot in here. Activating cooling countermeasures.",
                "M.U.K.H.T.A.R: Current temperature suggests we're either in a sauna or on Mercury."
            ]
        }
        
        responses = base_responses.get(category, [f"M.U.K.H.T.A.R: {action} completed successfully."])
        return random.choice(responses)
    
    def turn_on_device(self, device_name):
        """Turn on a specific device"""
        if device_name not in self.devices:
            self.log_response(f"M.U.K.H.T.A.R: Unknown device '{device_name}'. My database doesn't include fictional appliances.")
            return False
        
        try:
            pin = self.devices[device_name]['pin']
            response = requests.get(f"{self.base_url}/digitalWrite?pin={pin}&state=HIGH", timeout=10)
            
            if response.status_code == 200:
                self.device_states[device_name] = True
                self.log_response(self.get_witty_response(f"{device_name}_on"))
                return True
            else:
                self.log_response(f"M.U.K.H.T.A.R: Communication error with {device_name}. Network gremlins detected.")
                return False
                
        except Exception as e:
            self.log_response(f"M.U.K.H.T.A.R: Device control malfunction. Error: {str(e)}")
            return False
    
    def turn_off_device(self, device_name):
        """Turn off a specific device"""
        if device_name not in self.devices:
            self.log_response(f"M.U.K.H.T.A.R: Device '{device_name}' not found in my arsenal.")
            return False
        
        try:
            pin = self.devices[device_name]['pin']
            response = requests.get(f"{self.base_url}/digitalWrite?pin={pin}&state=LOW", timeout=10)
            
            if response.status_code == 200:
                self.device_states[device_name] = False
                self.log_response(self.get_witty_response(f"{device_name}_off"))
                return True
            else:
                self.log_response(f"M.U.K.H.T.A.R: Communication failure with {device_name}.")
                return False
                
        except Exception as e:
            self.log_response(f"M.U.K.H.T.A.R: Device control error: {str(e)}")
            return False
    
    def get_sensor_data(self, sensor_type):
        """Read sensor data from Bolt device"""
        try:
            if sensor_type == 'temperature':
                response = requests.get(f"{self.base_url}/analogRead?pin=A0", timeout=10)
            elif sensor_type == 'humidity':
                response = requests.get(f"{self.base_url}/analogRead?pin=A1", timeout=10)
            elif sensor_type == 'light':
                response = requests.get(f"{self.base_url}/analogRead?pin=A2", timeout=10)
            elif sensor_type == 'gas':
                response = requests.get(f"{self.base_url}/analogRead?pin=A3", timeout=10)
            else:
                return None
            
            if response.status_code == 200:
                data = response.json()
                value = float(data['value'])
                
                # Convert raw values based on sensor type
                if sensor_type == 'temperature':
                    # Convert to actual temperature (sensor-specific conversion)
                    actual_value = value * 0.1  # DHT11 conversion
                elif sensor_type == 'light':
                    # Convert to percentage
                    actual_value = (value / 1024) * 100
                else:
                    actual_value = value
                
                self.last_sensor_reading[sensor_type] = actual_value
                return actual_value
            
        except Exception as e:
            self.log_response(f"M.U.K.H.T.A.R: Sensor reading error for {sensor_type}: {str(e)}")
            return None
    
    def send_sms_alert(self, message):
        """Send SMS alert via Twilio"""
        try:
            message = self.twilio_client.messages.create(
                body=f"🚨 M.U.K.H.T.A.R ALERT: {message}",
                from_=self.config['twilio']['from_number'],
                to=self.config['twilio']['to_number']
            )
            self.log_response("M.U.K.H.T.A.R: Emergency alert transmitted. Help is on the way.")
            return True
        except Exception as e:
            self.log_response(f"M.U.K.H.T.A.R: SMS transmission failed: {str(e)}")
            return False
    
    def parse_command(self, command):
        """Parse natural language commands"""
        command = command.lower().strip()
        self.log_response(f"M.U.K.H.T.A.R: Processing command - '{command}'")
        
        # Device control commands
        if any(phrase in command for phrase in ['turn on', 'switch on', 'activate', 'start']):
            for device in self.devices.keys():
                if device in command:
                    return self.turn_on_device(device)
        
        elif any(phrase in command for phrase in ['turn off', 'switch off', 'deactivate', 'stop']):
            for device in self.devices.keys():
                if device in command:
                    return self.turn_off_device(device)
        
        # Information commands
        elif any(phrase in command for phrase in ['temperature', 'temp', 'hot', 'cold']):
            temp = self.get_sensor_data('temperature')
            if temp:
                self.log_response(f"M.U.K.H.T.A.R: Current temperature is {temp:.1f}°C. Quite comfortable, if you ask me.")
        
        elif any(phrase in command for phrase in ['light level', 'brightness', 'dark']):
            light = self.get_sensor_data('light')
            if light:
                self.log_response(f"M.U.K.H.T.A.R: Light intensity at {light:.1f}%. Adequate for human activities.")
        
        elif any(phrase in command for phrase in ['gas', 'air quality', 'toxic']):
            gas = self.get_sensor_data('gas')
            if gas:
                if gas > 300:
                    self.log_response(self.get_witty_response('gas_alert'))
                else:
                    self.log_response(f"M.U.K.H.T.A.R: Air quality nominal ({gas}). Breathe freely, Sir.")
        
        elif any(phrase in command for phrase in ['status', 'report', 'summary']):
            self.system_status_report()
        
        elif any(phrase in command for phrase in ['auto mode', 'automation']):
            if 'off' in command or 'disable' in command:
                self.auto_mode = False
                self.log_response("M.U.K.H.T.A.R: Automation disabled. Manual control engaged.")
            else:
                self.auto_mode = True
                self.log_response("M.U.K.H.T.A.R: Automation enabled. I'll handle things from here.")
        
        else:
            witty_responses = [
                "M.U.K.H.T.A.R: I'm afraid I didn't catch that. Could you rephrase, or speak louder?",
                "M.U.K.H.T.A.R: Command not recognized. Perhaps you meant something else?",
                "M.U.K.H.T.A.R: My algorithms suggest that command doesn't exist in my database.",
                "M.U.K.H.T.A.R: I'm intelligent, but not psychic. Please clarify your request."
            ]
            self.log_response(random.choice(witty_responses))
    
    def voice_command_listener(self):
        """Listen for voice commands"""
        self.log_response("M.U.K.H.T.A.R: Voice recognition online. Listening for commands...")
        
        try:
            with self.microphone as source:
                self.recognizer.adjust_for_ambient_noise(source)
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=5)
            
            command = self.recognizer.recognize_google(audio)
            self.log_response(f"M.U.K.H.T.A.R: Voice command received - '{command}'")
            self.parse_command(command)
            
        except sr.WaitTimeoutError:
            pass  # Normal timeout, continue listening
        except sr.UnknownValueError:
            self.log_response("M.U.K.H.T.A.R: Audio unclear. Please speak more distinctly.")
        except sr.RequestError as e:
            self.log_response(f"M.U.K.H.T.A.R: Voice recognition service error: {e}")
    
    def system_status_report(self):
        """Generate comprehensive system status"""
        self.log_response("M.U.K.H.T.A.R: Initiating comprehensive system analysis...")
        
        # Get current sensor readings
        temp = self.get_sensor_data('temperature')
        humidity = self.get_sensor_data('humidity')
        light = self.get_sensor_data('light')
        gas = self.get_sensor_data('gas')
        
        print("\n" + "="*50)
        print("        M.U.K.H.T.A.R STATUS REPORT")
        print("="*50)
        print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"System Mode: {'AUTO' if self.auto_mode else 'MANUAL'}")
        print("\nENVIRONMENTAL CONDITIONS:")
        print(f"  Temperature: {temp:.1f}°C" if temp else "  Temperature: SENSOR ERROR")
        print(f"  Humidity: {humidity:.1f}%" if humidity else "  Humidity: SENSOR ERROR") 
        print(f"  Light Level: {light:.1f}%" if light else "  Light Level: SENSOR ERROR")
        print(f"  Gas Level: {gas}" if gas else "  Gas Level: SENSOR ERROR")
        
        print("\nDEVICE STATUS:")
        for device, state in self.device_states.items():
            status = "ONLINE" if state else "OFFLINE"
            print(f"  {device.title()}: {status}")
        
        print("\nSYSTEM HEALTH: OPTIMAL")
        print("="*50 + "\n")
        
        # Witty commentary based on readings
        if temp and temp > 35:
            self.log_response("M.U.K.H.T.A.R: Temperature analysis suggests immediate cooling intervention required.")
        if gas and gas > 300:
            self.log_response("M.U.K.H.T.A.R: Atmospheric contamination detected. Ventilation recommended.")
    
    def automation_logic(self):
        """M.U.K.H.T.A.R's automated decision making"""
        if not self.auto_mode:
            return
        
        # Get current readings
        temp = self.get_sensor_data('temperature')
        light = self.get_sensor_data('light')
        gas = self.get_sensor_data('gas')
        
        # Temperature control
        if temp and temp > 35 and not self.device_states.get('fan', False):
            self.turn_on_device('fan')
            self.log_response("M.U.K.H.T.A.R: Automated cooling protocol engaged.")
        elif temp and temp < 30 and self.device_states.get('fan', False):
            self.turn_off_device('fan')
        
        # Light control
        if light and light < 20 and not self.device_states.get('light', False):
            self.turn_on_device('light')
            self.log_response("M.U.K.H.T.A.R: Automated illumination protocol active.")
        elif light and light > 60 and self.device_states.get('light', False):
            self.turn_off_device('light')
        
        # Gas safety
        if gas and gas > 300:
            if not self.device_states.get('exhaust', False):
                self.turn_on_device('exhaust')
                self.log_response(self.get_witty_response('gas_alert'))
            
            if gas > 500:
                self.send_sms_alert(f"CRITICAL: Dangerous gas levels detected ({gas})! Evacuate immediately!")
        elif gas and gas < 200 and self.device_states.get('exhaust', False):
            self.turn_off_device('exhaust')
    
    def start_monitoring(self):
        """Start background monitoring thread"""
        def monitor():
            while True:
                try:
                    self.automation_logic()
                    time.sleep(30)  # Check every 30 seconds
                except Exception as e:
                    self.log_response(f"M.U.K.H.T.A.R: Monitoring error: {e}")
                    time.sleep(60)
        
        monitor_thread = threading.Thread(target=monitor, daemon=True)
        monitor_thread.start()
        self.log_response("M.U.K.H.T.A.R: Background monitoring initiated. I'll keep watch.")
    
    def interactive_mode(self):
        """Interactive command mode"""
        self.log_response("M.U.K.H.T.A.R: Interactive mode activated. How may I assist you today?")
        
        while True:
            try:
                print("\n" + "-"*40)
                print("M.U.K.H.T.A.R Command Interface")
                print("-"*40)
                print("Commands: status, temp, light on/off, fan on/off, voice, auto on/off, quit")
                
                user_input = input("\n>>> ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'bye']:
                    self.log_response("M.U.K.H.T.A.R: Shutting down. Until next time, Sir.")
                    break
                elif user_input.lower() == 'voice':
                    self.voice_command_listener()
                elif user_input:
                    self.parse_command(user_input)
                
            except KeyboardInterrupt:
                self.log_response("\nM.U.K.H.T.A.R: Interrupt detected. Powering down gracefully.")
                break
            except Exception as e:
                self.log_response(f"M.U.K.H.T.A.R: Unexpected error: {e}")

def main():
    """Main execution function"""
    try:
        # Initialize M.U.K.H.T.A.R
        mukhtar = MUKHTAR()
        
        # Start interactive mode
        mukhtar.interactive_mode()
        
    except FileNotFoundError:
        print("❌ Configuration file not found. Please ensure mukhtar_config.json exists.")
    except Exception as e:
        print(f"❌ M.U.K.H.T.A.R initialization failed: {e}")

if __name__ == "__main__":
    main()
