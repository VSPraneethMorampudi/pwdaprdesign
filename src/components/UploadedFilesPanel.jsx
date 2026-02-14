import { useState, useRef, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FileSpreadsheet,
  FileText,
  FileImage,
  File,
  Upload,
  X,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FILE_ICONS = {
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  csv: FileSpreadsheet,
  pdf: FileText,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  default: File,
};

const getFileIcon = (filename) => {
  const ext = filename?.split(".").pop()?.toLowerCase();
  return FILE_ICONS[ext] || FILE_ICONS.default;
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return "Today, " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  if (diff < 172800000) return "Yesterday, " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const initialFiles = [
  { id: "1", name: "Annual_Plan_2024.xlsx", size: "2.4 MB", date: "Today, 10:32 AM", type: "excel" },
  { id: "2", name: "Project_Report_Q1.pdf", size: "1.1 MB", date: "Yesterday, 3:45 PM", type: "pdf" },
  { id: "3", name: "Budget_Summary.csv", size: "156 KB", date: "Feb 12, 2025", type: "excel" },
  { id: "4", name: "Site_Map_Overview.png", size: "890 KB", date: "Feb 11, 2025", type: "image" },
];

function SortableFileItem({ file, isSelected, onSelect, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = getFileIcon(file.name);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 border-b border-[#DFE1E6] last:border-b-0",
        isDragging && "opacity-50 bg-white shadow-md z-10"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-2 -ml-1 rounded-[3px] text-[#6B778C] hover:bg-[#EBECF0] hover:text-[#172B4D] cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" strokeWidth={2} />
      </button>
      <button
        onClick={() => onSelect(file)}
        className={cn(
          "flex-1 flex items-center gap-3 px-2 py-3 text-left transition-colors group min-w-0",
          isSelected ? "bg-[#EBECF0]" : "hover:bg-[#F4F5F7]"
        )}
      >
        <Icon className="h-5 w-5 text-[#0052CC] shrink-0" strokeWidth={2} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#172B4D] truncate">{file.name}</p>
          <p className="text-[11px] text-[#6B778C]">{file.size} · {file.date}</p>
        </div>
        <button
          onClick={(e) => onRemove(e, file.id)}
          className="p-1 rounded-[3px] text-[#5E6C84] opacity-0 group-hover:opacity-100 hover:bg-[#DE350B]/10 hover:text-[#DE350B] transition-all shrink-0"
          aria-label="Remove file"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </button>
    </div>
  );
}

export function UploadedFilesPanel() {
  const [files, setFiles] = useState(initialFiles);
  const [selectedFile, setSelectedFile] = useState(initialFiles[0]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewText, setPreviewText] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const addFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: formatFileSize(file.size),
      date: formatDate(file.lastModified || Date.now()),
      type: file.name.split(".").pop()?.toLowerCase() || "file",
      rawFile: file,
    }));
    setFiles((prev) => [...newFiles, ...prev]);
    if (newFiles.length > 0) setSelectedFile(newFiles[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const droppedFiles = e.dataTransfer?.files;
    if (droppedFiles?.length) addFiles(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDraggingOver(false);
  };

  const handleOpenFile = async () => {
    if (!selectedFile) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewText(null);
    setPreviewType(null);

    const ext = selectedFile.name?.split(".").pop()?.toLowerCase();

    if (selectedFile.rawFile) {
      const file = selectedFile.rawFile;
      if (["png", "jpg", "jpeg"].includes(ext)) {
        setPreviewUrl(URL.createObjectURL(file));
        setPreviewType("image");
      } else if (ext === "pdf") {
        setPreviewUrl(URL.createObjectURL(file));
        setPreviewType("pdf");
      } else if (ext === "csv") {
        const text = await file.text();
        setPreviewText(text);
        setPreviewType("text");
      } else {
        setPreviewType("unsupported");
      }
    } else {
      setPreviewType("unavailable");
    }
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setPreviewText(null);
    setPreviewType(null);
  };

  const handleRemoveFile = (e, id) => {
    e.stopPropagation();
    const nextFiles = files.filter((f) => f.id !== id);
    setFiles(nextFiles);
    if (selectedFile?.id === id) {
      setSelectedFile(nextFiles[0] || null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="rounded-[3px] bg-white border border-[#DFE1E6] overflow-hidden shadow-sm hover:shadow-md transition-shadow min-h-[280px]">
      <div className="px-4 py-3 border-b border-[#DFE1E6] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#172B4D]">Uploaded Files & Reports</h3>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".xlsx,.xls,.csv,.pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" strokeWidth={2} />
            Upload
          </Button>
        </div>
      </div>

      <PanelGroup direction="horizontal" autoSaveId="uploaded-files-panel" className="min-h-[240px]">
        {/* File list panel */}
        <Panel defaultSize={35} minSize={25} maxSize={50} className="overflow-hidden">
          <div
            className={cn(
              "h-full overflow-y-auto border-r border-[#DFE1E6] transition-colors relative",
              isDraggingOver && "bg-[#0052CC]/5 border-[#0052CC]/30"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isDraggingOver && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 border-2 border-dashed border-[#0052CC] rounded-[3px] m-2 pointer-events-none">
                <p className="text-sm font-medium text-[#0052CC]">Drop files here</p>
              </div>
            )}
            {files.length === 0 ? (
              <div className="p-6 text-center">
                <FileSpreadsheet className="h-12 w-12 text-[#6B778C]/40 mx-auto mb-3" strokeWidth={2} />
                <p className="text-sm text-[#5E6C84]">No files uploaded</p>
                <p className="text-xs text-[#6B778C] mt-1">Drag and drop files here or click to upload</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" strokeWidth={2} />
                  Upload File
                </Button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={files.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="divide-y-0">
                    {files.map((file) => (
                      <SortableFileItem
                        key={file.id}
                        file={file}
                        isSelected={selectedFile?.id === file.id}
                        onSelect={setSelectedFile}
                        onRemove={handleRemoveFile}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-[#DFE1E6] hover:bg-[#0052CC]/30 transition-colors data-[resize-handle-active]:bg-[#0052CC] flex items-center justify-center">
          <GripVertical className="h-4 w-4 text-[#6B778C]" strokeWidth={2} />
        </PanelResizeHandle>

        {/* File details panel */}
        <Panel defaultSize={65} minSize={40} className="overflow-hidden">
          <div className="h-full overflow-y-auto p-4 bg-[#FAFBFC]">
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  {(() => {
                    const Icon = getFileIcon(selectedFile.name);
                    return <Icon className="h-10 w-10 text-[#0052CC] shrink-0" strokeWidth={2} />;
                  })()}
                  <div>
                    <h4 className="text-sm font-semibold text-[#172B4D]">{selectedFile.name}</h4>
                    <p className="text-xs text-[#6B778C] mt-0.5">
                      {selectedFile.size} · Uploaded {selectedFile.date}
                    </p>
                  </div>
                </div>
                <div className="rounded-[3px] border border-[#DFE1E6] bg-white p-4">
                  <p className="text-[11px] text-[#6B778C] uppercase tracking-wider font-medium mb-2">File details</p>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-[#5E6C84]">Type</dt>
                      <dd className="text-[#172B4D] font-medium">
                        {selectedFile.name?.split(".").pop()?.toUpperCase() || "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#5E6C84]">Size</dt>
                      <dd className="text-[#172B4D] font-medium">{selectedFile.size}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[#5E6C84]">Last modified</dt>
                      <dd className="text-[#172B4D] font-medium">{selectedFile.date}</dd>
                    </div>
                  </dl>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleOpenFile}>
                    Open
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedFile?.rawFile) {
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(selectedFile.rawFile);
                        a.download = selectedFile.name;
                        a.click();
                        URL.revokeObjectURL(a.href);
                      }
                    }}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <File className="h-12 w-12 text-[#6B778C]/40 mb-3" strokeWidth={2} />
                <p className="text-sm text-[#5E6C84]">Select a file to view details</p>
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>

      <Dialog open={previewOpen} onOpenChange={(open) => !open && handleClosePreview()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto min-h-0 -mx-6 px-6">
            {previewType === "image" && previewUrl && (
              <img
                src={previewUrl}
                alt={selectedFile?.name}
                className="max-w-full h-auto rounded-[3px] border border-[#DFE1E6]"
              />
            )}
            {previewType === "pdf" && previewUrl && (
              <iframe
                src={previewUrl}
                title={selectedFile?.name}
                className="w-full h-[70vh] rounded-[3px] border border-[#DFE1E6]"
              />
            )}
            {previewType === "text" && previewText && (
              <pre className="p-4 bg-[#FAFBFC] rounded-[3px] border border-[#DFE1E6] text-sm text-[#172B4D] overflow-auto max-h-[70vh] whitespace-pre-wrap font-mono">
                {previewText}
              </pre>
            )}
            {previewType === "unsupported" && (
              <div className="py-12 text-center text-[#5E6C84]">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 opacity-50" strokeWidth={2} />
                <p className="text-sm font-medium">Preview not available for this file type</p>
                <p className="text-xs mt-1">Use the Download button to save the file</p>
              </div>
            )}
            {previewType === "unavailable" && (
              <div className="py-12 text-center text-[#5E6C84]">
                <File className="h-12 w-12 mx-auto mb-3 opacity-50" strokeWidth={2} />
                <p className="text-sm font-medium">Preview not available</p>
                <p className="text-xs mt-1">Upload the file again to view or download it</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
