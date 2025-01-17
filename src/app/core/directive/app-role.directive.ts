import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '../service/user.service';

@Directive({
  selector: '[appAppRole]'
})
export class AppRoleDirective {

  private currentRole!: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) {
    // Subscribe to user details
    // this.userService.getUserDetails$().subscribe((details: any) => {
    //   console.log("details", details);
    //   this.currentRole = details?.roleName;
    //   this.updateView();
    // });
  }

  // Input for role - use a setter to handle changes
  @Input() set appAppRole(role: string) {
    console.log("input role", role);  // Check if the setter is called
    this.currentRole = role;
    this.updateView();  // Update the view whenever the role changes
  }

  // Update the view based on the role
  private updateView() {
    console.log("role", this.currentRole);
    if (this.userService.hasRole(this.currentRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef); // Show element
    } else {
      this.viewContainer.clear(); // Hide element
    }
  }
}
