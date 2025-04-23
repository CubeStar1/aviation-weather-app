import {
  ArrowRight,
  PlaneTakeoff,
  PlaneLanding
} from "lucide-react"

interface FlightRouteHeaderProps {
  routeString: string;
}

export function FlightRouteHeader({ routeString }: FlightRouteHeaderProps) {
  const renderRoute = (routeStr: string) => {
    const parts = routeStr.split(" → ");
    return parts.map((part, index) => (
      <div key={index} className="flex items-center group">
        {index === 0 && <PlaneTakeoff className="h-5 w-5 mr-2 opacity-80 group-hover:opacity-100 transition-opacity" />}
        <span className="font-semibold text-base px-1.5 py-0.5 rounded bg-white/30 dark:bg-black/20 group-hover:bg-white/50 dark:group-hover:bg-black/30 transition-colors scale-100 group-hover:scale-105 transform duration-150 ease-in-out">
          {part}
        </span>
        {index < parts.length - 1 && (
          <ArrowRight className="h-5 w-5 text-sky-700/70 dark:text-sky-300/70 mx-1 group-hover:text-sky-600 dark:group-hover:text-sky-200 transition-colors scale-100 group-hover:scale-110 transform duration-150 ease-in-out" />
        )}
        {index === parts.length - 1 && <PlaneLanding className="h-5 w-5 ml-2 opacity-80 group-hover:opacity-100 transition-opacity" />}
      </div>
    ));
  };

  return (
    <div className="bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 p-4 rounded-lg shadow-sm border border-sky-200/50 dark:border-sky-800/50 mb-6">
      <div className="flex items-center gap-2 flex-wrap text-sky-900 dark:text-sky-200">
        <span className="font-medium text-sm mr-1">Flight Route:</span>
        {renderRoute(routeString)}
      </div>
    </div>
  );
} 