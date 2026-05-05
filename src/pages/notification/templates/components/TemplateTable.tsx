// src/pages/notifications/templates/components/TemplateTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2 } from "lucide-react";
import { NotificationTemplateResponseDto } from "@/api/core/notification";
import { formatDate } from "@/utils/formatters";


interface TemplateTableProps {
  templates: NotificationTemplateResponseDto[];
  selectedTemplates: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: keyof NotificationTemplateResponseDto) => void;
  sortConfig: { key: keyof NotificationTemplateResponseDto; direction: "asc" | "desc" };
  onView: (template: NotificationTemplateResponseDto) => void;
  onEdit: (template: NotificationTemplateResponseDto) => void;
  onDelete: (id: number) => void;
}

const TemplateTable: React.FC<TemplateTableProps> = ({
  templates,
  selectedTemplates,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onDelete,
}) => {
  const getSortIcon = (key: keyof NotificationTemplateResponseDto) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <ChevronUp className="icon-sm" /> : <ChevronDown className="icon-sm" />;
  };

  return (
    <div className="overflow-x-auto rounded-md border compact-table" style={{ borderColor: "var(--border-color)" }}>
      <table className="min-w-full">
        <thead style={{ backgroundColor: "var(--card-secondary-bg)" }}>
          <tr>
            <th className="w-10 px-2 py-2"><input type="checkbox" checked={templates.length > 0 && selectedTemplates.length === templates.length} onChange={onToggleSelectAll} className="h-3 w-3 rounded" /></th>
            <th onClick={() => onSort("name")} className="px-4 py-2 text-left text-xs font-medium cursor-pointer">Name {getSortIcon("name")}</th>
            <th onClick={() => onSort("subject")} className="px-4 py-2 text-left text-xs font-medium cursor-pointer">Subject {getSortIcon("subject")}</th>
            <th className="px-4 py-2 text-left text-xs font-medium">Content Preview</th>
            <th onClick={() => onSort("createdAt")} className="px-4 py-2 text-left text-xs font-medium cursor-pointer">Created {getSortIcon("createdAt")}</th>
            <th className="px-4 py-2 text-right text-xs font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((t) => (
            <tr key={t.id} onClick={() => onView(t)} className="hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer">
              <td className="px-2 py-2"><input type="checkbox" checked={selectedTemplates.includes(t.id)} onClick={(e) => e.stopPropagation()} onChange={() => onToggleSelect(t.id)} className="h-3 w-3 rounded" /></td>
              <td className="px-4 py-2 text-sm font-medium">{t.name}</td>
              <td className="px-4 py-2 text-sm">{t.subject}</td>
              <td className="px-4 py-2 text-sm truncate max-w-xs">{t.content}</td>
              <td className="px-4 py-2 text-sm">{formatDate(t.createdAt)}</td>
              <td className="px-4 py-2 text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={(e) => { e.stopPropagation(); onView(t); }} className="p-1 hover:bg-[var(--card-hover-bg)] rounded"><Eye className="w-4 h-4 text-[var(--accent-blue)]" /></button>
                  <button onClick={(e) => { e.stopPropagation(); onEdit(t); }} className="p-1 hover:bg-[var(--card-hover-bg)] rounded"><Edit className="w-4 h-4 text-[var(--accent-yellow)]" /></button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(t.id); }} className="p-1 hover:bg-[var(--card-hover-bg)] rounded"><Trash2 className="w-4 h-4 text-[var(--accent-red)]" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TemplateTable;