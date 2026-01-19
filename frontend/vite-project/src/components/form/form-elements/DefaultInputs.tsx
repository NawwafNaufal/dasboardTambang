import { useState } from "react";
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

/* ===============================
  MOCK DATA (TAMBAHAN)
   =============================== */

// simulasi id_pt dari user login
// nanti ini HARUS dari backend / JWT
const USER_PT_ID = "PT_A"; 
// contoh lain: "PT_B"

const ACTIVITY_BY_PT: Record<
  string,
  { value: string; label: string }[]
> = {
  PT_A: [
    { value: "loading_hauling", label: "Loading Hauling" },
  ],
  PT_B: [
    { value: "drilling", label: "Drilling" },
    { value: "breaker", label: "Breaker" },
  ],
};

const UNIT_BY_PT_AND_ACTIVITY: Record<
  string,
  Record<string, { value: string; label: string }[]>
> = {
  PT_A: {
    loading_hauling: [
      { value: "truck_a", label: "Truck A" },
      { value: "truck_b", label: "Truck B" },
    ],
  },
  PT_B: {
    drilling: [{ value: "truck_a", label: "Truck A" }],
    breaker: [{ value: "truck_a", label: "Truck A" }],
  },
};

/* ===============================
    COMPONENT
   =============================== */

export default function DefaultInputs() {
  const [message, setMessage] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  const handleActivityChange = (value: string) => {
    setSelectedActivity(value);
    handleSelectChange(value);
  };

  return (
    <ComponentCard title="Default Inputs">
      <div className="space-y-6 max-w-3xl">
        {/* DATE PICKER */}
        <div>
          <DatePicker
            id="date-picker"
            label="Date Picker Input"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              console.log({ dates, currentDateString });
            }}
          />
        </div>

        {/* JENIS AKTIVITAS (AUTO BY PT) */}
        <div>
          <Label>Jenis Aktivitas</Label>
          <Select onValueChange={handleActivityChange}>
            <SelectTrigger className="!h-11 !px-4 !rounded-xl w-full text-sm border border-gray-300">
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

        {/* UNIT (AUTO BY PT + AKTIVITAS) */}
        <div>
          <Label>Unit</Label>
          <Select
            disabled={!selectedActivity}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className="!h-11 !px-4 !rounded-xl w-full text-sm border border-gray-300">
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
          <Label>Plan</Label>
          <div className="relative">
            <Input
              placeholder="info@gmail.com"
              type="text"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Default TextArea */}
          <div>
            <Label>Description</Label>
            <TextArea
              value={message}
              onChange={(value) => setMessage(value)}
              rows={6}
            />
          </div>
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end ">
          <button className="inline-flex items-center gap-2 h-11 rounded-xl bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600">
            Submit
          </button>
        </div>
      </div>
    </ComponentCard>
  );
}