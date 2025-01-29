import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { SessionService } from "src/app/services/session.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/models/user";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  nombreCompleto!: string;
  username!: string;
  correo!: string;
  rut!: string;
  carrera!: string;
  attendance: any[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private sessionService: SessionService,
    private userService: UserService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadAttendanceData();
  }

  loadUserData() {
    const userData = this.localStorageService.get('userData');
    if (userData) {
      this.nombreCompleto = userData.nombreCompleto;
      this.username = userData.username;
      this.correo = userData.correo;
      this.rut = userData.rut;
      this.carrera = userData.carrera;
    }
  }

  async saveUserData() {
    const updatedUser: User = {
      nombreCompleto: this.nombreCompleto,
      username: this.username,
      correo: this.correo,
      rut: this.rut,
      carrera: this.carrera,
      password: '', // No actualizamos la contraseña aquí
      confirmPassword: '' // No actualizamos la confirmación de contraseña aquí
    };

    // Actualizar userData
    this.localStorageService.save('userData', updatedUser);

    // Actualizar userSession
    this.sessionService.setUserSession(this.username);

    // Actualizar lista de usuarios
    this.userService.updateUser(updatedUser);

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

  loadAttendanceData() {
    const username = this.sessionService.getUserSession();
    if (username) {
      this.attendance = this.localStorageService.get(`attendance_${username}`) || [];
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
}