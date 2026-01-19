import { FormData, ValidationResult } from '../types/form.types';

export const validateForm = (data: FormData): ValidationResult => {
  if (!data.selectedDate) {
    return {
      isValid: false,
      error: {
        title: 'Error!',
        message: 'Harap pilih tanggal terlebih dahulu.',
      },
    };
  }

  if (!data.selectedActivity) {
    return {
      isValid: false,
      error: {
        title: 'Error!',
        message: 'Harap pilih jenis aktivitas terlebih dahulu.',
      },
    };
  }

  if (!data.selectedUnit) {
    return {
      isValid: false,
      error: {
        title: 'Error!',
        message: 'Harap pilih unit terlebih dahulu.',
      },
    };
  }

  if (!data.inputValue.trim()) {
    return {
      isValid: false,
      error: {
        title: 'Error!',
        message: 'Harap isi field input terlebih dahulu.',
      },
    };
  }

  if (!data.message.trim()) {
    return {
      isValid: false,
      error: {
        title: 'Error!',
        message: 'Harap isi deskripsi terlebih dahulu.',
      },
    };
  }

  return { isValid: true };
};