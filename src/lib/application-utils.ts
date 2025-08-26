"use client";

import { Patient } from "@/models/patients/patient-model";
import axios from "axios";
import { create } from "zustand";

type EntityState = {
  entity: string;
  setEntity: (value: string) => void;
};

export const useEntityStore = create<EntityState>((set) => ({
  entity: "",
  setEntity: (value: string) => {
    localStorage.setItem("entity", value);
    set({ entity: value });
  },
}));

export const FetchPatientsData = async (): Promise<Patient[] | null> => {
  try {
    const response = await axios.get<Patient[]>(`http://localhost:3001/patients`);
    if(response.status !== 200) return null;

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const CalculateAge = (birthDate: string): number => {
  if(!birthDate) return 0;
  
  const today = new Date();
  const birthDateDate = new Date(birthDate);
  let age = today.getFullYear() - birthDateDate.getFullYear();
  const m = today.getMonth() - birthDateDate.getMonth();
  if(m < 0 || (m === 0 && today.getDate() < birthDateDate.getDate())) {
    age--;
  }
  return age;
}