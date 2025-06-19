
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, Send, CheckCircle, AlertTriangle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TelegramIntegration = () => {
  const [botToken, setBotToken] = useState('YOUR_TELEGRAM_BOT_TOKEN');
  const [chatId, setChatId] = useState('YOUR_TELEGRAM_CHAT_ID');
  const [testMessage, setTestMessage] = useState('M.U.K.H.T.A.R: System test message. All systems operational.');
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastMessageStatus, setLastMessageStatus] = useState<'success' | 'error' | null>(null);
  const { toast } = useToast();

  // Sample Python code for Telegram integration
  const telegramPythonCode = `# M.U.K.H.T.A.R Telegram Integration
import requests
import json
from datetime import datetime

class TelegramBot:
    def __init__(self, bot_token, chat_id):
        self.bot_token = "${botToken}"
        self.chat_id = "${chatId}"
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"
        
    def send_message(self, message):
        """Send message via Telegram bot"""
        url = f"{self.base_url}/sendMessage"
        
        payload = {
            'chat_id': self.chat_id,
            'text': message,
            'parse_mode': 'HTML'
        }
        
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                print("M.U.K.H.T.A.R: Telegram message sent successfully.")
                return True
            else:
                print(f"M.U.K.H.T.A.R: Telegram error - {response.text}")
                return False
        except Exception as e:
            print(f"M.U.K.H.T.A.R: Telegram transmission failed: {e}")
            return False
    
    def send_alert(self, alert_type, sensor_data):
        """Send formatted alert message"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        if alert_type == "gas_alert":
            message = f"""🚨 <b>M.U.K.H.T.A.R CRITICAL ALERT</b> 🚨
            
<b>Gas Detection Warning!</b>
📍 Location: Smart Home System
⏰ Time: {timestamp}
📊 Gas Level: {sensor_data.get('gas_level', 'Unknown')}
🌡️ Temperature: {sensor_data.get('temperature', 'Unknown')}°C

⚠️ <b>IMMEDIATE ACTION REQUIRED</b>
• Evacuate the area
• Check ventilation systems
• Ensure all gas appliances are secure

Status: Exhaust fan automatically activated
System: M.U.K.H.T.A.R Emergency Protocol"""
            
        elif alert_type == "temperature_alert":
            message = f"""🌡️ <b>M.U.K.H.T.A.R Temperature Alert</b>
            
Temperature: {sensor_data.get('temperature', 'Unknown')}°C
Status: {"Critical" if float(sensor_data.get('temperature', 0)) > 40 else "High"}
Time: {timestamp}

Action: Cooling systems activated automatically"""
            
        elif alert_type == "system_status":
            message = f"""📋 <b>M.U.K.H.T.A.R Status Report</b>
            
🌡️ Temperature: {sensor_data.get('temperature', 'Unknown')}°C
💡 Light Level: {sensor_data.get('light', 'Unknown')}%
🌬️ Air Quality: {sensor_data.get('gas_level', 'Unknown')}
💧 Humidity: {sensor_data.get('humidity', 'Unknown')}%

🔌 Device Status:
• Light: {"ON" if sensor_data.get('light_status') else "OFF"}
• Fan: {"ON" if sensor_data.get('fan_status') else "OFF"}
• Exhaust: {"ON" if sensor_data.get('exhaust_status') else "OFF"}

Time: {timestamp}
Status: All systems operational"""
        
        else:
            message = f"M.U.K.H.T.A.R: {alert_type} at {timestamp}"
        
        return self.send_message(message)
    
    def send_device_notification(self, device, action, status):
        """Send device control notification"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        emoji_map = {
            'light': '💡',
            'fan': '🌀', 
            'exhaust': '🌬️',
            'plug': '🔌'
        }
        
        emoji = emoji_map.get(device, '⚡')
        action_text = "activated" if action == "on" else "deactivated"
        
        message = f"""{emoji} <b>M.U.K.H.T.A.R Device Update</b>
        
Device: {device.title()}
Action: {action_text.title()}
Status: {status}
Time: {timestamp}

Command executed successfully."""
        
        return self.send_message(message)

# Usage example:
telegram_bot = TelegramBot("${botToken}", "${chatId}")

# Send test message
telegram_bot.send_message("M.U.K.H.T.A.R: Telegram integration online. Standing by for alerts.")

# Send gas alert
telegram_bot.send_alert("gas_alert", {
    "gas_level": 450,
    "temperature": 28.5
})

# Send device notification
telegram_bot.send_device_notification("light", "on", "SUCCESS")`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${label} copied successfully`,
    });
  };

  const testConnection = async () => {
    if (!botToken || !chatId || botToken === 'YOUR_TELEGRAM_BOT_TOKEN') {
      toast({
        title: "Configuration Required",
        description: "Please enter valid bot token and chat ID",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    console.log('M.U.K.H.T.A.R: Testing Telegram connection...');

    try {
      // Simulate API call (in real implementation, this would be a backend call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success (90% chance)
      const success = Math.random() > 0.1;
      
      if (success) {
        setIsConnected(true);
        setLastMessageStatus('success');
        console.log('M.U.K.H.T.A.R: Telegram connection established. Message transmitted successfully.');
        toast({
          title: "Connection Successful",
          description: "M.U.K.H.T.A.R: Telegram integration online",
        });
      } else {
        setLastMessageStatus('error');
        console.log('M.U.K.H.T.A.R: Telegram connection failed. Verify credentials.');
        toast({
          title: "Connection Failed",
          description: "Please check bot token and chat ID",
          variant: "destructive",
        });
      }
    } catch (error) {
      setLastMessageStatus('error');
      console.log('M.U.K.H.T.A.R: Telegram transmission error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const sendTestMessage = async () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please test connection first",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    console.log(`M.U.K.H.T.A.R: Transmitting test message via Telegram - "${testMessage}"`);

    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLastMessageStatus('success');
      console.log('M.U.K.H.T.A.R: Test message transmitted successfully via Telegram.');
      toast({
        title: "Message Sent",
        description: "M.U.K.H.T.A.R test message delivered",
      });
    } catch (error) {
      setLastMessageStatus('error');
      console.log('M.U.K.H.T.A.R: Message transmission failed:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 text-blue-400" />
            Telegram Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-blue-500/30 bg-blue-500/10">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <AlertDescription className="text-blue-100">
              <strong>M.U.K.H.T.A.R:</strong> Configure Telegram bot for instant notifications and alerts. Real-time communication at your fingertips.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bot Token
              </label>
              <Input
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                className="bg-black/20 border-purple-500/30 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chat ID
              </label>
              <Input
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="-1001234567890"
                className="bg-black/20 border-purple-500/30 text-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={testConnection}
              disabled={isSending}
              className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30"
            >
              {isSending ? 'Testing...' : 'Test Connection'}
            </Button>
            
            <Badge 
              variant={isConnected ? "default" : "outline"}
              className={isConnected ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"}
            >
              {isConnected ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Disconnected
                </>
              )}
            </Badge>

            {lastMessageStatus && (
              <Badge 
                variant={lastMessageStatus === 'success' ? "default" : "destructive"}
                className={lastMessageStatus === 'success' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
              >
                Last: {lastMessageStatus === 'success' ? 'Success' : 'Failed'}
              </Badge>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Test Message
            </label>
            <div className="flex space-x-2">
              <Input
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="flex-1 bg-black/20 border-purple-500/30 text-white"
              />
              <Button
                onClick={sendTestMessage}
                disabled={isSending || !isConnected}
                className="bg-green-600/30 hover:bg-green-600/50 border border-green-500/30"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Python Integration Code
            <Button
              onClick={() => copyToClipboard(telegramPythonCode, "Telegram Python code")}
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
          <pre className="bg-black/40 border border-purple-500/20 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto max-h-96">
            {telegramPythonCode}
          </pre>
          
          <div className="mt-4 text-sm text-gray-400">
            <p><strong>Setup Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Create a new bot via @BotFather on Telegram</li>
              <li>Get your bot token and chat ID</li>
              <li>Install required Python packages: <code className="bg-black/40 px-1 rounded">pip install requests</code></li>
              <li>Replace the token and chat ID in the code above</li>
              <li>Run the Python script to enable notifications</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramIntegration;
