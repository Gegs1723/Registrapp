import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { Geolocation } from '@capacitor/geolocation';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', [
        animate(20000)
      ])
    ])
  ]
})
export class HomePage implements OnInit, AfterViewInit {

  username: string;
  nombreCompleto: string | null = null;
  latitude: number = 0;
  longitude: number = 0;
  locationError: string | null = null;
  address: any = null;

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private http: HttpClient,
    private animationCtrl: AnimationController
  ) {
    this.username = this.sessionService.getUserSession() ?? '';
  }

  ngOnInit() {
    this.nombreCompleto = localStorage.getItem('nombreCompleto');
    this.getCurrentPosition();
  }

  ngAfterViewInit(): void {
    const element = document.querySelector('#animationImage');
    if (!element) {
      console.log('No se encontró el elemento para animar');
      return;
    }
    const animation = this.animationCtrl
      .create()
      .addElement(element)
      .duration(5000)
      .iterations(Infinity)
      .keyframes([
      { offset: 0, opacity: '0', transform: 'scale(0.5)'},
      { offset: 0.5, opacity: '1', transform: 'scale(1)' },
      { offset: 1, opacity: '0', transform: 'scale(0.5)' }
      ]);
    animation.play();
  }

  async getCurrentPosition() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.locationError = null;
      this.getAddress(this.latitude, this.longitude);
    } catch (error) {
      this.locationError = 'Error al obtener la ubicación.';
      console.error('Error getting location', error);
    }
  }

  getAddress(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    this.http.get(url).subscribe((data: any) => {
      this.address = data.address;
    }, error => {
      console.error('Error getting address', error);
    });
  }

  navigateTo(route: string) {
    if (this.router.url !== route) {
      this.router.navigate([route]);
    }
  }

  logout() {
    this.sessionService.logoutUser();
    this.router.navigate(['/logout']);
  }
}