import { Injectable } from '@angular/core';
const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class TokenStoreService {

  constructor() { }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.clear();
  }

  public saveToken(token: string) {
    if (!token) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): any {
    return localStorage.getItem(TOKEN_KEY);
  }
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.clear();
  }
}
