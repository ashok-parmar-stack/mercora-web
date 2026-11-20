export interface LocationItem {
  id: string;
  name: string;
  state: string;
  businessCount: number;
}

export const TOP_CITIES: LocationItem[] = [
  { id: "1", name: "Ahmedabad", state: "Gujarat", businessCount: 480 },
  { id: "2", name: "Surat", state: "Gujarat", businessCount: 390 },
  { id: "3", name: "Vadodara", state: "Gujarat", businessCount: 220 },
  { id: "4", name: "Rajkot", state: "Gujarat", businessCount: 215 },
  { id: "5", name: "Morbi", state: "Gujarat", businessCount: 340 },
];
