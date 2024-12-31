import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { StylesConfig } from "react-select";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




interface Option {
  value: string;
  label: string;
  isDisabled?: boolean; // Optional property for disabling options
}

export const CustomStyles: StylesConfig<Option, false> = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled
      ? "transparent" // Transparent for disabled options
      : state.isFocused
      ? "rgba(240, 240, 240, 1)" // Light blue on focus
      : "transparent", // Default transparent background
    color: state.isDisabled ? "gray" : "black", // Text color based on disabled state
    cursor: state.isDisabled ? "not-allowed" : "pointer", // Pointer behavior
    padding: 5,
    borderRadius:10,

  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: "transparent", // Transparent background for control
    border: "1px solid lightgray",
    boxShadow: "none",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "transparent", // Transparent menu background
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "black", // Default text color for the selected value
  }),
};
