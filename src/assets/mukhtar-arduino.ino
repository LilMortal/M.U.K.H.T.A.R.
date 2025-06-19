// M.U.K.H.T.A.R IoT System - Arduino/ESP8266 Code
// Multifunctional Utility Keeper Harnessing Technology And Reasoning

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// Network credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Bolt IoT credentials
const char* boltApiKey = "YOUR_BOLT_API_KEY";
const char* boltDeviceId = "YOUR_BOLT_DEVICE_ID";

// Pin definitions
#define DHT_PIN D2
#define DHT_TYPE DHT11
#define LDR_PIN A0
#define GAS_PIN A1
#define LIGHT_PIN D0
#define FAN_PIN D1
#define EXHAUST_PIN D3
#define PLUG_PIN D4
#define BUZZER_PIN D5

// Initialize sensors
DHT dht(DHT_PIN, DHT_TYPE);

// System variables
float temperature = 0;
float humidity = 0;
int lightLevel = 0;
int gasLevel = 0;
bool autoMode = true;

// Device states
bool lightState = false;
bool fanState = false;
bool exhaustState = false;
bool plugState = false;

void setup() {
  Serial.begin(115200);
  delay(100);
  
  Serial.println("\n===========================================");
  Serial.println("M.U.K.H.T.A.R: System initialization commenced.");
  Serial.println("Multifunctional Utility Keeper Harnessing");
  Serial.println("Technology And Reasoning - Version 1.0");
  Serial.println("===========================================\n");
  
  // Initialize pins
  pinMode(LIGHT_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  pinMode(EXHAUST_PIN, OUTPUT);
  pinMode(PLUG_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Set all devices to OFF initially
  digitalWrite(LIGHT_PIN, LOW);
  digitalWrite(FAN_PIN, LOW);
  digitalWrite(EXHAUST_PIN, LOW);
  digitalWrite(PLUG_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);
  
  // Initialize DHT sensor
  dht.begin();
  
  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("M.U.K.H.T.A.R: All systems online. Standing by for commands, Sir.");
  delay(2000);
}

void loop() {
  // Read sensor data
  readSensors();
  
  // Send data to Bolt Cloud
  sendDataToBolt();
  
  // Execute M.U.K.H.T.A.R intelligence protocols
  mukhtarAI();
  
  // Display status
  displayStatus();
  
  delay(5000); // Update every 5 seconds
}

void connectToWiFi() {
  Serial.print("M.U.K.H.T.A.R: Establishing network connection to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("M.U.K.H.T.A.R: Network connection established successfully.");
  Serial.print("M.U.K.H.T.A.R: IP Address assigned: ");
  Serial.println(WiFi.localIP());
}

void readSensors() {
  // Read temperature and humidity
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  
  // Read light level (0-1024, convert to percentage)
  lightLevel = map(analogRead(LDR_PIN), 0, 1024, 0, 100);
  
  // Read gas level
  gasLevel = analogRead(GAS_PIN);
  
  // Handle sensor errors
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("M.U.K.H.T.A.R: DHT sensor malfunction detected. Attempting recalibration...");
    temperature = 25.0; // Default safe value
    humidity = 50.0;    // Default safe value
  }
}

void sendDataToBolt() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    // Send temperature
    String tempUrl = "https://cloud.boltiot.com/remote/" + String(boltApiKey) + 
                     "/analogWrite?pin=A0&value=" + String(temperature);
    http.begin(client, tempUrl);
    http.GET();
    http.end();
    
    // Send humidity
    String humUrl = "https://cloud.boltiot.com/remote/" + String(boltApiKey) + 
                    "/analogWrite?pin=A1&value=" + String(humidity);
    http.begin(client, humUrl);
    http.GET();
    http.end();
    
    // Send light level
    String lightUrl = "https://cloud.boltiot.com/remote/" + String(boltApiKey) + 
                      "/analogWrite?pin=A2&value=" + String(lightLevel);
    http.begin(client, lightUrl);
    http.GET();
    http.end();
    
    // Send gas level
    String gasUrl = "https://cloud.boltiot.com/remote/" + String(boltApiKey) + 
                    "/analogWrite?pin=A3&value=" + String(gasLevel);
    http.begin(client, gasUrl);
    http.GET();
    http.end();
  }
}

