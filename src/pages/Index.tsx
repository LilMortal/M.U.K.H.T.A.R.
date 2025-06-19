
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Thermometer, 
  Lightbulb, 
  Fan, 
  AlertTriangle, 
  Power, 
  Cpu, 
  Activity,
  Home,
  Settings,
  MessageSquare,
  Brain,
  Zap,
  Shield,
  Menu,
  X
} from 'lucide-react';
import CommandParser from '@/components/CommandParser';
import DeviceControl from '@/components/DeviceControl';
import SensorDashboard from '@/components/SensorDashboard';
import AlertSystem from '@/components/AlertSystem';
import ConfigManager from '@/components/ConfigManager';
import BoltSetupGuide from '@/components/BoltSetupGuide';
import TelegramIntegration from '@/components/TelegramIntegration';

const Index = () => {
  const [systemStatus, setSystemStatus] = useState('online');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-gradient-radial from-blue-500/5 to-transparent rounded-full"></div>
      </div>

      {/* Header */}
      <div className="relative border-b border-cyan-500/20 bg-black/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-6">
              <div className="relative group">
                <div className="absolute -inset-1 md:-inset-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur"></div>
                <div className="relative bg-gradient-to-r from-cyan-400 to-purple-400 p-2 md:p-3 rounded-full">
                  <Brain className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full animate-pulse">
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
                  M.U.K.H.T.A.R
                </h1>
                <p className="text-xs md:text-sm text-cyan-300/80 font-medium tracking-wide hidden sm:block">
                  Multifunctional Utility Keeper Harnessing Technology And Reasoning
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-6">
              <div className="hidden md:flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <Badge 
                  variant={systemStatus === 'online' ? 'default' : 'destructive'} 
                  className="bg-green-500/20 text-green-400 border-green-500/30 font-medium px-3 py-1"
                >
                  <Activity className="w-3 h-3 mr-1 animate-pulse" />
                  {systemStatus.toUpperCase()}
                </Badge>
              </div>
              <div className="text-xs md:text-sm text-slate-300 font-mono bg-slate-800/30 px-2 md:px-4 py-1 md:py-2 rounded-lg border border-slate-700/50">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 md:px-6 py-4 md:py-8">
        <Tabs defaultValue="dashboard" className="space-y-4 md:space-y-8">
          {/* Mobile-optimized TabsList */}
          <div className="relative">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-black/40 border border-cyan-500/20 backdrop-blur-xl rounded-xl p-1 md:p-2 gap-1 md:gap-0">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-cyan-500/30 text-slate-300 hover:text-white transition-all duration-300 rounded-lg text-xs md:text-sm px-2 md:px-3 py-2"
              >
                <Home className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="devices" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-cyan-500/30 text-slate-300 hover:text-white transition-all duration-300 rounded-lg text-xs md:text-sm px-2 md:px-3 py-2"
              >
                <Power className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">Devices</span>
              </TabsTrigger>
              <TabsTrigger 
                value="sensors" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-cyan-500/30 text-slate-300 hover:text-white transition-all duration-300 rounded-lg text-xs md:text-sm px-2 md:px-3 py-2"
              >
                <Activity className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">Sensors</span>
              </TabsTrigger>
              <TabsTrigger 
                value="alerts" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-cyan-500/30 text-slate-300 hover:text-white transition-all duration-300 rounded-lg text-xs md:text-sm px-2 md:px-3 py-2 md:flex hidden"
              >
                <MessageSquare className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="setup" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-cyan-500/30 text-slate-300 hover:text-white transition-all duration-300 rounded-lg text-xs md:text-sm px-2 md:px-3 py-2 md:flex hidden"
              >
                <Cpu className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">Setup</span>
              </TabsTrigger>
              <TabsTrigger 
                value="config" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-cyan-500/30 text-slate-300 hover:text-white transition-all duration-300 rounded-lg text-xs md:text-sm px-2 md:px-3 py-2 md:flex hidden"
              >
                <Settings className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">Config</span>
              </TabsTrigger>
            </TabsList>

            {/* Mobile Menu Button for Hidden Tabs */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden absolute right-2 top-2 bg-black/40 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden absolute top-12 right-2 bg-black/90 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-2 space-y-1 z-50">
                <TabsTrigger 
                  value="alerts" 
                  className="w-full justify-start data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-cyan-500/30 text-slate-300 hover:text-white transition-all duration-300 rounded-lg text-sm px-3 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger 
                  value="setup" 
                  className="w-full justify-start data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-cyan-500/30 text-slate-300 hover:text-white transition-all duration-300 rounded-lg text-sm px-3 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Cpu className="w-4 h-4 mr-2" />
                  Setup
                </TabsTrigger>
                <TabsTrigger 
                  value="config" 
                  className="w-full justify-start data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-cyan-500/30 text-slate-300 hover:text-white transition-all duration-300 rounded-lg text-sm px-3 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Config
                </TabsTrigger>
              </div>
            )}
          </div>

          <TabsContent value="dashboard" className="space-y-4 md:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              <Card className="bg-black/30 border border-cyan-500/20 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
                <CardHeader className="border-b border-cyan-500/10 pb-3 md:pb-4">
                  <CardTitle className="text-white flex items-center text-base md:text-lg">
                    <MessageSquare className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-cyan-400" />
                    Command Interface
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <CommandParser />
                </CardContent>
              </Card>

              <Card className="bg-black/30 border border-purple-500/20 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
                <CardHeader className="border-b border-purple-500/10 pb-3 md:pb-4">
                  <CardTitle className="text-white flex items-center text-base md:text-lg">
                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-orange-400" />
                    System Alerts
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <AlertSystem />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/30 border border-slate-500/20 backdrop-blur-xl shadow-2xl">
              <CardHeader className="border-b border-slate-500/10 pb-3 md:pb-4">
                <CardTitle className="text-white text-base md:text-lg">Quick Status Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                  <div className="group p-3 md:p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 touch-manipulation">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <div className="p-1.5 md:p-2 bg-blue-500/20 rounded-lg">
                        <Thermometer className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
                      </div>
                      <span className="text-lg md:text-2xl font-bold text-white">24°C</span>
                    </div>
                    <p className="text-xs md:text-sm text-blue-300 font-medium">Temperature</p>
                    <div className="mt-1 md:mt-2 h-1 bg-blue-900/30 rounded-full">
                      <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
                    </div>
                  </div>

                  <div className="group p-3 md:p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 hover:scale-105 touch-manipulation">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <div className="p-1.5 md:p-2 bg-yellow-500/20 rounded-lg">
                        <Lightbulb className="w-4 h-4 md:w-6 md:h-6 text-yellow-400" />
                      </div>
                      <span className="text-lg md:text-2xl font-bold text-white">75%</span>
                    </div>
                    <p className="text-xs md:text-sm text-yellow-300 font-medium">Light Level</p>
                    <div className="mt-1 md:mt-2 h-1 bg-yellow-900/30 rounded-full">
                      <div className="h-full w-3/4 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"></div>
                    </div>
                  </div>

                  <div className="group p-3 md:p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 hover:scale-105 touch-manipulation">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <div className="p-1.5 md:p-2 bg-green-500/20 rounded-lg">
                        <Fan className="w-4 h-4 md:w-6 md:h-6 text-green-400" />
                      </div>
                      <span className="text-sm md:text-2xl font-bold text-white">Normal</span>
                    </div>
                    <p className="text-xs md:text-sm text-green-300 font-medium">Air Quality</p>
                    <div className="mt-1 md:mt-2 h-1 bg-green-900/30 rounded-full">
                      <div className="h-full w-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
                    </div>
                  </div>

                  <div className="group p-3 md:p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105 touch-manipulation">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <div className="p-1.5 md:p-2 bg-purple-500/20 rounded-lg">
                        <Power className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />
                      </div>
                      <span className="text-lg md:text-2xl font-bold text-white">3/4</span>
                    </div>
                    <p className="text-xs md:text-sm text-purple-300 font-medium">Devices Online</p>
                    <div className="mt-1 md:mt-2 h-1 bg-purple-900/30 rounded-full">
                      <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices">
            <DeviceControl />
          </TabsContent>

          <TabsContent value="sensors">
            <SensorDashboard />
          </TabsContent>

          <TabsContent value="alerts">
            <TelegramIntegration />
          </TabsContent>

          <TabsContent value="setup">
            <BoltSetupGuide />
          </TabsContent>

          <TabsContent value="config">
            <ConfigManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
