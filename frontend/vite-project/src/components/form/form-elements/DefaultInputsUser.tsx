import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import DatePicker from "../date-picker.tsx";
import Input from "../input/InputField.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextArea from "../input/TextArea.tsx";
import Alert from "../../ui/alert/Alert.tsx";

import { useFormState} from '../../../hooks/useFormState.ts';
import { useAlert} from '../../../hooks/useAlert.ts';
import { validateForm } from '../../../utils/formValidation.ts';
import { USER_PT_ID, ACTIVITY_BY_PT, UNIT_BY_PT_AND_ACTIVITY } from '../../../constants/mockData.ts';

export default function DefaultInputs() {
  const {
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
    resetForm,
    formKey,
  } = useFormState();

  const {
    showAlert,
    alertType,
    alertTitle,
    alertMessage,
    showAlertNotification,
  } = useAlert();

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
    setSelectedUnit(value);
  };

  const handleActivityChange = (value: string) => {
    setSelectedActivity(value);
    setSelectedUnit(null);
  };

  const handleSubmit = () => {
    const validation = validateForm({
      selectedDate,
      selectedActivity,
      selectedUnit,
      inputValue,
      message,
    });

    if (!validation.isValid && validation.error) {
      showAlertNotification('error', validation.error.title, validation.error.message);
      return;
    }

    console.log({
      date: selectedDate,
      activity: selectedActivity,
      unit: selectedUnit,
      input: inputValue,
      description: message
    });

    showAlertNotification('success', 'Berhasil!', 'Data berhasil disimpan!');
    resetForm();
  };

  // Class yang sama untuk semua input dengan disabled state styling
  const inputClassName = "!h-11 !px-4 !rounded-xl w-full text-sm !border !border-gray-300 !bg-white dark:!bg-[#171f2f] placeholder:!text-gray-400 dark:placeholder:!text-gray-300 disabled:!border-gray-300 disabled:!opacity-100";

  return (
    <ComponentCard title="Default Inputs">
      {showAlert && (
        <div className="mb-6">
          <Alert
            variant={alertType}
            title={alertTitle}
            message={alertMessage}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <DatePicker
              key={`date-${formKey}`}
              id="date-picker"
              label="Date Picker Input"
              placeholder="Select a date"
              onChange={(dates, currentDateString) => {
                console.log({ dates, currentDateString });
                setSelectedDate(currentDateString);
              }}
            />
          </div>

          <div>
            <Label>Jenis Aktivitas</Label>
            <Select 
              key={`activity-${formKey}`}
              value={selectedActivity || undefined}
              onValueChange={handleActivityChange}
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Pilih Aktivitas" />
              </SelectTrigger>

              <SelectContent>
                {ACTIVITY_BY_PT[USER_PT_ID]?.map((activity) => (
                  <SelectItem
                    key={activity.value}
                    value={activity.value}
                  >
                    {activity.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Unit</Label>
            <Select
              key={`unit-${formKey}`}
              value={selectedUnit || undefined}
              disabled={!selectedActivity}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Pilih Unit" />
              </SelectTrigger>

              <SelectContent>
                {selectedActivity &&
                  UNIT_BY_PT_AND_ACTIVITY[USER_PT_ID]?.[
                    selectedActivity
                  ]?.map((unit) => (
                    <SelectItem
                      key={unit.value}
                      value={unit.value}
                    >
                      {unit.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Input</Label>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="info@gmail.com"
              type="text"
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <Label>Deskripsi</Label>
          <TextArea
            value={message}
            onChange={(value) => setMessage(value)}
            rows={6}
            className="!rounded-xl !border !border-gray-300 !bg-white dark:!bg-[#171f2f] placeholder:!text-gray-400 dark:placeholder:!text-gray-300"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 h-11 rounded-xl bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600"
        >
          Submit
        </button>
      </div>
    </ComponentCard>
  );
}