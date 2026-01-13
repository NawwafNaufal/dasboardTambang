import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
// import Select from "../Select";
import DatePicker from "../date-picker.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DefaultInputs() {  
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <ComponentCard title="Default Inputs">
      <div className="space-y-6">
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
        <div>
          <Label>Jenis Aktivitas</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="!h-11 !px-4 !rounded-xl w-full text-sm border border-gray-300">
                <SelectValue placeholder="Select email provider" />
              </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Loading Hauling">Loading Hauling</SelectItem>
                    <SelectItem value="Drilling">Drilling</SelectItem>
                    <SelectItem value="Perintisan Used">Perintisan Used</SelectItem>
                    <SelectItem value="Perintisan New">Perintisan New</SelectItem>
                    <SelectItem value="Bulldozer Used">Bulldozer Used</SelectItem>
                    <SelectItem value="Bulldozer New">Bulldozer New</SelectItem>
                    <SelectItem value="Breaker">Breaker</SelectItem>
                  </SelectContent>
            </Select>
      </div>
        <div>
          <Label>Input with Placeholder (Changed to Select)</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="!h-11 !px-4 !rounded-xl w-full text-sm border border-gray-300">
                <SelectValue placeholder="Select email provider" />
              </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gmail">Gmail</SelectItem>
                  <SelectItem value="yahoo">Yahoo</SelectItem>
                  <SelectItem value="outlook">Outlook</SelectItem>
                </SelectContent>
            </Select>
        </div>
        
        <div>
          <Label>Select Input (Read Only)</Label>
          <div className=" !h-11 !px-4 !rounded-xl w-full text-sm border border-gray-300 flex items-center">
            marketing
          </div>
        </div>
        <div>
          <Label>Select Input (Read Only)</Label>
          <div className=" !h-11 !px-4 !rounded-xl w-full text-sm border border-gray-300 flex items-center">
            marketing
          </div>
        </div>
          <div className="flex justify-end mt-56">
          <button className="inline-flex items-center gap-2 h-11 rounded-xl bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600">
            Submit
          </button>
        </div>
      </div>
    </ComponentCard>
  );
}