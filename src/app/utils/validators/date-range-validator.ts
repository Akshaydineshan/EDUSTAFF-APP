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

export function minAndMaxDateValidator(minDate: string,min:boolean,max:boolean): ValidatorFn {
console.log("inside")
  return (control: AbstractControl): ValidationErrors | null => {
    debugger
    console.log("control.value->",control)
    if (control.value == null || control.value=='') {
     
      return { 'required': true };
    }

   
    const inputDate = new Date(control.value);
   
  
    const minDateObj = new Date(minDate);  // Convert minDate string to a Date object

   
    // If the date is not valid or if the input is before the minDate
    if (isNaN(inputDate.getTime()) || inputDate.getFullYear().toString().length !== 4) {
      return { 'invalidDate': true };
    }

    // If the entered date is before the minDate
    if (min && inputDate < minDateObj) {
       console.log("minnnnn")
      return { minDate: true };
    }

    if (max && inputDate > new Date()) {
      return { 'maxDate': true };
    }

    return null; // Valid
  };
}