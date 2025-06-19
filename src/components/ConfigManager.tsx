
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Download, 
  Upload,
  Thermometer,
  Lightbulb,
  Wind,
  Zap,
  MessageCircle,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConfigData {
  system: {
    name: string;
    autoResponses: boolean;
    voiceEnabled: boolean;
    debugMode: boolean;
  };
  thresholds: {
    temperature: {
      min: number;
      max: number;
      critical: number;
    };
    humidity: {
      min: number;
      max: number;
    };
    light: {
      autoThreshold: number;
    };
    gas: {
      safeLevel: number;
      dangerLevel: number;
    };
  };
  automation: {
    temperatureControl: boolean;
    lightControl: boolean;
    gasAlert: boolean;
  };
  responses: {
    personality: string;
    greetings: string[];
    confirmations: string[];
  };
}

const ConfigManager = () => {
  const [config, setConfig] = useState<ConfigData>({
    system: {
      name: 'M.U.K.H.T.A.R',
      autoResponses: true,
      voiceEnabled: true,
      debugMode: false
    },
    thresholds: {
      temperature: {
        min: 18,
        max: 30,
        critical: 35
      },
      humidity: {
        min: 30,
        max: 70
      },
      light: {
        autoThreshold: 200
      },
      gas: {
        safeLevel: 300,
        dangerLevel: 500
      }
    },
    automation: {
      temperatureControl: true,
      lightControl: true,
      gasAlert: true
    },
    responses: {
      personality: 'witty',
      greetings: [
        'M.U.K.H.T.A.R: Good day, Sir. All systems operational and ready for your commands.',
        'M.U.K.H.T.A.R: Greetings! How may I assist you today?',
        'M.U.K.H.T.A.R: Welcome back. Your digital assistant is at your service.'
      ],
      confirmations: [
        'M.U.K.H.T.A.R: Task completed successfully.',
        'M.U.K.H.T.A.R: Command executed. Standing by for further instructions.',
        'M.U.K.H.T.A.R: Mission accomplished, Sir.'
      ]
    }
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load configuration from localStorage on component mount
    const savedConfig = localStorage.getItem('mukhtarConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        console.log('M.U.K.H.T.A.R: Configuration loaded from local storage.');
      } catch (error) {
        console.log('M.U.K.H.T.A.R: Error loading saved configuration. Using defaults.');
      }
    }
  }, []);

  const handleConfigChange = (section: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof ConfigData],
        [field]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const handleNestedConfigChange = (section: string, subsection: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof ConfigData],
        [subsection]: {
          ...(prev[section as keyof ConfigData] as any)[subsection],
          [field]: value
        }
      }
    }));
    setUnsavedChanges(true);
  };

  const saveConfiguration = () => {
    try {
      localStorage.setItem('mukhtarConfig', JSON.stringify(config));
      setUnsavedChanges(false);
      console.log('M.U.K.H.T.A.R: Configuration saved successfully. Changes applied to system.');
      toast({
        title: "Configuration Saved",
        description: "M.U.K.H.T.A.R settings have been updated",
      });
    } catch (error) {
      console.log('M.U.K.H.T.A.R: Error saving configuration. Please try again.');
      toast({
        title: "Save Failed",
        description: "Unable to save configuration",
        variant: "destructive",
      });
    }
  };

  const resetToDefaults = () => {
    const defaultConfig: ConfigData = {
      system: {
        name: 'M.U.K.H.T.A.R',
        autoResponses: true,
        voiceEnabled: true,
        debugMode: false
      },
      thresholds: {
        temperature: {
          min: 18,
          max: 30,
          critical: 35
        },
        humidity: {
          min: 30,
          max: 70
        },
        light: {
          autoThreshold: 200
        },
        gas: {
          safeLevel: 300,
          dangerLevel: 500
        }
      },
      automation: {
        temperatureControl: true,
        lightControl: true,
        gasAlert: true
      },
      responses: {
        personality: 'witty',
        greetings: [
          'M.U.K.H.T.A.R: Good day, Sir. All systems operational and ready for your commands.',
          'M.U.K.H.T.A.R: Greetings! How may I assist you today?',
          'M.U.K.H.T.A.R: Welcome back. Your digital assistant is at your service.'
        ],
        confirmations: [
          'M.U.K.H.T.A.R: Task completed successfully.',
          'M.U.K.H.T.A.R: Command executed. Standing by for further instructions.',
          'M.U.K.H.T.A.R: Mission accomplished, Sir.'
        ]
      }
    };

    setConfig(defaultConfig);
    setUnsavedChanges(true);
    console.log('M.U.K.H.T.A.R: Configuration reset to factory defaults.');
    toast({
      title: "Reset Complete",
      description: "Configuration restored to defaults",
    });
  };

  const exportConfiguration = () => {
    const configBlob = new Blob([JSON.stringify(config, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(configBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mukhtar-config.json';
    link.click();
    URL.revokeObjectURL(url);

    console.log('M.U.K.H.T.A.R: Configuration exported successfully. File downloaded.');
    toast({
      title: "Export Complete",
      description: "Configuration file downloaded",
    });
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string);
          setConfig(importedConfig);
          setUnsavedChanges(true);
          console.log('M.U.K.H.T.A.R: Configuration imported successfully. Review settings before saving.');
          toast({
            title: "Import Complete",
            description: "Configuration loaded from file",
          });
        } catch (error) {
          console.log('M.U.K.H.T.A.R: Error importing configuration. File format may be invalid.');
          toast({
            title: "Import Failed",
            description: "Invalid configuration file",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="w-6 h-6 mr-2 text-cyan-400" />
              M.U.K.H.T.A.R Configuration
            </div>
            <div className="flex items-center space-x-2">
              {unsavedChanges && (
                <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                  Unsaved Changes
                </Badge>
              )}
              <Button
                onClick={saveConfiguration}
                disabled={!unsavedChanges}
                className="bg-green-600/30 hover:bg-green-600/50 border border-green-500/30"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-blue-500/30 bg-blue-500/10">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <AlertDescription className="text-blue-100">
              <strong>M.U.K.H.T.A.R:</strong> These settings control my behavior and response patterns. 
              Adjust them to customize our interaction experience.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-black/20 border-purple-500/20">
          <TabsTrigger value="system" className="data-[state=active]:bg-purple-600/30">
            <Settings className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="thresholds" className="data-[state=active]:bg-purple-600/30">
            <Thermometer className="w-4 h-4 mr-2" />
            Thresholds
          </TabsTrigger>
          <TabsTrigger value="automation" className="data-[state=active]:bg-purple-600/30">
            <Zap className="w-4 h-4 mr-2" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="responses" className="data-[state=active]:bg-purple-600/30">
            <MessageCircle className="w-4 h-4 mr-2" />
            Responses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    System Name
                  </label>
                  <Input
                    value={config.system.name}
                    onChange={(e) => handleConfigChange('system', 'name', e.target.value)}
                    className="bg-black/20 border-purple-500/30 text-white"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">
                      Auto Responses
                    </label>
                    <Switch
                      checked={config.system.autoResponses}
                      onCheckedChange={(value) => handleConfigChange('system', 'autoResponses', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">
                      Voice Commands
                    </label>
                    <Switch
                      checked={config.system.voiceEnabled}
                      onCheckedChange={(value) => handleConfigChange('system', 'voiceEnabled', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">
                      Debug Mode
                    </label>
                    <Switch
                      checked={config.system.debugMode}
                      onCheckedChange={(value) => handleConfigChange('system', 'debugMode', value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={resetToDefaults}
                  variant="outline"
                  className="border-orange-500/30 text-orange-400"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset to Defaults
                </Button>
                <Button
                  onClick={exportConfiguration}
                  variant="outline"
                  className="border-blue-500/30 text-blue-400"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export Config
                </Button>
                <label className="cursor-pointer">
                  <Button
                    variant="outline"
                    className="border-green-500/30 text-green-400"
                    asChild
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-1" />
                      Import Config
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importConfiguration}
                    className="hidden"
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Thermometer className="w-5 h-5 mr-2 text-red-400" />
                  Temperature Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Comfortable Temperature: {config.thresholds.temperature.min}°C
                  </label>
                  <Slider
                    value={[config.thresholds.temperature.min]}
                    onValueChange={(value) => handleNestedConfigChange('thresholds', 'temperature', 'min', value[0])}
                    max={30}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Comfortable Temperature: {config.thresholds.temperature.max}°C
                  </label>
                  <Slider
                    value={[config.thresholds.temperature.max]}
                    onValueChange={(value) => handleNestedConfigChange('thresholds', 'temperature', 'max', value[0])}
                    max={40}
                    min={20}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Critical Temperature Threshold: {config.thresholds.temperature.critical}°C
                  </label>
                  <Slider
                    value={[config.thresholds.temperature.critical]}
                    onValueChange={(value) => handleNestedConfigChange('thresholds', 'temperature', 'critical', value[0])}
                    max={50}
                    min={30}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                  Light & Gas Thresholds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Auto Light Threshold: {config.thresholds.light.autoThreshold}
                  </label>
                  <Slider
                    value={[config.thresholds.light.autoThreshold]}
                    onValueChange={(value) => handleNestedConfigChange('thresholds', 'light', 'autoThreshold', value[0])}
                    max={1000}
                    min={50}
                    step={10}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gas Safe Level: {config.thresholds.gas.safeLevel}
                  </label>
                  <Slider
                    value={[config.thresholds.gas.safeLevel]}
                    onValueChange={(value) => handleNestedConfigChange('thresholds', 'gas', 'safeLevel', value[0])}
                    max={500}
                    min={100}
                    step={10}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gas Danger Level: {config.thresholds.gas.dangerLevel}
                  </label>
                  <Slider
                    value={[config.thresholds.gas.dangerLevel]}
                    onValueChange={(value) => handleNestedConfigChange('thresholds', 'gas', 'dangerLevel', value[0])}
                    max={1000}
                    min={400}
                    step={10}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-orange-400" />
                Automation Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-blue-400">Temperature Control</h4>
                    <Switch
                      checked={config.automation.temperatureControl}
                      onCheckedChange={(value) => handleConfigChange('automation', 'temperatureControl', value)}
                    />
                  </div>
                  <p className="text-sm text-gray-300">
                    Automatically activates fan when temperature exceeds threshold.
                  </p>
                  <Badge className={`mt-2 ${config.automation.temperatureControl ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {config.automation.temperatureControl ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-yellow-400">Light Control</h4>
                    <Switch
                      checked={config.automation.lightControl}
                      onCheckedChange={(value) => handleConfigChange('automation', 'lightControl', value)}
                    />
                  </div>
                  <p className="text-sm text-gray-300">
                    Automatically turns on lights when ambient light is low.
                  </p>
                  <Badge className={`mt-2 ${config.automation.lightControl ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {config.automation.lightControl ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-red-400">Gas Alert System</h4>
                    <Switch
                      checked={config.automation.gasAlert}
                      onCheckedChange={(value) => handleConfigChange('automation', 'gasAlert', value)}
                    />
                  </div>
                  <p className="text-sm text-gray-300">
                    Sends SMS alerts and activates exhaust when gas is detected.
                  </p>
                  <Badge className={`mt-2 ${config.automation.gasAlert ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {config.automation.gasAlert ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
                Response Customization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Greeting Messages
                </label>
                <Textarea
                  value={config.responses.greetings.join('\n')}
                  onChange={(e) => handleConfigChange('responses', 'greetings', e.target.value.split('\n'))}
                  className="bg-black/20 border-purple-500/30 text-white min-h-24"
                  placeholder="Enter greeting messages, one per line"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Each line will be a separate greeting option
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmation Messages
                </label>
                <Textarea
                  value={config.responses.confirmations.join('\n')}
                  onChange={(e) => handleConfigChange('responses', 'confirmations', e.target.value.split('\n'))}
                  className="bg-black/20 border-purple-500/30 text-white min-h-24"
                  placeholder="Enter confirmation messages, one per line"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Responses used when tasks are completed
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigManager;
