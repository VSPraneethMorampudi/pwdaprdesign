const MAP_LEGEND_ITEMS = [
  { id: "1", name: "Land Parcels", color: "#2DD4BF", type: "polygon" },
  { id: "2", name: "Road Network", color: "#F59E0B", type: "line" },
  { id: "3", name: "Points of Interest", color: "#36B37E", type: "point" },
  { id: "4", name: "Water Bodies", color: "#60A5FA", type: "polygon" },
];

export function MapLegend() {
  return (
    <div className="rounded-[3px] bg-white border border-[#DFE1E6] overflow-hidden shadow-sm">
      <div className="px-3 py-2 border-b border-[#DFE1E6]">
        <h3 className="text-[11px] font-semibold text-[#6B778C] uppercase tracking-wider">Map Legend</h3>
      </div>
      <div className="p-3 space-y-2">
        {MAP_LEGEND_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div
              className="w-3 h-3 shrink-0 rounded-[2px]"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-[#172B4D]">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
