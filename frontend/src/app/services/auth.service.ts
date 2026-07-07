import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.apiUrl;

  constructor(private router: Router) {

  }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }
    else {
      return true
    }
  }
}
