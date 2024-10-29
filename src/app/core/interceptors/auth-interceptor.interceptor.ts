// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpErrorResponse
// } from '@angular/common/http';
// import { catchError, Observable, throwError } from 'rxjs';
// import { Router } from '@angular/router';
// import { TokenStoreService } from 'src/app/core/service/tokenStore/token-store.service';
// import { SpinnerServiceService } from 'src/app/shared/material-spinner/spinner-service.service';


// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   constructor(private authService: TokenStoreService, private router: Router,private spinnerService:SpinnerServiceService) { }

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const authToken = this.authService.getToken();
//     let authReq = req;

//     if (authToken) {
//       authReq = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${authToken}`
//         }
//       });
//     }
//     this.spinnerService.show()


//     return next.handle(authReq).pipe(

//       catchError((error: HttpErrorResponse) => {
//         this.spinnerService.hide()
//         if (error.status === 401) {
//           this.authService.logout();
//           this.router.navigate(['/login']);
//         } else {
//           // setTimeout(()=>{
//           //   this.spinner.hide()
//           // },4000)

//           this.router.navigate(['/dashboard'])
//         }
//         return throwError(error);
//       })
//     );
//   }
// }

// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { TokenStoreService } from 'src/app/core/service/tokenStore/token-store.service';

import { SpinnerServiceService } from 'src/app/shared/material-spinner/spinner-service.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: TokenStoreService,
    private router: Router,
    private spinnerService: SpinnerServiceService // Inject the spinner service
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    let authReq = req;

    if (authToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    }

    this.spinnerService.show(); // Show spinner before the request

    return next.handle(authReq).pipe(
      // Use tap to handle successful responses
      tap({
        next: () => {


         
          // setTimeout(()=>{
            this.spinnerService.hide();
          // },200)

          // Hide spinner on success
        },
        error: (error: HttpErrorResponse) => {
          // setTimeout(()=>{
            this.spinnerService.hide(); // Hide spinner on error
          // },200)
        
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            // this.router.navigate(['/dashboard']);
          }
          return throwError(error); // Rethrow the error for further handling if needed
        },
      })
    );
  }
}

