
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Fan, 
  Wind, 
  Plug, 
  Power, 
  Wifi, 
  WifiOff,
  Settings,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Device {
  id: string;
  name: string;
  type: 'light' | 'fan' | 'exhaust' | 'plug';
  status: 'on' | 'off';
  connected: boolean;
  pin: number;
  powerConsumption: number;
  icon: React.ReactNode;
}

const DeviceControl = () => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'Main Light',
      type: 'light',
      status: 'off',
      connected: true,
      pin: 0,
      powerConsumption: 15,
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      id: '2',
      name: 'Ceiling Fan',
      type: 'fan',
      status: 'on',
      connected: true,
      pin: 1,
      powerConsumption: 75,
      icon: <Fan className="w-6 h-6" />
    },
    {
      id: '3',
      name: 'Exhaust Fan',
      type: 'exhaust',
      status: 'off',
      connected: true,
      pin: 2,
      powerConsumption: 45,
      icon: <Wind className="w-6 h-6" />
    },
    {
      id: '4',
      name: 'Smart Plug',
      type: 'plug',
      status: 'on',
      connected: false,
      pin: 3,
      powerConsumption: 25,
      icon: <Plug className="w-6 h-6" />
    }
  ]);

  const { toast } = useToast();

  const toggleDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId && device.connected) {
        const newStatus = device.status === 'on' ? 'off' : 'on';
        
        // Generate M.U.K.H.T.A.R response
        const responses = {
          light: {
            on: 'M.U.K.H.T.A.R: Illumination activated. Banishing darkness with style.',
            off: 'M.U.K.H.T.A.R: Lights extinguished. The shadows welcome you back.'
          },
          fan: {
            on: 'M.U.K.H.T.A.R: Cooling system engaged. Air circulation protocols initiated.',
            off: 'M.U.K.H.T.A.R: Fan deactivated. Returning to natural breeze mode.'
          },
          exhaust: {
            on: 'M.U.K.H.T.A.R: Exhaust fan online. Initiating atmospheric purification.',
            off: 'M.U.K.H.T.A.R: Extraction system offline. Air quality deemed acceptable.'
          },
          plug: {
            on: 'M.U.K.H.T.A.R: Smart plug activated. Power flows where needed.',
            off: 'M.U.K.H.T.A.R: Power outlet offline. Energy conservation achieved.'
          }
        };

        console.log(responses[device.type][newStatus]);
        
        toast({
          title: "Device Control",
          description: `${device.name} turned ${newStatus}`,
        });

        return { ...device, status: newStatus };
      }
      return device;
    }));
  };

  const reconnectDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        console.log(`M.U.K.H.T.A.R: Attempting to reconnect ${device.name}. Stand by...`);
        
        // Simulate reconnection after 2 seconds
        setTimeout(() => {
          setDevices(current => current.map(d => 
            d.id === deviceId ? { ...d, connected: true } : d
          ));
          console.log(`M.U.K.H.T.A.R: ${device.name} reconnection successful. Welcome back to the network.`);
          toast({
            title: "Device Reconnected",
            description: `${device.name} is back online`,
          });
        }, 2000);

        return { ...device, connected: false };
      }
      return device;
    }));
  };

  const getTotalPowerConsumption = () => {
    return devices
      .filter(device => device.status === 'on' && device.connected)
      .reduce((total, device) => total + device.powerConsumption, 0);
  };

  const getDeviceStatusColor = (device: Device) => {
    if (!device.connected) return 'text-red-400 border-red-500/30';
    return device.status === 'on' ? 'text-green-400 border-green-500/30' : 'text-gray-400 border-gray-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Power Overview */}
      <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-cyan-400" />
              Power Management
            </span>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              {getTotalPowerConsumption()}W Total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-400">Active Devices</span>
                <Power className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {devices.filter(d => d.status === 'on' && d.connected).length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-400">Connected</span>
                <Wifi className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {devices.filter(d => d.connected).length}/{devices.length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-orange-400">Efficiency</span>
                <Settings className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-white">92%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {devices.map((device) => (
          <Card key={device.id} className={`bg-black/20 border-purple-500/20 backdrop-blur-sm transition-all duration-300 hover:border-purple-400/40 ${!device.connected ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center justify-between text-lg">
                <div className="flex items-center space-x-2">
                  <div className={getDeviceStatusColor(device)}>
                    {device.icon}
                  </div>
                  <span>{device.name}</span>
                </div>
                {device.connected ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Status</span>
                <Badge className={getDeviceStatusColor(device)}>
                  {device.connected ? device.status.toUpperCase() : 'OFFLINE'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Pin {device.pin}</span>
                <span className="text-sm text-gray-300">
                  {device.status === 'on' && device.connected ? `${device.powerConsumption}W` : '0W'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Power</span>
                  <Switch
                    checked={device.status === 'on' && device.connected}
                    onCheckedChange={() => toggleDevice(device.id)}
                    disabled={!device.connected}
                  />
                </div>
                
                {device.status === 'on' && device.connected && (
                  <Progress 
                    value={(device.powerConsumption / 100) * 100} 
                    className="h-2"
                  />
                )}
              </div>

              {!device.connected && (
                <Button
                  onClick={() => reconnectDevice(device.id)}
                  variant="outline"
                  size="sm"
                  className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                >
                  Reconnect
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Control History */}
      <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <span className="text-sm text-gray-300">M.U.K.H.T.A.R: Ceiling Fan activated. Cooling protocols engaged.</span>
              <span className="text-xs text-gray-400">2 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <span className="text-sm text-gray-300">M.U.K.H.T.A.R: Smart Plug connection lost. Investigating...</span>
              <span className="text-xs text-gray-400">5 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <span className="text-sm text-gray-300">M.U.K.H.T.A.R: All systems nominal. Environment optimized.</span>
              <span className="text-xs text-gray-400">15 min ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceControl;
