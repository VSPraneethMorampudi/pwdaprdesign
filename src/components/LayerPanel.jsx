import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const initialLayers = [
  { id: "1", name: "Land Parcels", type: "polygon", color: "hsl(174, 72%, 46%)", visible: true },
  { id: "2", name: "Road Network", type: "line", color: "hsl(38, 92%, 50%)", visible: true },
  { id: "3", name: "Points of Interest", type: "point", color: "hsl(142, 71%, 45%)", visible: true },
  { id: "4", name: "Elevation Data", type: "raster", color: "hsl(199, 89%, 48%)", visible: false },
  { id: "5", name: "Water Bodies", type: "polygon", color: "hsl(210, 80%, 55%)", visible: true },
  { id: "6", name: "Buildings", type: "polygon", color: "hsl(0, 72%, 55%)", visible: false },
];

const typeLabels = {
  polygon: "Polygon",
  point: "Point",
  line: "Line",
  raster: "Raster",
};

export function LayerPanel() {
  const [layers, setLayers] = useState(initialLayers);

  const toggleLayer = (id) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  return (
    <div className="rounded-[3px] bg-white border border-[#DFE1E6] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="px-4 py-3 border-b border-[#DFE1E6]">
        <h3 className="text-sm font-semibold text-[#172B4D]">Active Layers</h3>
        <p className="text-[11px] text-[#6B778C] uppercase tracking-wider mt-0.5">
          {layers.filter((l) => l.visible).length} of {layers.length} visible
        </p>
      </div>
      <div className="divide-y divide-[#DFE1E6]">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={cn(
              "flex items-center px-4 py-2.5 transition-colors",
              layer.visible ? "bg-white" : "bg-[#F4F5F7]"
            )}
          >
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0 mr-3"
              style={{ backgroundColor: layer.color, opacity: layer.visible ? 1 : 0.3 }}
            />
            <div className="flex-1 min-w-0">
              <span
                className={cn(
                  "text-sm truncate block",
                  layer.visible ? "text-[#172B4D]" : "text-[#5E6C84]"
                )}
              >
                {layer.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#6B778C]">
                {typeLabels[layer.type]}
              </span>
            </div>
            <button
              onClick={() => toggleLayer(layer.id)}
              className="text-[#5E6C84] hover:text-[#172B4D] transition-colors p-1"
            >
              {layer.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
