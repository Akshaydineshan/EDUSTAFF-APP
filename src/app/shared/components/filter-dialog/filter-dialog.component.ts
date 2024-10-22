import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent {
  @Input() showModal: boolean = false;
  @Input() filterData: any = {};
  @Output() applyFilters = new EventEmitter<any>();
  @Output() closeModal = new EventEmitter<void>();

  filters: any = {
    subjectFilter: '',
    retiringInMonths: null,
    schoolNameFilter: '',
    includeDocumentsWithError: false,
    minExperienceYear: null,
    maxExperienceYear: null
  };

  onApplyFilters() {
    this.applyFilters.emit(this.filters);
    this.closeModal.emit();
  }

  onClose() {
    this.closeModal.emit();
  }
}
