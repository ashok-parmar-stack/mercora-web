import React from "react";

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full overflow-hidden border border-[var(--border)] rounded-xl bg-[var(--surface)] shadow-xs">
      <div className="overflow-x-auto">
        <table className={`w-full text-left text-sm text-[var(--text-secondary)] border-collapse ${className}`} {...props}>
          {children}
        </table>
      </div>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <thead className={`bg-[var(--background-secondary)] border-b border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] font-instrument ${className}`} {...props}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <tbody className={`divide-y divide-[var(--border)] bg-[var(--surface)] ${className}`} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <tr className={`hover:bg-[var(--surface-hover)] transition-colors duration-150 ${className}`} {...props}>
      {children}
    </tr>
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <th className={`px-0 py-0 font-semibold text-[var(--text-secondary)] text-xs tracking-normal select-none border-b border-[var(--border)] group/th ${className}`} {...props}>
      <div className="flex items-center justify-between h-10 px-4">
        <div className="flex-1 min-w-0">{children}</div>
        <div className="h-4 w-[1px] bg-[var(--border)] flex-shrink-0 ml-3 group-last/th:hidden" aria-hidden="true" />
      </div>
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <td className={`px-5 py-4 align-middle text-[var(--text-primary)] ${className}`} {...props}>
      {children}
    </td>
  );
};
