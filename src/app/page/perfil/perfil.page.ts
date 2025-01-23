import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit, ViewWillEnter {

  nombreCompleto!: string;
  username!: string;
  correo!: string;
  rut!: string;
  carrera!: string;

  constructor(
    private localStorageService: LocalStorageService,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  loadUserData() {
    const userData = this.localStorageService.getItem('userData');
    if (userData) {
      this.nombreCompleto = userData.nombreCompleto;
      this.username = userData.username;
      this.correo = userData.correo;
      this.rut = userData.rut;
      this.carrera = userData.carrera;
    }
  }

  async confirmSaveUserData() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Deseas modificar la información?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Modificación cancelada');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.saveUserData();
          }
        }
      ]
    });
    await alert.present();
  }

  async saveUserData() {
    this.localStorageService.setItem('userData', {
      nombreCompleto: this.nombreCompleto,
      username: this.username,
      correo: this.correo,
      rut: this.rut,
      carrera: this.carrera
    });
    const alert = await this.alertCtrl.create({
      header: 'Información actualizada',
      message: 'Información actualizada correctamente',
      buttons: ['OK']
    });
    await alert.present();
  }

  navigateTo(route: string) {
    if (this.router.url !== route) {
      this.router.navigate([route]);
    }
  }
}
