# Jira-Like Design System

## Core Philosophy
- **Professional & Functional**: High information density, clean lines, distinct hierarchy.
- **Crisp & Square**: Use small border-radius (3px) for a technical, precise feel.
- **High Contrast**: Dark navigation vs. Light content areas.

## Color Palette

### Structure
- **System Sidebar (Leftmost)**: `#0F172A` (Slate 900)
- **Context Panel (Secondary Sidebar)**: `#F4F5F7` (Light Gray/Blueish)
- **Main Canvas**: `#FFFFFF`
- **Borders**: `#DFE1E6`

### Text
- **Primary**: `#172B4D` (Dark Blue/Gray)
- **Secondary**: `#5E6C84` or `#6B778C`
- **Headings (Small)**: `#6B778C` (Uppercase, Tracking Wide, Font Size 11px)

### Actions
- **Primary Brand**: `#0052CC` (Jira Blue)
- **Hover**: `#0065FF`
- **Danger**: `#DE350B`
- **Success**: `#36B37E`

## Typography
- **Font**: Inter, system-ui, sans-serif.
- **Sizes**:
  - Body: 14px (`text-sm`)
  - Label/Micro: 11px or 12px (`text-xs` or `text-[11px]`)
  - Headings: 14px-16px, often semibold.

## Components

### Buttons
- **Primary**: `bg-[#0052CC] text-white rounded-[3px] px-3 py-2 font-medium hover:bg-[#0065FF] transition-colors`
- **Secondary/Ghost**: `text-[#42526E] hover:bg-[#EBECF0] rounded-[3px] transition-colors`

### Cards (Layers/Items)
- Background: `#FFFFFF`
- Border: `1px solid #DFE1E6`
- Radius: `3px`
- Shadow: `shadow-sm`
- Hover: `hover:shadow-md transition-shadow`

### Modals
- Backdrop: `bg-[#091E42]/50 backdrop-blur-sm`
- Container: `bg-white rounded-[3px] shadow-2xl`
- Header: `border-b border-[#DFE1E6] px-6 py-4`
- Footer: `border-t border-[#DFE1E6] px-6 py-4 bg-white`

### Inputs
- Background: `#FAFBFC` (Very light gray)
- Border: `1px solid #DFE1E6`
- Focus: `bg-white border-[#4C9AFF] ring-1 ring-[#4C9AFF]`
- Radius: `3px`

## Iconography
- Library: Lucide React
- Style: Stroke width 2px.
- Color: Usually `#42526E` or `#5E6C84`.
