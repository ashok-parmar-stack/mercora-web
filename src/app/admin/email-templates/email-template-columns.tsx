import React from "react";
import { Column } from "../../../components/data-table/DataTable";
import { StatusBadge } from "../../../components/status/StatusBadge";
import { Badge } from "../../../components/ui/Badge";
import { Mail } from "lucide-react";

export interface EmailTemplate {
  id: string;
  code: string;
  name: string;
  subject: string;
  category: "AUTH" | "NOTIFICATION" | "BILLING" | "SECURITY";
  status: "ACTIVE" | "INACTIVE";
  updatedAt: string;
}

export const emailTemplateColumns: Column<EmailTemplate>[] = [
  {
    key: "name",
    header: "Template Name & Code",
    sortable: true,
    sortAccessor: (t) => t.name.toLowerCase(),
    render: (t) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
          <Mail className="w-4 h-4" />
        </div>
        <div>
          <div className="font-extrabold text-gray-900 text-xs">{t.name}</div>
          <code className="text-[10px] font-mono text-gray-500">{t.code}</code>
        </div>
      </div>
    ),
  },
  {
    key: "subject",
    header: "Email Subject Line",
    sortable: true,
    sortAccessor: (t) => t.subject.toLowerCase(),
    render: (t) => <span className="text-xs text-gray-700 truncate max-w-xs block">{t.subject}</span>,
  },
  {
    key: "category",
    header: "Category",
    sortable: true,
    sortAccessor: (t) => t.category,
    render: (t) => (
      <Badge
        variant={
          t.category === "SECURITY"
            ? "red"
            : t.category === "AUTH"
            ? "purple"
            : t.category === "BILLING"
            ? "amber"
            : "blue"
        }
        size="sm"
      >
        {t.category}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    sortAccessor: (t) => t.status,
    render: (t) => <StatusBadge status={t.status} />,
  },
  {
    key: "updatedAt",
    header: "Last Modified",
    sortable: true,
    sortAccessor: (t) => t.updatedAt,
    render: (t) => <span className="text-xs text-gray-500">{t.updatedAt}</span>,
  },
];
