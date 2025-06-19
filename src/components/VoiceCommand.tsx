
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceCommandProps {
  onCommand: (command: string) => void;
}

const VoiceCommand: React.FC<VoiceCommandProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log('M.U.K.H.T.A.R: Voice recognition activated. Listening for commands...');
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[0];
        const transcriptText = result.transcript;
        const confidenceScore = result.confidence;
        
        setTranscript(transcriptText);
        setConfidence(confidenceScore);
        
        if (result.isFinal && confidenceScore > 0.7) {
          console.log(`M.U.K.H.T.A.R: Voice command received - "${transcriptText}" (confidence: ${(confidenceScore * 100).toFixed(1)}%)`);
          onCommand(transcriptText);
          setTranscript('');
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.log(`M.U.K.H.T.A.R: Voice recognition error - ${event.error}`);
        setIsListening(false);
        
        if (event.error === 'no-speech') {
          toast({
            title: "No Speech Detected",
            description: "M.U.K.H.T.A.R: I didn't hear anything. Please try again.",
            variant: "destructive",
          });
        } else if (event.error === 'not-allowed') {
          toast({
            title: "Microphone Access Denied",
            description: "M.U.K.H.T.A.R: Microphone permission required for voice commands.",
            variant: "destructive",
          });
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log('M.U.K.H.T.A.R: Voice recognition session ended.');
      };
      
      setIsAvailable(true);
    } else {
      console.log('M.U.K.H.T.A.R: Voice recognition not supported in this browser.');
      setIsAvailable(false);
    }
  }, [onCommand, toast]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        console.log('M.U.K.H.T.A.R: Activating voice command interface...');
      } catch (error) {
        console.log('M.U.K.H.T.A.R: Voice recognition startup error:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      console.log('M.U.K.H.T.A.R: Voice recognition deactivated.');
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isListening) {
      stopListening();
    }
    console.log(`M.U.K.H.T.A.R: Voice system ${!voiceEnabled ? 'enabled' : 'disabled'}.`);
  };

  if (!isAvailable) {
    return (
      <Card className="bg-black/20 border-red-500/20 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-red-400">
            <MicOff className="w-5 h-5" />
            <span className="text-sm">M.U.K.H.T.A.R: Voice recognition unavailable in this browser</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-sm flex items-center justify-between">
          Voice Command Interface
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVoice}
            className="h-6 w-6 p-0"
          >
            {voiceEnabled ? (
              <Volume2 className="w-4 h-4 text-green-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={!voiceEnabled}
            className={`relative w-16 h-16 rounded-full transition-all duration-300 ${
              isListening 
                ? 'bg-red-600/30 hover:bg-red-600/50 border-2 border-red-500 animate-pulse' 
                : 'bg-purple-600/30 hover:bg-purple-600/50 border-2 border-purple-500'
            }`}
          >
            <Mic className={`w-6 h-6 ${isListening ? 'text-red-400' : 'text-purple-400'}`} />
            {isListening && (
              <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping"></div>
            )}
          </Button>
        </div>

        <div className="text-center space-y-2">
          <Badge 
            variant={isListening ? "destructive" : "outline"}
            className={isListening ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-purple-500/20 text-purple-400 border-purple-500/30"}
          >
            {isListening ? "LISTENING..." : "READY"}
          </Badge>
          
          {transcript && (
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Transcript:</p>
              <p className="text-sm text-white bg-black/20 p-2 rounded border border-purple-500/30">
                "{transcript}"
              </p>
              {confidence > 0 && (
                <p className="text-xs text-cyan-400">
                  Confidence: {(confidence * 100).toFixed(1)}%
                </p>
              )}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <p><strong>M.U.K.H.T.A.R:</strong> Say commands like:</p>
          <ul className="text-xs space-y-0.5 ml-2">
            <li>• "Turn on the lights"</li>
            <li>• "What's the temperature?"</li>
            <li>• "Status report"</li>
            <li>• "Turn off fan"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceCommand;
