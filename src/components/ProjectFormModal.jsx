import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilePlus, RefreshCw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const PROJECT_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

export function ProjectFormModal({ open, onOpenChange, onSubmit }) {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState(null);
  const [stateProject, setStateProject] = useState(false);
  const [centralProject, setCentralProject] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    projectCost: "",
    locationDetails: "",
    sanctionYear: "",
    approvalYear: "",
    projectStatus: "",
  });

  const handleClose = () => {
    setStep(1);
    setProjectType(null);
    setStateProject(false);
    setCentralProject(false);
    setFormData({
      projectName: "",
      projectCost: "",
      locationDetails: "",
      sanctionYear: "",
      approvalYear: "",
      projectStatus: "",
    });
    onOpenChange(false);
  };

  const handleProjectTypeSelect = (type) => {
    setProjectType(type);
    setStep(2);
  };

  const handleProjectCategoryNext = () => {
    if (stateProject || centralProject) {
      setStep(3);
    }
  };

  const handleCostChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, projectCost: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = {
      id: Date.now().toString(),
      projectType,
      stateProject,
      centralProject,
      ...formData,
    };
    onSubmit?.(projectData);
    handleClose();
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Add New Project"}
            {step === 2 && "Select Project Category"}
            {step === 3 && "Project Details"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              type="button"
              onClick={() => handleProjectTypeSelect("new")}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-[3px] border border-[#DFE1E6] bg-white hover:border-[#0052CC] hover:shadow-md transition-all"
              )}
            >
              <FilePlus className="h-10 w-10 text-[#0052CC] mb-3" strokeWidth={2} />
              <span className="font-semibold text-[#172B4D]">New Project</span>
              <span className="text-xs text-[#5E6C84] mt-1">Create a new project</span>
            </button>
            <button
              type="button"
              onClick={() => handleProjectTypeSelect("extended")}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-[3px] border border-[#DFE1E6] bg-white hover:border-[#0052CC] hover:shadow-md transition-all"
              )}
            >
              <RefreshCw className="h-10 w-10 text-[#0052CC] mb-3" strokeWidth={2} />
              <span className="font-semibold text-[#172B4D]">Extended Project</span>
              <span className="text-xs text-[#5E6C84] mt-1">Extend existing project</span>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 py-4">
            <p className="text-sm text-[#5E6C84]">
              Select project category (you can select both):
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="state"
                  checked={stateProject}
                  onCheckedChange={(checked) => setStateProject(!!checked)}
                />
                <Label htmlFor="state" className="font-normal cursor-pointer">
                  State Project
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="central"
                  checked={centralProject}
                  onCheckedChange={(checked) => setCentralProject(!!checked)}
                />
                <Label htmlFor="central" className="font-normal cursor-pointer">
                  Central Project
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleProjectCategoryNext} disabled={!stateProject && !centralProject}>
                Continue
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 3 && projectType === "new" && (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={formData.projectName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, projectName: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectCost">Project Cost (₹)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5E6C84]">₹</span>
                <Input
                  id="projectCost"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter amount (numbers only)"
                  className="pl-8"
                  value={formData.projectCost}
                  onChange={handleCostChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="locationDetails">Location Name or Details</Label>
              <Input
                id="locationDetails"
                placeholder="Enter location details"
                value={formData.locationDetails}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, locationDetails: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sanctionYear">Project Sanction Year</Label>
              <Select
                value={formData.sanctionYear}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, sanctionYear: value }))
                }
                required
              >
                <SelectTrigger>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="approvalYear">Project Approval Year</Label>
              <Select
                value={formData.approvalYear}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, approvalYear: value }))
                }
                required
              >
                <SelectTrigger>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectStatus">Project Status</Label>
              <Select
                value={formData.projectStatus}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, projectStatus: value }))
                }
                required
              >
                <SelectTrigger>
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
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        )}

        {step === 3 && projectType === "extended" && (
          <div className="py-8 text-center text-[#5E6C84]">
            <p>Extended project form - Coming soon</p>
            <p className="text-sm mt-2">State: {stateProject ? "Yes" : "No"} | Central: {centralProject ? "Yes" : "No"}</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
