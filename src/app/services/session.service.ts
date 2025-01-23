import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  getUserSession(): string | null {
    return localStorage.getItem('userSession');
  }

  setUserSession(username: string): void {
    localStorage.setItem('userSession', username);
  }

  clearUserSession(): void {
    localStorage.removeItem('userSession');
  }
}