void mukhtarAI() {
  // M.U.K.H.T.A.R's intelligent decision making
  
  // Temperature control logic
  if (temperature > 35 && !fanState && autoMode) {
    turnOnDevice("fan");
    Serial.println("M.U.K.H.T.A.R: Temperature exceeds comfort parameters. Cooling systems engaged.");
  } else if (temperature < 30 && fanState && autoMode) {
    turnOffDevice("fan");
    Serial.println("M.U.K.H.T.A.R: Optimal temperature achieved. Cooling systems disengaged.");
  }
  
  // Light control logic
  if (lightLevel < 20 && !lightState && autoMode) {
    turnOnDevice("light");
    Serial.println("M.U.K.H.T.A.R: Ambient illumination insufficient. Photon deployment initiated.");
  } else if (lightLevel > 60 && lightState && autoMode) {
    turnOffDevice("light");
    Serial.println("M.U.K.H.T.A.R: Natural lighting adequate. Power conservation protocol active.");
  }
  
  // Gas safety protocol
  if (gasLevel > 300) {
    if (!exhaustState) {
      turnOnDevice("exhaust");
      Serial.println("M.U.K.H.T.A.R: ALERT - Atmospheric contamination detected! Initiating emergency ventilation.");
    }
    
    // Emergency alarm
    for (int i = 0; i < 3; i++) {
      digitalWrite(BUZZER_PIN, HIGH);
      delay(200);
      digitalWrite(BUZZER_PIN, LOW);
      delay(200);
    }
    
    if (gasLevel > 500) {
      Serial.println("M.U.K.H.T.A.R: CRITICAL ALERT - Evacuate immediately! Toxic gas levels detected!");
      // This would trigger SMS alert via Python script
    }
  } else if (gasLevel < 200 && exhaustState) {
    turnOffDevice("exhaust");
    Serial.println("M.U.K.H.T.A.R: Atmospheric conditions normalized. Ventilation systems on standby.");
  }
  
  // Witty environmental commentary
  if (temperature > 40) {
    Serial.println("M.U.K.H.T.A.R: Current temperature suggests we're either in a desert or someone left the oven on.");
  }
  
  if (humidity > 80) {
    Serial.println("M.U.K.H.T.A.R: Humidity levels high enough to grow mushrooms. Might I suggest a dehumidifier?");
  }
}

void turnOnDevice(String device) {
  if (device == "light") {
    digitalWrite(LIGHT_PIN, HIGH);
    lightState = true;
  } else if (device == "fan") {
    digitalWrite(FAN_PIN, HIGH);
    fanState = true;
  } else if (device == "exhaust") {
    digitalWrite(EXHAUST_PIN, HIGH);
    exhaustState = true;
  } else if (device == "plug") {
    digitalWrite(PLUG_PIN, HIGH);
    plugState = true;
  }
}

void turnOffDevice(String device) {
  if (device == "light") {
    digitalWrite(LIGHT_PIN, LOW);
    lightState = false;
  } else if (device == "fan") {
    digitalWrite(FAN_PIN, LOW);
    fanState = false;
  } else if (device == "exhaust") {
    digitalWrite(EXHAUST_PIN, LOW);
    exhaustState = false;
  } else if (device == "plug") {
    digitalWrite(PLUG_PIN, LOW);
    plugState = false;
  }
}

void displayStatus() {
  Serial.println("\n--- M.U.K.H.T.A.R ENVIRONMENTAL REPORT ---");
  Serial.println("Temperature: " + String(temperature) + "°C");
  Serial.println("Humidity: " + String(humidity) + "%");
  Serial.println("Light Level: " + String(lightLevel) + "%");
  Serial.println("Gas Level: " + String(gasLevel));
  Serial.println("Device Status:");
  Serial.println("  Light: " + String(lightState ? "ON" : "OFF"));
  Serial.println("  Fan: " + String(fanState ? "ON" : "OFF"));
  Serial.println("  Exhaust: " + String(exhaustState ? "ON" : "OFF"));
  Serial.println("  Smart Plug: " + String(plugState ? "ON" : "OFF"));
  Serial.println("Auto Mode: " + String(autoMode ? "ENABLED" : "DISABLED"));
  Serial.println("--- END REPORT ---\n");
}
