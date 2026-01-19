export const LoadPrescriptionTypeId = {
  FIXED: 0,
  PERCENTAGE_OF_MAX: 1,
  RPE: 2,
} as const;

export type LoadPrescriptionTypeId =
  (typeof LoadPrescriptionTypeId)[keyof typeof LoadPrescriptionTypeId];

export type FixedLoadPrescription = {
  Id?: number;
  weight: number;
};

export type PercentageOfMaxLoadPrescription = {
  Id?: number;
  percentage: number;
};

export type RpeLoadPrescription = {
  Id?: number;
  rpe: number;
};
