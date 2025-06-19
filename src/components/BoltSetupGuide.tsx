
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Cpu, 
  Code, 
  Cloud, 
  Smartphone, 
  CheckCircle, 
  Copy, 
  Download,
  ExternalLink,
  Settings,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BoltSetupGuide = () => {
  const [apiKey, setApiKey] = useState('YOUR_BOLT_API_KEY');
  const [deviceId, setDeviceId] = useState('YOUR_DEVICE_ID');
  const [twilioSid, setTwilioSid] = useState('YOUR_TWILIO_SID');
  const [twilioToken, setTwilioToken] = useState('YOUR_TWILIO_TOKEN');
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${label} copied successfully`,
    });
  };

  const arduinoCode = `// M.U.K.H.T.A.R IoT System - Arduino Code
#define BOLTIOT_API_KEY "${apiKey}"
#define BOLTIOT_DEVICE_ID "${deviceId}"

#include <ESP8266WiFi.h>
#include <BoltDeviceCredentials.h>
#include <BoltDevice.h>
#include <DHT.h>

// Pin Definitions
#define DHT_PIN D2
#define DHT_TYPE DHT11
#define LDR_PIN A0
#define GAS_PIN A1
#define LIGHT_PIN D0
#define FAN_PIN D1
#define EXHAUST_PIN D3
#define PLUG_PIN D4

// Initialize sensors and device
DHT dht(DHT_PIN, DHT_TYPE);
BoltDevice bolt(BOLTIOT_API_KEY, BOLTIOT_DEVICE_ID);

void setup() {
  Serial.begin(9600);
  dht.begin();
  
  // Initialize pins
  pinMode(LIGHT_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  pinMode(EXHAUST_PIN, OUTPUT);
  pinMode(PLUG_PIN, OUTPUT);
  
  // Initialize Bolt
  bolt.begin();
  
  Serial.println("M.U.K.H.T.A.R: System initialization complete. Standing by for commands.");
}

void loop() {
  // Read sensor data
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int lightLevel = analogRead(LDR_PIN);
  int gasLevel = analogRead(GAS_PIN);
  
  // Send data to Bolt Cloud
  bolt.serialWrite("temp", temperature);
  bolt.serialWrite("humidity", humidity);
  bolt.serialWrite("light", lightLevel);
  bolt.serialWrite("gas", gasLevel);
  
  // M.U.K.H.T.A.R logic
  mukhtarLogic(temperature, humidity, lightLevel, gasLevel);
  
  delay(5000); // Send data every 5 seconds
}

void mukhtarLogic(float temp, float humidity, int light, int gas) {
  // Auto fan control
  if (temp > 35) {
    digitalWrite(FAN_PIN, HIGH);
    Serial.println("M.U.K.H.T.A.R: Temperature exceeds comfort zone. Cooling systems engaged.");
  }
  
  // Auto light control
  if (light < 200) {
    digitalWrite(LIGHT_PIN, HIGH);
    Serial.println("M.U.K.H.T.A.R: Ambient light insufficient. Illumination activated.");
  }
  
  // Gas safety protocol
  if (gas > 300) {
    digitalWrite(EXHAUST_PIN, HIGH);
    Serial.println("M.U.K.H.T.A.R: ALERT - Gas levels elevated! Exhaust system activated.");
    // Trigger SMS alert via Python script
  }
  
  // Status report
  Serial.print("M.U.K.H.T.A.R: Environmental scan - Temp: ");
  Serial.print(temp);
  Serial.print("°C, Humidity: ");
  Serial.print(humidity);
  Serial.print("%, Light: ");
  Serial.print(light);
  Serial.print(", Gas: ");
  Serial.println(gas);
}`;

  const pythonCode = `# M.U.K.H.T.A.R Control System - Python Script
import requests
import time
import speech_recognition as sr
from twilio.rest import Client
import json

class MUKHTAR:
    def __init__(self):
        self.api_key = "${apiKey}"
        self.device_id = "${deviceId}"
        self.base_url = f"https://cloud.boltiot.com/remote/{self.api_key}"
        
        # Twilio credentials
        self.twilio_sid = "${twilioSid}"
        self.twilio_token = "${twilioToken}"
        self.twilio_client = Client(self.twilio_sid, self.twilio_token)
        
        # Device configuration
        self.devices = {
            "light": {"pin": 0, "status": False},
            "fan": {"pin": 1, "status": False},
            "exhaust": {"pin": 2, "status": False},
            "plug": {"pin": 3, "status": False}
        }
        
        print("M.U.K.H.T.A.R: System online. Ready to serve.")
    
    def turn_on_device(self, device_name):
        if device_name in self.devices:
            pin = self.devices[device_name]["pin"]
            response = requests.get(f"{self.base_url}/digitalWrite?pin={pin}&state=HIGH")
            
            if response.status_code == 200:
                self.devices[device_name]["status"] = True
                responses = {
                    "light": "M.U.K.H.T.A.R: Illumination activated. Let there be light.",
                    "fan": "M.U.K.H.T.A.R: Cooling system engaged. Air circulation initiated.",
                    "exhaust": "M.U.K.H.T.A.R: Exhaust fan online. Air purification in progress.",
                    "plug": "M.U.K.H.T.A.R: Smart plug activated. Power flows as commanded."
                }
                print(responses.get(device_name, f"M.U.K.H.T.A.R: {device_name} activated."))
                return True
            else:
                print(f"M.U.K.H.T.A.R: Communication error with {device_name}. Investigating...")
                return False
        else:
            print(f"M.U.K.H.T.A.R: Unknown device '{device_name}'. Please check your command.")
            return False
    
    def turn_off_device(self, device_name):
        if device_name in self.devices:
            pin = self.devices[device_name]["pin"]
            response = requests.get(f"{self.base_url}/digitalWrite?pin={pin}&state=LOW")
            
            if response.status_code == 200:
                self.devices[device_name]["status"] = False
                responses = {
                    "light": "M.U.K.H.T.A.R: Lights extinguished. Embracing the shadows.",
                    "fan": "M.U.K.H.T.A.R: Cooling system offline. Natural air circulation resumed.",
                    "exhaust": "M.U.K.H.T.A.R: Exhaust system deactivated. Air quality acceptable.",
                    "plug": "M.U.K.H.T.A.R: Power outlet offline. Energy conservation achieved."
                }
                print(responses.get(device_name, f"M.U.K.H.T.A.R: {device_name} deactivated."))
                return True
            else:
                print(f"M.U.K.H.T.A.R: Communication error with {device_name}. Investigating...")
                return False
    
    def get_temperature(self):
        try:
            response = requests.get(f"{self.base_url}/analogRead?pin=A0")
            if response.status_code == 200:
                data = response.json()
                # Convert analog reading to temperature (DHT11 specific)
                temp = float(data['value']) * 0.1  # Simplified conversion
                print(f"M.U.K.H.T.A.R: Current temperature: {temp:.1f}°C. Monitoring climate conditions.")
                return temp
        except Exception as e:
            print(f"M.U.K.H.T.A.R: Temperature sensor error: {e}")
            return None
    
    def get_light_intensity(self):
        try:
            response = requests.get(f"{self.base_url}/analogRead?pin=A1")
            if response.status_code == 200:
                data = response.json()
                light_level = int(data['value'])
                print(f"M.U.K.H.T.A.R: Light intensity: {light_level}. Adequate for human activities.")
                return light_level
        except Exception as e:
            print(f"M.U.K.H.T.A.R: Light sensor error: {e}")
            return None
    
    def detect_gas_level(self):
        try:
            response = requests.get(f"{self.base_url}/analogRead?pin=A2")
            if response.status_code == 200:
                data = response.json()
                gas_level = int(data['value'])
                
                if gas_level > 300:
                    print("M.U.K.H.T.A.R: ALERT - Elevated gas levels detected! Initiating safety protocols.")
                    self.send_gas_alert()
                    self.turn_on_device("exhaust")
                else:
                    print(f"M.U.K.H.T.A.R: Gas levels normal ({gas_level}). Air quality satisfactory.")
                
                return gas_level
        except Exception as e:
            print(f"M.U.K.H.T.A.R: Gas sensor error: {e}")
            return None
    
    def send_gas_alert(self):
        try:
            message = self.twilio_client.messages.create(
                body="M.U.K.H.T.A.R ALERT: Dangerous gas levels detected! Please evacuate immediately and check ventilation.",
                from_='+1234567890',  # Your Twilio number
                to='+0987654321'       # Recipient number
            )
            print("M.U.K.H.T.A.R: Emergency SMS dispatched. Authorities notified.")
        except Exception as e:
            print(f"M.U.K.H.T.A.R: SMS alert failed: {e}")
    
    def voice_command(self):
        recognizer = sr.Recognizer()
        microphone = sr.Microphone()
        
        print("M.U.K.H.T.A.R: Listening for voice commands...")
        
        with microphone as source:
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source)
        
        try:
            command = recognizer.recognize_google(audio).lower()
            print(f"M.U.K.H.T.A.R: Voice command received: '{command}'")
            self.parse_command(command)
        except sr.UnknownValueError:
            print("M.U.K.H.T.A.R: I didn't catch that. Could you repeat the command?")
        except sr.RequestError:
            print("M.U.K.H.T.A.R: Voice recognition service unavailable.")
    
    def parse_command(self, command):
        command = command.lower()
        
        if "turn on" in command or "switch on" in command:
            if "light" in command:
                self.turn_on_device("light")
            elif "fan" in command:
                self.turn_on_device("fan")
            elif "exhaust" in command:
                self.turn_on_device("exhaust")
            elif "plug" in command:
                self.turn_on_device("plug")
        
        elif "turn off" in command or "switch off" in command:
            if "light" in command:
                self.turn_off_device("light")
            elif "fan" in command:
                self.turn_off_device("fan")
            elif "exhaust" in command:
                self.turn_off_device("exhaust")
            elif "plug" in command:
                self.turn_off_device("plug")
        
        elif "temperature" in command:
            self.get_temperature()
        elif "light level" in command:
            self.get_light_intensity()
        elif "gas" in command or "air quality" in command:
            self.detect_gas_level()
        elif "status" in command:
            self.status_report()
        else:
            print("M.U.K.H.T.A.R: Command not recognized. Please try again.")
    
    def status_report(self):
        print("M.U.K.H.T.A.R: Initiating comprehensive system status report...")
        temp = self.get_temperature()
        light = self.get_light_intensity()
        gas = self.detect_gas_level()
        
        print("\\n--- M.U.K.H.T.A.R STATUS REPORT ---")
        print(f"Temperature: {temp}°C")
        print(f"Light Level: {light}")
        print(f"Gas Level: {gas}")
        print("Device Status:")
        for device, config in self.devices.items():
            status = "ONLINE" if config["status"] else "OFFLINE"
            print(f"  {device.title()}: {status}")
        print("--- END REPORT ---\\n")

# Main execution
if __name__ == "__main__":
    mukhtar = MUKHTAR()
    
    while True:
        print("\\nM.U.K.H.T.A.R: Awaiting commands...")
        print("Commands: 'voice', 'status', 'temp', 'light on/off', 'fan on/off', 'quit'")
        
        user_input = input("> ").strip().lower()
        
        if user_input == "quit":
            print("M.U.K.H.T.A.R: Shutting down. Farewell, Sir.")
            break
        elif user_input == "voice":
            mukhtar.voice_command()
        elif user_input == "status":
            mukhtar.status_report()
        else:
            mukhtar.parse_command(user_input)`;

  const configJson = `{
  "mukhtar_config": {
    "system_name": "M.U.K.H.T.A.R",
    "version": "1.0.0",
    "description": "Multifunctional Utility Keeper Harnessing Technology And Reasoning",
    
    "bolt_iot": {
      "api_key": "${apiKey}",
      "device_id": "${deviceId}",
      "base_url": "https://cloud.boltiot.com/remote"
    },
    
    "devices": {
      "light": {
        "pin": 0,
        "name": "Main Light",
        "type": "relay",
        "power_consumption": 15
      },
      "fan": {
        "pin": 1,
        "name": "Ceiling Fan",
        "type": "relay",
        "power_consumption": 75
      },
      "exhaust": {
        "pin": 2,
        "name": "Exhaust Fan",
        "type": "relay",
        "power_consumption": 45
      },
      "plug": {
        "pin": 3,
        "name": "Smart Plug",
        "type": "relay",
        "power_consumption": 25
      }
    },
    
    "sensors": {
      "temperature": {
        "pin": "D2",
        "type": "DHT11",
        "normal_range": [18, 30],
        "critical_threshold": 35
      },
      "humidity": {
        "pin": "D2",
        "type": "DHT11",
        "normal_range": [30, 70]
      },
      "light": {
        "pin": "A0",
        "type": "LDR",
        "auto_threshold": 200
      },
      "gas": {
        "pin": "A1",
        "type": "MQ2",
        "safe_threshold": 300,
        "danger_threshold": 500
      }
    },
    
    "automation_rules": {
      "temperature_control": {
        "condition": "temperature > 35",
        "action": "turn_on_fan",
        "message": "M.U.K.H.T.A.R: Temperature exceeds comfort zone. Cooling systems engaged."
      },
      "light_control": {
        "condition": "light_level < 200",
        "action": "turn_on_light",
        "message": "M.U.K.H.T.A.R: Ambient light insufficient. Illumination activated."
      },
      "gas_safety": {
        "condition": "gas_level > 300",
        "actions": ["turn_on_exhaust", "send_sms_alert"],
        "message": "M.U.K.H.T.A.R: ALERT - Gas levels elevated! Safety protocols activated."
      }
    },
    
    "twilio": {
      "account_sid": "${twilioSid}",
      "auth_token": "${twilioToken}",
      "from_number": "+1234567890",
      "to_number": "+0987654321"
    },
    
    "responses": {
      "greetings": [
        "M.U.K.H.T.A.R: Good day, Sir. All systems operational and ready for your commands.",
        "M.U.K.H.T.A.R: Greetings! How may I assist you today?",
        "M.U.K.H.T.A.R: Welcome back. Your digital assistant is at your service."
      ],
      "device_control": {
        "light_on": [
          "M.U.K.H.T.A.R: Illumination activated. Let there be light.",
          "M.U.K.H.T.A.R: Light engaged. Photons successfully deployed.",
          "M.U.K.H.T.A.R: Lighting system online. Your path is now luminous."
        ],
        "fan_on": [
          "M.U.K.H.T.A.R: Cooling system engaged. Air circulation initiated.",
          "M.U.K.H.T.A.R: Fan activated. Maintaining optimal climate conditions.",
          "M.U.K.H.T.A.R: Ventilation protocols are now in effect."
        ]
      }
    }
  }
}`;

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Cpu className="w-6 h-6 mr-2 text-cyan-400" />
            M.U.K.H.T.A.R Setup Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-500/30 bg-blue-500/10 mb-4">
            <Zap className="w-4 h-4 text-blue-400" />
            <AlertDescription className="text-blue-100">
              <strong>M.U.K.H.T.A.R:</strong> Welcome to the setup guide. Follow these steps to bring your AI assistant to life.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
              <Settings className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Configure</h3>
              <p className="text-sm text-gray-300">Set up credentials</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
              <Code className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Code</h3>
              <p className="text-sm text-gray-300">Upload to device</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
              <Cloud className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Connect</h3>
              <p className="text-sm text-gray-300">Link to cloud</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
              <CheckCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Deploy</h3>
              <p className="text-sm text-gray-300">Start monitoring</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-black/20 border-purple-500/20">
          <TabsTrigger value="config" className="data-[state=active]:bg-purple-600/30">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="arduino" className="data-[state=active]:bg-purple-600/30">
            <Cpu className="w-4 h-4 mr-2" />
            Arduino Code
          </TabsTrigger>
          <TabsTrigger value="python" className="data-[state=active]:bg-purple-600/30">
            <Code className="w-4 h-4 mr-2" />
            Python Script
          </TabsTrigger>
          <TabsTrigger value="cloud" className="data-[state=active]:bg-purple-600/30">
            <Cloud className="w-4 h-4 mr-2" />
            Cloud Setup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bolt IoT API Key
                  </label>
                  <Input
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-black/20 border-purple-500/30 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bolt Device ID
                  </label>
                  <Input
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="bg-black/20 border-purple-500/30 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twilio Account SID
                  </label>
                  <Input
                    value={twilioSid}
                    onChange={(e) => setTwilioSid(e.target.value)}
                    className="bg-black/20 border-purple-500/30 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twilio Auth Token
                  </label>
                  <Input
                    value={twilioToken}
                    onChange={(e) => setTwilioToken(e.target.value)}
                    className="bg-black/20 border-purple-500/30 text-white"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-medium text-white">Configuration JSON</h4>
                  <Button
                    onClick={() => copyToClipboard(configJson, "Configuration")}
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30 text-purple-400"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="bg-black/40 border border-purple-500/20 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto max-h-60">
                  {configJson}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arduino" className="space-y-4">
          <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Arduino/ESP8266 Code
                <Button
                  onClick={() => copyToClipboard(arduinoCode, "Arduino code")}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-400"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Code
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="border-orange-500/30 bg-orange-500/10 mb-4">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <AlertDescription className="text-orange-100">
                  Upload this code to your ESP8266/NodeMCU board. Ensure all libraries are installed via Arduino IDE Library Manager.
                </AlertDescription>
              </Alert>
              
              <pre className="bg-black/40 border border-purple-500/20 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto max-h-96">
                {arduinoCode}
              </pre>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h4 className="font-medium text-blue-400 mb-2">Required Libraries</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• ESP8266WiFi</li>
                    <li>• BoltDevice</li>
                    <li>• DHT sensor library</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <h4 className="font-medium text-green-400 mb-2">Wiring Guide</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• DHT11 → D2</li>
                    <li>• LDR → A0</li>
                    <li>• MQ2 → A1</li>
                    <li>• Relays → D0-D4</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="python" className="space-y-4">
          <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Python Control Script
                <Button
                  onClick={() => copyToClipboard(pythonCode, "Python script")}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-400"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Code
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="border-green-500/30 bg-green-500/10 mb-4">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <AlertDescription className="text-green-100">
                  This Python script enables full M.U.K.H.T.A.R functionality including voice commands, SMS alerts, and automated responses.
                </AlertDescription>
              </Alert>
              
              <pre className="bg-black/40 border border-purple-500/20 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto max-h-96">
                {pythonCode}
              </pre>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <h4 className="font-medium text-purple-400 mb-2">Required Packages</h4>
                  <code className="text-xs text-gray-300 block">
                    pip install requests twilio speechrecognition pyaudio
                  </code>
                </div>
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <h4 className="font-medium text-yellow-400 mb-2">Usage</h4>
                  <code className="text-xs text-gray-300 block">
                    python mukhtar.py
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cloud" className="space-y-4">
          <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Bolt Cloud Dashboard Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h4 className="font-medium text-blue-400 mb-3">Step 1: Create Account</h4>
                  <p className="text-sm text-gray-300 mb-3">
                    Register at cloud.boltiot.com and get your API credentials.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-500/30 text-blue-400"
                    onClick={() => window.open('https://cloud.boltiot.com', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Visit Bolt Cloud
                  </Button>
                </div>
                
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <h4 className="font-medium text-green-400 mb-3">Step 2: Add Device</h4>
                  <p className="text-sm text-gray-300 mb-3">
                    Register your Bolt WiFi module and configure pin settings.
                  </p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Device Registration Required
                  </Badge>
                </div>
                
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <h4 className="font-medium text-purple-400 mb-3">Step 3: Configure Dashboard</h4>
                  <p className="text-sm text-gray-300 mb-3">
                    Set up charts for temperature, humidity, light, and gas monitoring.
                  </p>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Chart Configuration
                  </Badge>
                </div>
                
                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <h4 className="font-medium text-orange-400 mb-3">Step 4: Set Alerts</h4>
                  <p className="text-sm text-gray-300 mb-3">
                    Configure SMS/email alerts for critical sensor readings.
                  </p>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    Alert Rules Setup
                  </Badge>
                </div>
              </div>
              
              <Alert className="border-cyan-500/30 bg-cyan-500/10">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <AlertDescription className="text-cyan-100">
                  <strong>M.U.K.H.T.A.R:</strong> Once configured, you'll be able to monitor and control your smart home from anywhere in the world. The future is now, Sir.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BoltSetupGuide;
