import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-test-demo',
  templateUrl: './test-demo.component.html',
  styleUrls: ['./test-demo.component.scss']
})
export class TestDemoComponent {
  dropdownList:any[] = [];
  selectedItems :any[]= [];
  dropdownSettings:IDropdownSettings = {};

  minValue:any = 0;  // Minimum value of the slider
  maxValue:any = 100; // Maximum value of the slider
  minSelected:any = 0; // Default minimum selected value
  maxSelected:any = 100; // Default maximum selected value

  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }

    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    
    };
  }
  validateRange(event:any,changed: 'min' | 'max'): void {
    if (changed === 'min' && this.minSelected >= this.maxSelected) {
      event.preventDefault()
      this.minSelected = this.maxSelected - 1; // Prevent overlap
    } else if (changed === 'max' && this.maxSelected <= this.minSelected) {
      event.preventDefault()
      this.maxSelected = this.minSelected + 1; // Prevent overlap
    }
  }

  
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onDragOver(event:any) {
    event.preventDefault();
}

// From drag and drop
onDropSuccess(event:any) {
    event.preventDefault();
   console.log("file",event.dataTransfer.files)

    // this.onFileChange(event.dataTransfer.files);    // notice the "dataTransfer" used instead of "target"
}
onChange(event:any) {

}

  

}
