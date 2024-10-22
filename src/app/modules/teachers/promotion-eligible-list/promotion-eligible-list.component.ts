import { Component } from '@angular/core';
import { DataService } from 'src/app/core/service/data/data.service';

@Component({
  selector: 'app-promotion-eligible-list',
  templateUrl: './promotion-eligible-list.component.html',
  styleUrls: ['./promotion-eligible-list.component.scss']
})
export class PromotionEligibleListComponent {
  isSidebarClosed = false;
  displayColumns: string[] = ['id', 'name', 'age', 'experienceYear', 'fromPromotion', 'fromSchool', 'phoneNumber', 'subject'];

  promotionEligibleList: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadPromotionEligibleList();
  }

  loadPromotionEligibleList(): void {
    this.dataService.getTeachersPromotionEligibilityList().subscribe(
      (data) => {
        this.promotionEligibleList = data;
        console.log(this.promotionEligibleList);
      },
      (error) => {
        console.error('Error fetching teachers eligible promotion data:', error);
      }
    );
  }
}