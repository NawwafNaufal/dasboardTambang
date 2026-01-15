export interface FormData {
  selectedDate: string;
  selectedActivity: string | null;
  selectedUnit: string | null;
  inputValue: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: {
    title: string;
    message: string;
  };
}

export type AlertType = 'success' | 'error' | 'warning' | 'info';