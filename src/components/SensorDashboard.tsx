import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  Eye
} from 'lucide-react';

interface SensorData {
  timestamp: string;
  temperature: number;
  humidity: number;
  lightLevel: number;
  gasLevel: number;
}

const SensorDashboard = () => {
  const [currentData, setCurrentData] = useState({
    temperature: 24.5,
    humidity: 45,
    lightLevel: 75,
    gasLevel: 45
  });

  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);

  useEffect(() => {
    // Generate initial historical data
    const generateHistoricalData = () => {
      const data: SensorData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          timestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temperature: 22 + Math.random() * 6,
          humidity: 40 + Math.random() * 20,
          lightLevel: Math.random() * 100,
          gasLevel: 30 + Math.random() * 40
        });
      }
      
      setHistoricalData(data);
    };

    generateHistoricalData();

    // Simulate real-time data updates
    const interval = setInterval(() => {
      setCurrentData(prev => ({
        temperature: Math.max(18, Math.min(35, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(20, Math.min(80, prev.humidity + (Math.random() - 0.5) * 4)),
        lightLevel: Math.max(0, Math.min(100, prev.lightLevel + (Math.random() - 0.5) * 10)),
        gasLevel: Math.max(0, Math.min(100, prev.gasLevel + (Math.random() - 0.5) * 5))
      }));

      // Add new data point to historical data
      setHistoricalData(prev => {
        const newData = [...prev];
        const now = new Date();
        newData.push({
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temperature: currentData.temperature,
          humidity: currentData.humidity,
          lightLevel: currentData.lightLevel,
          gasLevel: currentData.gasLevel
        });
        
        // Keep only last 24 data points
        return newData.slice(-24);
      });

      // M.U.K.H.T.A.R environmental monitoring comments
      if (currentData.temperature > 30) {
        console.log('M.U.K.H.T.A.R: Temperature rising beyond comfort zone. Consider activating cooling systems.');
      }
      if (currentData.gasLevel > 70) {
        console.log('M.U.K.H.T.A.R: Gas levels elevated. Monitoring atmospheric composition closely.');
      }
      if (currentData.lightLevel < 20) {
        console.log('M.U.K.H.T.A.R: Light levels dropping. Shall I illuminate the environment?');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentData]);

  const getSensorStatus = (value: number, type: string) => {
    switch (type) {
      case 'temperature':
        if (value < 18) return { status: 'low', color: 'text-blue-400', message: 'Cool' };
        if (value > 30) return { status: 'high', color: 'text-red-400', message: 'Hot' };
        return { status: 'normal', color: 'text-green-400', message: 'Optimal' };
      
      case 'humidity':
        if (value < 30) return { status: 'low', color: 'text-yellow-400', message: 'Dry' };
        if (value > 70) return { status: 'high', color: 'text-blue-400', message: 'Humid' };
        return { status: 'normal', color: 'text-green-400', message: 'Comfortable' };
      
      case 'gas':
        if (value > 80) return { status: 'high', color: 'text-red-400', message: 'Dangerous' };
        if (value > 60) return { status: 'medium', color: 'text-yellow-400', message: 'Elevated' };
        return { status: 'normal', color: 'text-green-400', message: 'Safe' };
      
      default:
        return { status: 'normal', color: 'text-green-400', message: 'Normal' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Temperature */}
        <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center justify-between text-lg">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-red-400" />
                <span>Temperature</span>
              </div>
              <Badge className={`${getSensorStatus(currentData.temperature, 'temperature').color} bg-transparent border-current`}>
                {getSensorStatus(currentData.temperature, 'temperature').message}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-white">
                {currentData.temperature.toFixed(1)}°C
              </div>
              <Progress 
                value={(currentData.temperature / 40) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0°C</span>
                <span>40°C</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Humidity */}
        <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center justify-between text-lg">
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-blue-400" />
                <span>Humidity</span>
              </div>
              <Badge className={`${getSensorStatus(currentData.humidity, 'humidity').color} bg-transparent border-current`}>
                {getSensorStatus(currentData.humidity, 'humidity').message}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-white">
                {currentData.humidity.toFixed(0)}%
              </div>
              <Progress 
                value={currentData.humidity} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Light Level */}
        <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center justify-between text-lg">
              <div className="flex items-center space-x-2">
                <Sun className="w-5 h-5 text-yellow-400" />
                <span>Light Level</span>
              </div>
              <Badge className="text-green-400 bg-transparent border-green-500/30">
                Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-white">
                {currentData.lightLevel.toFixed(0)}%
              </div>
              <Progress 
                value={currentData.lightLevel} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Dark</span>
                <span>Bright</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gas Detection */}
        <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center justify-between text-lg">
              <div className="flex items-center space-x-2">
                <Wind className="w-5 h-5 text-green-400" />
                <span>Air Quality</span>
              </div>
              <Badge className={`${getSensorStatus(currentData.gasLevel, 'gas').color} bg-transparent border-current`}>
                {getSensorStatus(currentData.gasLevel, 'gas').message}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-white">
                {currentData.gasLevel.toFixed(0)}
              </div>
              <Progress 
                value={currentData.gasLevel} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Clean</span>
                <span>Polluted</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature & Humidity Chart */}
        <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
              Temperature & Humidity Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Temperature (°C)"
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Light & Gas Chart */}
        <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-cyan-400" />
              Environmental Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="lightLevel" 
                  stackId="1"
                  stroke="#FBBF24" 
                  fill="#FBBF24"
                  fillOpacity={0.3}
                  name="Light Level (%)"
                />
                <Area 
                  type="monotone" 
                  dataKey="gasLevel" 
                  stackId="2"
                  stroke="#10B981" 
                  fill="#10B981"
                  fillOpacity={0.3}
                  name="Gas Level"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* M.U.K.H.T.A.R Insights */}
      <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Eye className="w-5 h-5 mr-2 text-purple-400" />
            M.U.K.H.T.A.R Environmental Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-100">
                <span className="font-semibold">M.U.K.H.T.A.R:</span> Temperature is holding steady at {currentData.temperature.toFixed(1)}°C. 
                Optimal comfort range maintained. No intervention required at this time.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-100">
                <span className="font-semibold">M.U.K.H.T.A.R:</span> Air quality sensors report normal levels. 
                Atmospheric composition within safe parameters. Breathing easy, as they say.
              </p>
            </div>
            
            {currentData.lightLevel < 30 && (
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-yellow-100">
                  <span className="font-semibold">M.U.K.H.T.A.R:</span> Light levels are rather dim at {currentData.lightLevel.toFixed(0)}%. 
                  Shall I activate the illumination systems to brighten your environment?
                </p>
              </div>
            )}
            
            {currentData.temperature > 28 && (
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-sm text-orange-100">
                  <span className="font-semibold">M.U.K.H.T.A.R:</span> Temperature climbing to {currentData.temperature.toFixed(1)}°C. 
                  Might I suggest activating the cooling systems? Comfort is key to productivity.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SensorDashboard;
