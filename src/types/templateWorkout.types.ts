import type {
  FixedLoadPrescription,
  LoadPrescriptionTypeId,
  PercentageOfMaxLoadPrescription,
  RpeLoadPrescription,
} from "./loadPrescription.types";

export type TemplateWorkout = {
  id?: number;
  name: string;
  templateExercises: templateExercise[];
};

export type templateExercise = {
  id?: number;
  exerciseId: number;
  templateSets: templateSet[];
};

export type templateSet = {
  id?: number;
  repGoal: number;
  loadPrescriptionTypeId: LoadPrescriptionTypeId;
  fixedLoadPrescription?: FixedLoadPrescription;
  percentageMaxLoadPrescription?: PercentageOfMaxLoadPrescription;
  rpeLoadPrescription?: RpeLoadPrescription;
};
