import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '../service/user.service';

@Directive({
  selector: '[appAppRole]'
})
export class AppRoleDirective {

  private currentRoles: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) {}
  
  // Input for role(s) - use a setter to handle changes
  @Input() set appAppRole(roles: string | string[]) {
    console.log("input roles", roles); // Check if the setter is called
    this.currentRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView(); // Update the view whenever roles change
  }
  
  // Update the view based on the roles
  private updateView() {
    console.log("current roles", this.currentRoles);
    if (this.currentRoles.some(role => this.userService.hasRole(role))) {
      this.viewContainer.createEmbeddedView(this.templateRef); // Show element
    } else {
      this.viewContainer.clear(); // Hide element
    }
  }
  
}
