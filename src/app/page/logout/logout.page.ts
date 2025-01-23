import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
  standalone: false
})
export class LogoutPage {

  constructor(private localStorageService: LocalStorageService, private router: Router) { }

  logout() {
       this.router.navigate(['/login']);
  }
  
}
