// ============================================
// FILE: hooks/useAlert.ts
// ============================================

import { useState } from "react";

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export const useAlert = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>('success');
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlertNotification = (
    type: AlertType,
    title: string,
    message: string,
    duration: number = 4000
  ) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), duration);
  };

  return {
    showAlert,
    alertType,
    alertTitle,
    alertMessage,
    showAlertNotification,
  };
};