import { useState } from "react";
import { GisSidebar } from "@/components/GisSidebar";
import { ProjectFormModal } from "@/components/ProjectFormModal";
import { ProjectDetails } from "@/components/ProjectDetails";
import { MapLegend } from "@/components/MapLegend";
import { MapView } from "@/components/MapView";
import { UploadedFilesPanel } from "@/components/UploadedFilesPanel";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("portal");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  return (
    <div className="flex h-screen overflow-hidden">
      <GisSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem={activeNav}
        onItemClick={setActiveNav}
        onFormClick={() => {
          setActiveNav("form");
          setFormModalOpen(true);
        }}
      />
      <ProjectFormModal
        open={formModalOpen}
        onOpenChange={(open) => {
          setFormModalOpen(open);
          if (!open) setActiveNav("portal");
        }}
        onSubmit={(project) => setProjects((prev) => [project, ...prev])}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top bar */}
        <header className="h-14 border-b border-[#DFE1E6] bg-white shadow-sm flex items-center justify-between px-6 shrink-0">
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-[#172B4D] tracking-tight">PWD Chattisgarh</h1>
            <p className="text-[11px] text-[#6B778C] uppercase tracking-wider font-medium">Annual Plan Portal</p>
          </div>
          <Button size="sm">
            <FileDown className="h-4 w-4" strokeWidth={2} />
            Export Report
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6 bg-white">
          {/* Map + side panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 min-h-[400px]">
              <MapView />
            </div>
            <div className="space-y-4 flex flex-col bg-[#F4F5F7] border-l border-[#DFE1E6] p-4 min-h-[400px]">
              <MapLegend />
              <ProjectDetails
                projects={projects}
                onProjectUpdate={(updated) =>
                  setProjects((prev) =>
                    prev.map((p) => (p.id === updated.id ? updated : p))
                  )
                }
                onProjectAdd={(project) => setProjects((prev) => [project, ...prev])}
              />
            </div>
          </div>

          {/* Uploaded Files */}
          <UploadedFilesPanel />
        </div>
      </main>
    </div>
  );
};

export default Index;
