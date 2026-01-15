import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";

export default function InputGroup() {
  return (
    <ComponentCard title="Input Group">
      <div className="space-y-6">
        <div>
          <Label>Plan</Label>
          <div className="relative">
            <Input
              placeholder="info@gmail.com"
              type="text"
            />
          </div>
        </div>
      <div>
          <Label>Rkap</Label>
          <div className="relative">
            <Input
              placeholder="info@gmail.com"
              type="text"
            />
          </div>
        </div>
        <div>
          <Label>Month</Label>
            <div className="relative">
            <Input
              type="month"
              className="h-11 px-4 rounded-xl w-full text-sm border-2"/>
        </div>
        </div>
        <div className="flex justify-end">
          <button className="inline-flex items-center gap-2 h-11 rounded-xl bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600">
            Submit
          </button>
        </div>
      </div>
    </ComponentCard>
  );
}
