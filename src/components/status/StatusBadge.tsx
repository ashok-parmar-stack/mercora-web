import React from "react";
import { Badge } from "../ui/Badge";

export interface StatusBadgeProps {
  status?: string | null;
  isDeleted?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isDeleted }) => {
  if (isDeleted) {
    return (
      <Badge variant="danger" dot size="sm">
        Trashed
      </Badge>
    );
  }

  const normalized = (status || "ACTIVE").toUpperCase();

  switch (normalized) {
    case "ACTIVE":
      return (
        <Badge variant="success" dot size="sm">
          Active
        </Badge>
      );
    case "INACTIVE":
      return (
        <Badge variant="danger" dot size="sm">
          Inactive
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="warning" dot size="sm">
          Pending
        </Badge>
      );
    case "SUSPENDED":
      return (
        <Badge variant="warning" dot size="sm">
          Suspended
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" size="sm">
          {status || "Unknown"}
        </Badge>
      );
  }
};
