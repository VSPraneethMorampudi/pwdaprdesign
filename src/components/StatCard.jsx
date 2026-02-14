import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({ title, value, change, trend, icon: Icon }) {
  return (
    <div className="rounded-lg bg-card border border-border p-4 shadow-card hover:shadow-md hover:glow-primary transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-semibold font-mono text-card-foreground">{value}</div>
      <div className="flex items-center mt-1 text-xs">
        {trend === "up" && <TrendingUp className="h-3 w-3 mr-1 text-success" />}
        {trend === "down" && <TrendingDown className="h-3 w-3 mr-1 text-destructive" />}
        {trend === "neutral" && <Minus className="h-3 w-3 mr-1 text-muted-foreground" />}
        <span
          className={cn(
            trend === "up" && "text-success",
            trend === "down" && "text-destructive",
            trend === "neutral" && "text-muted-foreground"
          )}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
