import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-professional-details',
  templateUrl: './professional-details.component.html',
  styleUrls: ['./professional-details.component.scss']
})
export class ProfessionalDetailsComponent implements OnInit, OnChanges {
  @Input() professionalForm!: FormGroup;
  @Input() updatedApiData?: any;
  @Input() districts!: any[];
  @Input() employeeTypes!: any[];
  @Input() designationList!: any[];
  @Input() employeeCategories!: any[];
  @Input() subjects!: any[];
  @Input() approvalTypes!: any[];
  @Input() submitted:boolean=false;
  @Input() schoolNameWithCity!:any[];
  @Input() isEdited:boolean=false
  @Output() professionalFormChange = new EventEmitter<any>();

  yesNoOptions = [
    { value: '', label: 'Select' },
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['professionalForm']) {
      this.professionalFormChange.emit(this.professionalForm);
    }
  }

}
