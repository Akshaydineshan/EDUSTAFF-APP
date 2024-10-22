import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenStoreService } from './service/tokenStore/token-store.service';
import { AuthService } from './service/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './service/data/data.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    TokenStoreService,
    AuthService,
    DataService
  ]
})
export class CoreModule { }
