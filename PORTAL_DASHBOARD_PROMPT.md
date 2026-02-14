# Portal Dashboard Design - Implementation Prompt

Use this prompt to implement the same portal dashboard design in another project.

---

## Quick Copy Prompt (paste into AI/chat)

```
Implement a Portal Dashboard view with this design:

DESIGN: Jira-like - professional, 3px radius, high contrast (dark sidebar #0F172A vs light content #FFFFFF). Colors: primary #0052CC, borders #DFE1E6, text #172B4D/#5E6C84. Font: Inter, 14px body, 11px uppercase labels.

LAYOUT: Left sidebar (collapsible, dark), main content (white), right context panel (#F4F5F7). Top header with title + Export button. Content grid: 2/3 main + 1/3 context panel.

COMPONENTS: Map Legend (layer colors), Project Details card (inline Edit/Save, no icons on fields), Uploaded Files panel (resizable, drag-drop upload, vertical reorder).

STACK: React, Tailwind, Lucide icons, react-resizable-panels, @dnd-kit for sortable list.
```

---

## Full Specification

Implement a **Portal Dashboard** with the following design system and layout. Use React, Tailwind CSS, and Lucide React icons.

---

### 1. Design System (Jira-Like)

**Core Philosophy:**
- Professional, functional, high information density
- Crisp & square: 3px border-radius everywhere
- High contrast: dark navigation vs light content areas

**Color Palette:**
- System Sidebar (left): `#0F172A` (Slate 900)
- Context Panel (right): `#F4F5F7`
- Main Canvas: `#FFFFFF`
- Borders: `#DFE1E6`
- Primary Text: `#172B4D`
- Secondary Text: `#5E6C84` or `#6B778C`
- Primary Brand: `#0052CC` (Jira Blue)
- Primary Hover: `#0065FF`
- Danger: `#DE350B`
- Success: `#36B37E`
- Input Background: `#FAFBFC`
- Focus Ring: `#4C9AFF`

**Typography:**
- Font: Inter, system-ui, sans-serif
- Body: 14px
- Labels/Micro: 11px, uppercase, wide tracking
- Headings: 14-16px, semibold

**Components:**
- Buttons: Primary `bg-[#0052CC]`, hover `bg-[#0065FF]`, `rounded-[3px]`
- Cards: White bg, `border-[#DFE1E6]`, `rounded-[3px]`, `shadow-sm`, `hover:shadow-md`
- Inputs: `bg-[#FAFBFC]`, `border-[#DFE1E6]`, focus `border-[#4C9AFF] ring-1 ring-[#4C9AFF]`
- Modals: Backdrop `bg-[#091E42]/50 backdrop-blur-sm`, container `rounded-[3px] shadow-2xl`
- Icons: Lucide React, stroke width 2px, color `#5E6C84` or `#42526E`

---

### 2. Layout Structure

**Overall:** Full-height flex layout with 3 zones: left sidebar, main content, optional right context panel.

**Left Sidebar (System Navigation):**
- Background `#0F172A`, width ~224px expanded / ~64px collapsed
- Collapsible with chevron toggle at bottom
- Logo at top, nav items with icons + labels
- Active state: `#4C9AFF` accent
- Bottom: Search, Settings, collapse toggle
- Text color: `#B6C2CF`, active `#4C9AFF`

**Top Header:**
- Height 56px, border-bottom `#DFE1E6`
- Left: App title + subtitle (11px uppercase)
- Right: Primary action button (e.g. Export Report)

**Main Content:**
- White background, scrollable (`overflow-auto`)
- Padding 24px (`p-6`)

**Content Grid:**
- 2/3 for main area (map, charts, etc.)
- 1/3 for right context panel: `bg-[#F4F5F7]`, `border-l border-[#DFE1E6]`, `p-4`
- Responsive: stack on small screens

---

### 3. Component Hierarchy

```
App
  Left Sidebar (dark #0F172A)
    - Logo
    - Nav: Portal, Form, Map Details, File Upload, Report
    - Search, Settings
    - Collapse toggle
  Main
    Header (title + Export button)
    Content
      Primary area (2/3) - Map or main content
      Context panel (1/3)
        - Map Legend (compact, layer colors + names)
        - Project Details card (fields, Edit/Save)
      Bottom section
        - Uploaded Files panel (resizable, drag-and-drop)
```

---

### 4. Key Components to Implement

**Map Legend:** Small card above project details. Layer name + color swatch per row. Header "Map Legend" 11px uppercase.

**Project Details Card:** One project at a time. Fields: Project Name, Status, Project Cost, Location, Sanction Year, Approval Year, Project Type. Label left, value right. Edit/Save buttons in header. Inline editing with inputs/selects/checkboxes. No icons on field labels.

**Uploaded Files Panel:** Two resizable panels (react-resizable-panels). Left: file list with drag handle for reorder. Right: file details (type, size, date, Open/Download). Drag-and-drop from file system to upload. Upload button in header. Accept Excel, PDF, images.

---

### 5. Technical Stack

- React 18+, Tailwind CSS, Lucide React
- react-resizable-panels for resizable layout
- @dnd-kit/core + @dnd-kit/sortable for drag-and-drop reorder
- Radix UI (or similar) for Select, Dialog, etc.

---

### 6. Responsive

- Sidebar collapses to icon-only on small screens
- Content grid: `grid-cols-1 lg:grid-cols-3`
- Context panel stacks below main on mobile
