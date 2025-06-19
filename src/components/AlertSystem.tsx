import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert as AlertBox, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  Thermometer,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  actions: string[];
}

const AlertSystem = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Simulate initial alerts on component mount
    const initialAlerts: Alert[] = [
      {
        id: '1',
        type: 'info',
        title: 'System Online',
        message: 'M.U.K.H.T.A.R: System initialization complete. All devices operational.',
        timestamp: new Date(),
        acknowledged: false,
        actions: ['System Check', 'Network Scan']
      },
      {
        id: '2',
        type: 'warning',
        title: 'Low Light Detected',
        message: 'M.U.K.H.T.A.R: Ambient light levels are low. Consider turning on the lights.',
        timestamp: new Date(),
        acknowledged: false,
        actions: ['Light Adjustment']
      }
    ];
    setAlerts(initialAlerts);
  }, []);

  const simulateGasAlert = () => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      type: 'critical',
      title: 'Gas Detection Alert',
      message: 'M.U.K.H.T.A.R: CRITICAL - Dangerous gas levels detected! Exhaust system activated. Evacuate immediately.',
      timestamp: new Date(),
      acknowledged: false,
      actions: ['SMS Alert Sent', 'Exhaust Fan Activated', 'Emergency Protocol Initiated']
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    console.log('M.U.K.H.T.A.R: EMERGENCY PROTOCOL - Gas leak detected! Initiating immediate safety measures.');
    console.log('M.U.K.H.T.A.R: SMS alert transmitted to emergency contacts.');
    console.log('M.U.K.H.T.A.R: Telegram notification sent to all configured channels.');
    
    useToast().toast({
      title: "CRITICAL ALERT",
      description: "Gas leak detected - Emergency protocols activated",
      variant: "destructive",
    });
  };

  const simulateTemperatureAlert = () => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      type: 'warning',
      title: 'Temperature Warning',
      message: 'M.U.K.H.T.A.R: High temperature detected (38°C). Cooling systems engaged automatically.',
      timestamp: new Date(),
      acknowledged: false,
      actions: ['Fan Activated', 'SMS Notification Sent']
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    console.log('M.U.K.H.T.A.R: Temperature threshold exceeded. Deploying thermal management protocols.');
    
    useToast().toast({
      title: "Temperature Alert",
      description: "High temperature - Cooling activated",
    });
  };

  const simulateSystemAlert = () => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      type: 'info',
      title: 'System Status Update',
      message: 'M.U.K.H.T.A.R: Routine system check completed. All devices operational. Voice commands online.',
      timestamp: new Date(),
      acknowledged: false,
      actions: ['Status Report Generated', 'Telegram Update Sent']
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    console.log('M.U.K.H.T.A.R: System diagnostics complete. All parameters within normal range.');
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const clearAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Alert Controls */}
      <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm">Alert Simulation Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button
              onClick={simulateGasAlert}
              size="sm"
              className="bg-red-600/30 hover:bg-red-600/50 border border-red-500/30 text-red-400"
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Gas Alert
            </Button>
            <Button
              onClick={simulateTemperatureAlert}
              size="sm"
              className="bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/30 text-orange-400"
            >
              <Thermometer className="w-4 h-4 mr-1" />
              Temp Alert
            </Button>
            <Button
              onClick={simulateSystemAlert}
              size="sm"
              className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-blue-400"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              System Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <Card className="bg-black/20 border-purple-500/20 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm">Active Alerts</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ScrollArea className="rounded-md">
            <div className="space-y-4 p-4">
              {alerts.length === 0 ? (
                <p className="text-gray-400 text-sm">No active alerts at this time.</p>
              ) : (
                alerts.map(alert => (
                  <AlertBox
                    key={alert.id}
                    variant={alert.type === 'critical' ? 'destructive' : 'default'}
                  >
                    <div className="flex items-start space-x-4">
                      {alert.type === 'critical' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                      {alert.type === 'warning' && <Thermometer className="w-5 h-5 text-orange-500" />}
                      {alert.type === 'info' && <CheckCircle className="w-5 h-5 text-blue-500" />}
                      
                      <div className="flex-1">
                        <AlertTitle className="text-white">{alert.title}</AlertTitle>
                        <AlertDescription className="text-gray-300">
                          {alert.message}
                          <p className="text-xs mt-1">
                            <span className="font-semibold">Timestamp:</span> {alert.timestamp.toLocaleTimeString()}
                          </p>
                          <ul className="list-disc list-inside text-xs mt-1">
                            {alert.actions.map((action, index) => (
                              <li key={index}>{action}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!alert.acknowledged && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="border-yellow-500/30 text-yellow-400"
                          >
                            Acknowledge
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => clearAlert(alert.id)}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </AlertBox>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertSystem;
