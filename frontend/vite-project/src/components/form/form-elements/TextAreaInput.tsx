import { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import TextArea from "../input/TextArea";
import Label from "../Label";

export default function TextAreaInput() {
  const [message, setMessage] = useState("");
  // const [messageTwo, setMessageTwo] = useState("");
  return (
    <ComponentCard title="Textarea input field">
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
        <div className="flex justify-end mt-8">
          <button className="inline-flex items-center gap-2 h-11 rounded-xl bg-brand-500 px-5 text-sm font-medium text-white hover:bg-brand-600">
            Submit
          </button>
        </div>
      </div>
    </ComponentCard>
  );
}
