
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Mic, MicOff, Terminal, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VoiceCommand from './VoiceCommand';

interface CommandHistory {
  command: string;
  response: string;
  timestamp: Date;
  type: 'command' | 'response' | 'system';
}

const CommandParser = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initial greeting
    addToHistory('', 'M.U.K.H.T.A.R: Good day, Sir. All systems operational and ready for your commands.', 'system');
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const addToHistory = (cmd: string, response: string, type: 'command' | 'response' | 'system') => {
    const newEntry: CommandHistory = {
      command: cmd,
      response: response,
      timestamp: new Date(),
      type: type
    };
    setHistory(prev => [...prev, newEntry]);
  };

  const getWittyResponse = (command: string): string => {
    const cmd = command.toLowerCase().trim();
    
    // Device control responses
    if (cmd.includes('turn on') || cmd.includes('switch on') || cmd.includes('activate')) {
      if (cmd.includes('light')) {
        const responses = [
          'M.U.K.H.T.A.R: Illumination activated. Let there be light, as someone important once said.',
          'M.U.K.H.T.A.R: Photons successfully deployed. Your path is now luminous.',
          'M.U.K.H.T.A.R: Light engaged. Banishing darkness with technological superiority.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
      if (cmd.includes('fan')) {
        const responses = [
          'M.U.K.H.T.A.R: Cooling systems engaged. Air circulation protocols initiated.',
          'M.U.K.H.T.A.R: Fan activated. Atmospheric optimization in progress.',
          'M.U.K.H.T.A.R: Ventilation engaged. Climate control achieved with style.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
      if (cmd.includes('exhaust')) {
        return 'M.U.K.H.T.A.R: Exhaust system online. Air purification protocols active.';
      }
      if (cmd.includes('plug')) {
        return 'M.U.K.H.T.A.R: Smart plug activated. Power flows as commanded.';
      }
    }
    
    if (cmd.includes('turn off') || cmd.includes('switch off') || cmd.includes('deactivate')) {
      if (cmd.includes('light')) {
        const responses = [
          'M.U.K.H.T.A.R: Lights extinguished. Embracing the sophisticated darkness.',
          'M.U.K.H.T.A.R: Photon cessation complete. Welcome to the dark side.',
          'M.U.K.H.T.A.R: Illumination offline. Power conservation achieved.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
      if (cmd.includes('fan')) {
        return 'M.U.K.H.T.A.R: Cooling systems offline. Natural air circulation resumed.';
      }
      if (cmd.includes('exhaust')) {
        return 'M.U.K.H.T.A.R: Exhaust system deactivated. Air quality satisfactory.';
      }
      if (cmd.includes('plug')) {
        return 'M.U.K.H.T.A.R: Smart plug offline. Energy conservation protocol active.';
      }
    }
    
    // Information requests
    if (cmd.includes('temperature') || cmd.includes('temp')) {
      const temp = 24 + Math.random() * 10; // Simulated temperature
      const responses = [
        `M.U.K.H.T.A.R: Current temperature is ${temp.toFixed(1)}°C. Quite comfortable, if you ask me.`,
        `M.U.K.H.T.A.R: Environmental temperature reading: ${temp.toFixed(1)}°C. Well within human tolerance parameters.`,
        `M.U.K.H.T.A.R: Temperature status: ${temp.toFixed(1)}°C. ${temp > 30 ? 'Perhaps a cool beverage is in order?' : 'Perfect climate conditions maintained.'}`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (cmd.includes('light level') || cmd.includes('brightness')) {
      const light = Math.floor(Math.random() * 100);
      return `M.U.K.H.T.A.R: Light intensity at ${light}%. ${light < 30 ? 'Quite dim - shall I illuminate the area?' : 'Adequate for human activities.'}`;
    }
    
    if (cmd.includes('gas') || cmd.includes('air quality')) {
      const gas = Math.floor(Math.random() * 400);
      if (gas > 300) {
        return 'M.U.K.H.T.A.R: ALERT - Elevated gas levels detected! Initiating safety protocols immediately.';
      }
      return `M.U.K.H.T.A.R: Air quality nominal (${gas}). Breathe freely, Sir.`;
    }
    
    if (cmd.includes('status') || cmd.includes('report')) {
      return `M.U.K.H.T.A.R: System status optimal. Temperature: 24.5°C, Light: 65%, Air Quality: Normal. All devices responding. Standing by for further instructions.`;
    }
    
    if (cmd.includes('hello') || cmd.includes('hi') || cmd.includes('hey')) {
      const greetings = [
        'M.U.K.H.T.A.R: Greetings! How may I assist you today?',
        'M.U.K.H.T.A.R: Good day, Sir. Ready to serve.',
        'M.U.K.H.T.A.R: Hello there. Your digital assistant is at your service.'
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    if (cmd.includes('joke') || cmd.includes('funny')) {
      const jokes = [
        'M.U.K.H.T.A.R: Why did the IoT device go to therapy? It had connectivity issues.',
        'M.U.K.H.T.A.R: I\'d tell you a UDP joke, but you might not get it.',
        'M.U.K.H.T.A.R: There are only 10 types of people - those who understand binary and those who don\'t.'
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }
    
    if (cmd.includes('thank') || cmd.includes('thanks')) {
      const responses = [
        'M.U.K.H.T.A.R: You\'re quite welcome, Sir. Always a pleasure to serve.',
        'M.U.K.H.T.A.R: Think nothing of it. Serving you is my primary directive.',
        'M.U.K.H.T.A.R: My pleasure. Is there anything else you require?'
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default responses for unrecognized commands
    const defaultResponses = [
      'M.U.K.H.T.A.R: I\'m afraid I didn\'t catch that. Could you rephrase, or speak louder?',
      'M.U.K.H.T.A.R: Command not recognized. Perhaps you meant something else?',
      'M.U.K.H.T.A.R: My algorithms suggest that command doesn\'t exist in my database.',
      'M.U.K.H.T.A.R: I\'m intelligent, but not psychic. Please clarify your request.',
      'M.U.K.H.T.A.R: Hmm, that\'s a new one. Care to try a different approach?'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const processCommand = async (inputCommand: string) => {
    if (!inputCommand.trim()) return;
    
    setIsProcessing(true);
    addToHistory(inputCommand, '', 'command');
    
    console.log(`M.U.K.H.T.A.R: Processing command - "${inputCommand}"`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const response = getWittyResponse(inputCommand);
    addToHistory('', response, 'response');
    
    console.log(response);
    setIsProcessing(false);
    
    // Show toast for important commands
    if (inputCommand.toLowerCase().includes('alert') || inputCommand.toLowerCase().includes('gas')) {
      toast({
        title: "Alert Command Processed",
        description: "M.U.K.H.T.A.R has executed your alert command",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      processCommand(command);
      setCommand('');
    }
  };

  const handleVoiceCommand = (voiceCommand: string) => {
    processCommand(voiceCommand);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Terminal className="w-5 h-5 mr-2 text-cyan-400" />
              Command Interface
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVoice(!showVoice)}
                className="text-purple-400 hover:text-purple-300"
              >
                {showVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <Zap className="w-3 h-3 mr-1" />
                ONLINE
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Command History */}
          <ScrollArea className="h-64 w-full border border-purple-500/20 rounded-lg bg-black/20">
            <div ref={scrollRef} className="p-4 space-y-2">
              {history.map((entry, index) => (
                <div key={index} className="space-y-1">
                  {entry.command && (
                    <div className="flex items-start space-x-2">
                      <span className="text-xs text-gray-400 mt-1 font-mono">
                        {formatTimestamp(entry.timestamp)}
                      </span>
                      <div className="flex-1">
                        <span className="text-cyan-400 text-sm">➤ </span>
                        <span className="text-gray-300 text-sm">{entry.command}</span>
                      </div>
                    </div>
                  )}
                  {entry.response && (
                    <div className="flex items-start space-x-2 ml-4">
                      <span className="text-xs text-gray-500 mt-1 font-mono">
                        {formatTimestamp(entry.timestamp)}
                      </span>
                      <div className="flex-1">
                        <span className="text-purple-400 text-sm">◀ </span>
                        <span className={`text-sm ${
                          entry.response.includes('ALERT') ? 'text-red-400' : 
                          entry.type === 'system' ? 'text-blue-400' : 'text-gray-200'
                        }`}>
                          {entry.response}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-xs text-gray-500 font-mono">
                    {formatTimestamp(new Date())}
                  </span>
                  <span className="text-purple-400 text-sm">◀ </span>
                  <span className="text-gray-400 text-sm animate-pulse">
                    M.U.K.H.T.A.R: Processing command...
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Command Input */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter your command..."
              className="flex-1 bg-black/20 border-purple-500/30 text-white placeholder-gray-400"
              disabled={isProcessing}
            />
            <Button
              type="submit"
              disabled={isProcessing || !command.trim()}
              className="bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          
          {/* Sample Commands */}
          <div className="text-xs text-gray-400">
            <p className="mb-1"><strong>Sample commands:</strong></p>
            <div className="grid grid-cols-2 gap-1">
              <span>• Turn on lights</span>
              <span>• Status report</span>
              <span>• What's the temperature?</span>
              <span>• Turn off fan</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Voice Command Interface */}
      {showVoice && <VoiceCommand onCommand={handleVoiceCommand} />}
    </div>
  );
};

export default CommandParser;
