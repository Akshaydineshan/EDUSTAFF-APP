import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const toastr = inject(ToastrService)
  const router = inject(Router);

  const userDetails = userService.userDetails.value;
  console.log("user details inside guard", userDetails)

  if (userDetails && userDetails.roleName === 'Manager') {
    return true;
  }
  toastr.warning('Access Denied !', 'Warning', {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-left',
    timeOut: 4500,
  });


  return false;
};
