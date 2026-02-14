import { cn } from "@/lib/utils";

const activities = [
  { id: "1", action: "Layer Added", detail: "Water Bodies polygon layer imported", time: "2 min ago", type: "create" },
  { id: "2", action: "Analysis Complete", detail: "Spatial query on land parcels", time: "15 min ago", type: "analysis" },
  { id: "3", action: "Data Updated", detail: "Road network dataset refreshed", time: "1 hr ago", type: "update" },
  { id: "4", action: "Feature Deleted", detail: "Removed 3 duplicate points", time: "2 hr ago", type: "delete" },
  { id: "5", action: "Export Complete", detail: "Shapefile exported (24.3 MB)", time: "3 hr ago", type: "create" },
];

const dotColors = {
  create: "bg-[#36B37E]",
  update: "bg-[#0052CC]",
  delete: "bg-[#DE350B]",
  analysis: "bg-amber-500",
};

export function ActivityFeed() {
  return (
    <div className="rounded-[3px] bg-white border border-[#DFE1E6] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="px-4 py-3 border-b border-[#DFE1E6]">
        <h3 className="text-sm font-semibold text-[#172B4D]">Recent Activity</h3>
      </div>
      <div className="divide-y divide-[#DFE1E6]">
        {activities.map((a) => (
          <div key={a.id} className="px-4 py-3 flex items-start gap-3">
            <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", dotColors[a.type])} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#172B4D]">{a.action}</p>
              <p className="text-xs text-[#5E6C84] truncate">{a.detail}</p>
            </div>
            <span className="text-[10px] text-[#6B778C] whitespace-nowrap">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
