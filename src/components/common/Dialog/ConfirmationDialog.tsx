"use client";

import React from "react";
import { AlertDialog, AlertDialogProps } from "./AlertDialog";

export interface ConfirmationDialogProps extends AlertDialogProps {}

export function ConfirmationDialog(props: ConfirmationDialogProps) {
  return <AlertDialog {...props} />;
}
