import { useFirebaseData } from '@/hooks/useFirebaseData';
import { SensorCard } from '@/components/SensorCard';
import { StatusIndicator } from '@/components/StatusIndicator';
import { Loader2 } from 'lucide-react';

export function Dashboard() {
  const { currentData, historicalData, isOnline, lastSeen, loading } = useFirebaseData();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-honey" />
      </div>
    );
  }

  if (!currentData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl text-muted-foreground">No data available</p>
          <p className="text-sm text-muted-foreground">Waiting for sensor data...</p>
        </div>
      </div>
    );
  }

  // Transform historical data for charts
  const getHistoricalArray = (key: 'temperature' | 'humidity' | 'airpurity') => {
    return Object.entries(historicalData)
      .map(([timestamp, data]) => ({
        timestamp,
        value: data[key]
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Status Bar */}
      <div className="flex justify-end">
        <StatusIndicator isOnline={isOnline} lastSeen={lastSeen} />
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SensorCard
          type="temperature"
          value={currentData.temperature}
          unit="°C"
          historicalData={getHistoricalArray('temperature')}
        />
        
        <SensorCard
          type="humidity"
          value={currentData.humidity}
          unit="%"
          historicalData={getHistoricalArray('humidity')}
        />
        
        <SensorCard
          type="airpurity"
          value={currentData.airpurity}
          unit="%"
          historicalData={getHistoricalArray('airpurity')}
        />
      </div>

      {/* Last Update */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {new Date(currentData.timestamp).toLocaleString()}
      </div>
    </div>
  );
}