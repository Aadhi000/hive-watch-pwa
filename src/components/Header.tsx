import { Moon, Sun, Bell, BellOff, Hexagon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { notificationsEnabled, toggleNotifications } = useNotifications();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-honey shadow-glow">
              <Hexagon className="w-8 h-8 text-primary-foreground fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Beehive Monitor
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time Sensor Monitoring
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotifications}
              className={cn(
                "relative",
                notificationsEnabled && "text-honey"
              )}
            >
              {notificationsEnabled ? (
                <Bell className="w-5 h-5" />
              ) : (
                <BellOff className="w-5 h-5" />
              )}
              {notificationsEnabled && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-success rounded-full animate-pulse" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}