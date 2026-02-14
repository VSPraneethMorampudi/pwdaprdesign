import { useState, useEffect } from "react";
import { FileText, Pencil, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const statusLabels = {
  draft: "Draft",
  pending: "Pending Approval",
  approved: "Approved",
  in_progress: "In Progress",
  completed: "Completed",
  on_hold: "On Hold",
};

const PROJECT_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

function DetailRow({ label, value, editable, editValue, onEditChange }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-[#DFE1E6] last:border-0">
      <dt className="text-[11px] font-medium text-[#6B778C] uppercase tracking-wider shrink-0 min-w-[100px]">
        {label}
      </dt>
      <dd className="text-sm text-[#172B4D] font-medium text-right min-w-0 flex-1">
        {editable ? (
          <Input
            value={editValue ?? ""}
            onChange={(e) => onEditChange(e.target.value)}
            className="h-8 text-sm py-1"
          />
        ) : (
          value ?? "—"
        )}
      </dd>
    </div>
  );
}

export function ProjectDetails({ projects = [], onProjectUpdate, onProjectAdd }) {
  const [selectedId, setSelectedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (projects.length === 0) {
      setSelectedId(null);
      setIsEditing(false);
      setIsAdding(false);
    } else {
      setSelectedId((prev) => {
        const firstId = projects[0].id ?? String(0);
        if (!prev) return firstId;
        return projects.some((p) => String(p.id) === String(prev)) ? prev : firstId;
      });
    }
  }, [projects]);

  const selectedProject =
    projects.length === 1
      ? projects[0]
      : projects.find((p) => String(p.id) === String(selectedId)) || projects[0];

  const formatCost = (cost) => {
    if (!cost) return "₹ 0";
    return `₹ ${Number(cost).toLocaleString("en-IN")}`;
  };

  const projectType = [
    selectedProject?.stateProject && "State",
    selectedProject?.centralProject && "Central",
  ]
    .filter(Boolean)
    .join(" • ") || "—";

  const handleEdit = () => {
    setEditData({
      projectName: selectedProject?.projectName ?? "",
      projectCost: selectedProject?.projectCost ?? "",
      locationDetails: selectedProject?.locationDetails ?? "",
      sanctionYear: selectedProject?.sanctionYear ?? "",
      approvalYear: selectedProject?.approvalYear ?? "",
      projectStatus: selectedProject?.projectStatus ?? "",
      stateProject: selectedProject?.stateProject ?? false,
      centralProject: selectedProject?.centralProject ?? false,
      newProject: selectedProject?.projectType !== "extended",
      extendedProject: selectedProject?.projectType === "extended",
    });
    setIsEditing(true);
  };

  const handleAddProject = () => {
    setEditData({
      projectName: "",
      projectCost: "",
      locationDetails: "",
      sanctionYear: "",
      approvalYear: "",
      projectStatus: "draft",
      stateProject: false,
      centralProject: false,
      newProject: true,
      extendedProject: false,
    });
    setIsAdding(true);
  };

  const handleSaveAdd = () => {
    if (onProjectAdd) {
      const cost = editData.projectCost?.replace(/\D/g, "") || editData.projectCost;
      const projectType = editData.extendedProject ? "extended" : "new";
      onProjectAdd({
        id: Date.now().toString(),
        projectType,
        ...editData,
        projectCost: cost,
        stateProject: editData.stateProject,
        centralProject: editData.centralProject,
      });
    }
    setIsAdding(false);
    setEditData({});
  };

  const handleSave = () => {
    if (onProjectUpdate && selectedProject) {
      const cost = editData.projectCost?.replace(/\D/g, "") || editData.projectCost;
      const projectType = editData.extendedProject ? "extended" : "new";
      onProjectUpdate({
        ...selectedProject,
        ...editData,
        projectCost: cost,
        projectType,
      });
    }
    setIsEditing(false);
    setEditData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setEditData({});
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <div className="rounded-[3px] bg-white border border-[#DFE1E6] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="px-4 py-3 border-b border-[#DFE1E6] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#172B4D]">Project Details</h3>
          {projects.length > 1 && (
            <Select value={selectedId ?? ""} onValueChange={setSelectedId} disabled={isEditing}>
              <SelectTrigger className="mt-3 h-8 text-xs">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project, index) => (
                  <SelectItem key={project.id || index} value={project.id || String(index)}>
                    {project.projectName || "Untitled Project"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex gap-1">
          {isAdding ? (
            <>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveAdd}>
                <Check className="h-4 w-4 mr-1" strokeWidth={2} />
                Save
              </Button>
            </>
          ) : isEditing ? (
            <>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check className="h-4 w-4 mr-1" strokeWidth={2} />
                Save
              </Button>
            </>
          ) : projects.length > 0 ? (
            <Button size="sm" variant="outline" onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-1" strokeWidth={2} />
              Edit
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={handleAddProject}>
              <Pencil className="h-4 w-4 mr-1" strokeWidth={2} />
              Add Project
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 py-3">
        {projects.length === 0 && !isAdding ? (
          <div className="py-8 text-center">
            <FileText className="h-10 w-10 text-[#6B778C]/50 mx-auto mb-2" strokeWidth={2} />
            <p className="text-sm text-[#5E6C84]">No projects yet</p>
            <p className="text-xs text-[#6B778C] mt-1">
              Click &quot;Add Project&quot; above to add details directly here
            </p>
          </div>
        ) : (projects.length > 0 || isAdding) ? (
          <dl className="space-y-0">
            {(isEditing || isAdding) && (
              <div className="flex items-start justify-between gap-3 py-2.5 border-b border-[#DFE1E6]">
                <dt className="text-[11px] font-medium text-[#6B778C] uppercase tracking-wider shrink-0 min-w-[100px]">
                  Project Type
                </dt>
                <dd className="flex-1 min-w-0 flex gap-4 pt-2">
                  <label className="flex items-center gap-2 text-sm text-[#172B4D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.newProject}
                      onChange={(e) => setEditData((p) => ({ ...p, newProject: e.target.checked, extendedProject: e.target.checked ? false : p.extendedProject }))}
                      className="rounded-[3px] border-[#DFE1E6]"
                    />
                    New Project
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#172B4D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.extendedProject}
                      onChange={(e) => setEditData((p) => ({ ...p, extendedProject: e.target.checked, newProject: e.target.checked ? false : p.newProject }))}
                      className="rounded-[3px] border-[#DFE1E6]"
                    />
                    Extended Project
                  </label>
                </dd>
              </div>
            )}
            <DetailRow
              label="Project Name"
              value={selectedProject?.projectName}
              editable={isEditing || isAdding}
              editValue={editData.projectName}
              onEditChange={(v) => setEditData((p) => ({ ...p, projectName: v }))}
            />
            {(isEditing || isAdding) ? (
              <div className="flex items-start justify-between gap-3 py-2.5 border-b border-[#DFE1E6]">
                <dt className="text-[11px] font-medium text-[#6B778C] uppercase tracking-wider shrink-0 min-w-[100px]">
                  Status
                </dt>
                <dd className="flex-1 min-w-0">
                  <Select
                    value={editData.projectStatus}
                    onValueChange={(v) => setEditData((p) => ({ ...p, projectStatus: v }))}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </dd>
              </div>
            ) : (
              <DetailRow
                label="Status"
                value={statusLabels[selectedProject?.projectStatus] || selectedProject?.projectStatus || "—"}
              />
            )}
            <DetailRow
              label="Project Cost"
              value={formatCost(selectedProject?.projectCost)}
              editable={isEditing || isAdding}
              editValue={editData.projectCost}
              onEditChange={(v) => setEditData((p) => ({ ...p, projectCost: v.replace(/\D/g, "") }))}
            />
            <DetailRow
              label="Location"
              value={selectedProject?.locationDetails}
              editable={isEditing || isAdding}
              editValue={editData.locationDetails}
              onEditChange={(v) => setEditData((p) => ({ ...p, locationDetails: v }))}
            />
            {(isEditing || isAdding) ? (
              <div className="flex items-start justify-between gap-3 py-2.5 border-b border-[#DFE1E6]">
                <dt className="text-[11px] font-medium text-[#6B778C] uppercase tracking-wider shrink-0 min-w-[100px]">
                  Sanction Year
                </dt>
                <dd className="flex-1 min-w-0">
                  <Select
                    value={editData.sanctionYear}
                    onValueChange={(v) => setEditData((p) => ({ ...p, sanctionYear: v }))}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </dd>
              </div>
            ) : (
              <DetailRow label="Sanction Year" value={selectedProject?.sanctionYear} />
            )}
            {(isEditing || isAdding) ? (
              <div className="flex items-start justify-between gap-3 py-2.5 border-b border-[#DFE1E6]">
                <dt className="text-[11px] font-medium text-[#6B778C] uppercase tracking-wider shrink-0 min-w-[100px]">
                  Approval Year
                </dt>
                <dd className="flex-1 min-w-0">
                  <Select
                    value={editData.approvalYear}
                    onValueChange={(v) => setEditData((p) => ({ ...p, approvalYear: v }))}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </dd>
              </div>
            ) : (
              <DetailRow label="Approval Year" value={selectedProject?.approvalYear} />
            )}
            {(isEditing || isAdding) ? (
              <div className="flex items-start justify-between gap-3 py-2.5 border-b border-[#DFE1E6] last:border-0">
                <dt className="text-[11px] font-medium text-[#6B778C] uppercase tracking-wider shrink-0 min-w-[100px]">
                  Project Type
                </dt>
                <dd className="flex-1 min-w-0 flex gap-4 pt-2">
                  <label className="flex items-center gap-2 text-sm text-[#172B4D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.stateProject}
                      onChange={(e) => setEditData((p) => ({ ...p, stateProject: e.target.checked }))}
                      className="rounded-[3px] border-[#DFE1E6]"
                    />
                    State
                  </label>
                  <label className="flex items-center gap-2 text-sm text-[#172B4D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.centralProject}
                      onChange={(e) => setEditData((p) => ({ ...p, centralProject: e.target.checked }))}
                      className="rounded-[3px] border-[#DFE1E6]"
                    />
                    Central
                  </label>
                </dd>
              </div>
            ) : (
              <DetailRow label="Project Type" value={projectType} />
            )}
          </dl>
        ) : null}
      </div>
    </div>
  );
}
