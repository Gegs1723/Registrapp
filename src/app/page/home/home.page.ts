import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit, ViewWillEnter {

  nombreCompleto!: string;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  ionViewWillEnter() {
    // Aquí puedes agregar cualquier lógica que necesites ejecutar cuando la vista esté a punto de entrar
  }

  loadUserData() {
    const userData = this.localStorageService.getItem('userData');
    if (userData) {
      this.nombreCompleto = userData.nombreCompleto;
    }
  }

  navigateTo(route: string) {
    if (this.router.url !== route) {
      this.router.navigate([route]);
    }
  }

  logout() {
    this.localStorageService.clear();
    this.router.navigate(['/logout']);
  }
}