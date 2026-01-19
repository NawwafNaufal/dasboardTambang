import { useState } from "react";

export const useFormState = () => {
  const [message, setMessage] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [formKey, setFormKey] = useState(0); // <-- tambahkan ini

  const resetForm = () => {
    setSelectedDate("");
    setSelectedActivity(null);
    setSelectedUnit(null);
    setInputValue("");
    setMessage("");
    setFormKey(prev => prev + 1); // <-- increment key untuk force re-render
  };

  return {
    message,
    setMessage,
    selectedActivity,
    setSelectedActivity,
    selectedUnit,
    setSelectedUnit,
    selectedDate,
    setSelectedDate,
    inputValue,
    setInputValue,
    formKey, // <-- export formKey
    resetForm,
  };
};