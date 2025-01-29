import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
  standalone: false
})
export class LogoutPage {

  constructor(private sessionService: SessionService, private router: Router) { }

  logout() {
    this.sessionService.logoutUser();
    this.router.navigate(['/login']);
  }
}