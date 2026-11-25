/**
 * Mercora Centralized Common Component Library
 * Linear-Inspired High-Craft UI Primitives (Zero Radix, Zero shadcn CLI dependency)
 */

// 1. Actions & Icons
export * from "./Button";
export * from "./Icon";

// 2. Forms & Inputs
export { Input, type InputProps } from "./Input";
export * from "./Textarea";
export * from "./SearchInput";
export { Select, type SelectProps, type SelectOption } from "./Select";
export * from "./MultiSelect";
export * from "./Checkbox";
export * from "./RadioGroup";
export * from "./Switch";
export * from "./Form";
export * from "./FormField";
export * from "./FileUpload";

// 3. Date & Time
export * from "./DatePicker";
export * from "./Calendar";

// 4. Overlays & Menus
export * from "./Dropdown";
export * from "./Tooltip";
export * from "./Popover";
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  type DialogProps,
  type DialogContentProps,
  ConfirmationDialog,
  type ConfirmationDialogProps,
} from "./Dialog";
export * from "./AlertDialog";
export * from "./ConfirmDialog";

// 5. Navigation & Layout
export * from "./Tabs";
export * from "./Accordion";
export * from "./Card";
export * from "./Breadcrumb";
export * from "./Pagination";
export * from "./PageHeader";

// 6. Data Display & Badges
export * from "./Badge";
export * from "./Avatar";
export * from "./DataTable";
export * from "./Table";

// 7. Feedback & Status
export * from "./Skeleton";
export * from "./EmptyState";
export * from "./Loading";
export * from "./LoadingState";
export * from "./ErrorState";
export * from "./Toast";
