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

export function minAndMaxDateValidator(minDate: string): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    debugger
   console.log("gggggggggggggggggg")
    const inputDate = new Date(control.value);
    const minDateObj = new Date(minDate);  // Convert minDate string to a Date object

    // If the date is not valid or if the input is before the minDate
    if (isNaN(inputDate.getTime())) {
      return { 'invalidDate': 'Invalid date format' };
    }

    // If the entered date is before the minDate
    if (inputDate < minDateObj) {
       console.log("minnnnn")
      return { minDate: true };
    }

    if (inputDate > new Date()) {
      return { 'maxDate': true };
    }

    return null; // Valid
  };
}