import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(startDateControlName: string, endDateControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get(startDateControlName)?.value;
    const endDate = group.get(endDateControlName)?.value;

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return { invalidDateRange: true }; // Return error object
    }
    return null; // Return null if validation passes
  };
}