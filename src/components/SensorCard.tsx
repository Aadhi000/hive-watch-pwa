import { useState } from 'react';
import { Thermometer, Droplets, Wind, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@/hooks/useTheme';
import { getChartOptions, getChartData } from '@/lib/chartConfig';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SensorCardProps {
  type: 'temperature' | 'humidity' | 'airpurity';
  value: number;
  unit: string;
  historicalData: { timestamp: string; value: number }[];
}

const sensorConfig = {
  temperature: {
    icon: Thermometer,
    color: 'temp',
    chartColor: '#fbbf24',
    label: 'Temperature',
    normalRange: { min: 18, max: 30 }
  },
  humidity: {
    icon: Droplets,
    color: 'humidity',
    chartColor: '#06b6d4',
    label: 'Humidity',
    normalRange: { min: 60, max: 100 }
  },
  airpurity: {
    icon: Wind,
    color: 'air',
    chartColor: '#10b981',
    label: 'Air Quality',
    normalRange: { min: 60, max: 100 }
  }
};

type TimeRange = 'live' | '24h' | '7d' | '15d' | '30d';

export function SensorCard({ type, value, unit, historicalData }: SensorCardProps) {
  const [showChart, setShowChart] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const config = sensorConfig[type];
  const Icon = config.icon;
  
  const isAbnormal = value < config.normalRange.min || 
    (config.normalRange.max < 100 && value > config.normalRange.max);
  
  const trend = historicalData.length > 1 
    ? value - historicalData[historicalData.length - 2]?.value 
    : 0;

  const filterDataByRange = () => {
    const now = new Date();
    let filteredData = [...historicalData];
    
    switch (timeRange) {
      case 'live':
        filteredData = historicalData.slice(-20);
        break;
      case '24h':
        filteredData = historicalData.filter(d => {
          const date = new Date(d.timestamp);
          return now.getTime() - date.getTime() <= 24 * 60 * 60 * 1000;
        });
        break;
      case '7d':
        filteredData = historicalData.filter(d => {
          const date = new Date(d.timestamp);
          return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000;
        });
        break;
      case '15d':
        filteredData = historicalData.filter(d => {
          const date = new Date(d.timestamp);
          return now.getTime() - date.getTime() <= 15 * 24 * 60 * 60 * 1000;
        });
        break;
      case '30d':
        filteredData = historicalData.filter(d => {
          const date = new Date(d.timestamp);
          return now.getTime() - date.getTime() <= 30 * 24 * 60 * 60 * 1000;
        });
        break;
    }
    
    return filteredData;
  };

  const chartData = filterDataByRange();
  const labels = chartData.map(d => {
    const date = new Date(d.timestamp);
    return timeRange === 'live' || timeRange === '24h' 
      ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const values = chartData.map(d => d.value);

  return (
    <div className="space-y-4">
      <div
        onClick={() => setShowChart(!showChart)}
        className={cn(
          "relative p-6 rounded-2xl cursor-pointer transition-all duration-300",
          "shadow-neumorphic hover:shadow-neumorphic-inset",
          "bg-card border-2",
          isAbnormal ? "border-danger animate-pulse-danger" : "border-transparent",
          "group"
        )}
      >
        {isAbnormal && (
          <div className="absolute -top-2 -right-2 bg-danger text-destructive-foreground px-2 py-1 rounded-full text-xs font-bold animate-bounce">
            ALERT
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl",
            `bg-${config.color}/10`,
            "group-hover:scale-110 transition-transform"
          )}>
            <Icon className={cn("w-6 h-6", `text-${config.color}`)} />
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : trend < 0 ? (
              <TrendingDown className="w-4 h-4 text-danger" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            <span>{Math.abs(trend).toFixed(1)}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{config.label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">
              {value.toFixed(1)}
            </span>
            <span className="text-lg text-muted-foreground">{unit}</span>
          </div>
          
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500",
                isAbnormal ? "bg-gradient-danger" : `bg-${config.color}`
              )}
              style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
          </div>
        </div>
      </div>
      
      {showChart && (
        <div className="p-6 rounded-2xl shadow-neumorphic bg-card animate-fade-in">
          <div className="flex gap-2 mb-4 flex-wrap">
            {(['live', '24h', '7d', '15d', '30d'] as TimeRange[]).map(range => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="uppercase"
              >
                {range}
              </Button>
            ))}
          </div>
          
          <div className="h-64">
            <Line 
              data={getChartData(labels, values, config.chartColor, isDark)}
              options={getChartOptions(`${config.label} History`, isDark)}
            />
          </div>
        </div>
      )}
    </div>
  );
}