export const USER_PT_ID = "PT_A";

export const ACTIVITY_BY_PT: Record<
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

export const UNIT_BY_PT_AND_ACTIVITY: Record<
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