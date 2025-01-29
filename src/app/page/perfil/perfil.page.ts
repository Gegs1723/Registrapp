import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { SessionService } from "src/app/services/session.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/models/user";
import { validate } from 'rut.js'; // Importa la función de validación

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
  newPassword: string = '';
  confirmNewPassword: string = '';
  showNewPassword: boolean = false;
  showConfirmNewPassword: boolean = false;
  attendance: any[] = [];
  isRutValid: boolean = true; // Para validación en tiempo real

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

  ionViewWillEnter() {
    this.loadUserData(); // Recargar datos cada vez que la página se muestra
  }

  loadUserData() {
    const currentUsername = this.sessionService.getUserSession();
    const users = this.localStorageService.get('usuarios') || [];
    const currentUser = users.find((user: User) => user.username === currentUsername);
    if (currentUser) {
      this.nombreCompleto = currentUser.nombreCompleto;
      this.username = currentUser.username;
      this.correo = currentUser.correo;
      this.rut = currentUser.rut;
      this.carrera = currentUser.carrera;
      this.newPassword = ''; // Limpiar el campo de nueva contraseña
      this.confirmNewPassword = ''; // Limpiar el campo de confirmación de nueva contraseña
    }
  }

  async saveUserData() {
    if (!this.isValidRUT(this.rut)) {
      const alert = await this.alertCtrl.create({
        header: 'Error de actualización',
        message: 'El RUT ingresado no es válido.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.newPassword && this.newPassword !== this.confirmNewPassword) {
      const alert = await this.alertCtrl.create({
        header: 'Error de actualización',
        message: 'Las contraseñas no coinciden.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const currentUsername = this.sessionService.getUserSession();
    const users = this.localStorageService.get('usuarios') || [];
    const currentUser = users.find((user: User) => user.username === currentUsername);

    const updatedUser: User = {
      nombreCompleto: this.nombreCompleto,
      username: this.username,
      correo: this.correo,
      rut: this.rut,
      carrera: this.carrera,
      password: this.newPassword || (currentUser ? currentUser.password : ''), // Mantener la contraseña existente si no se proporciona una nueva
      confirmPassword: this.confirmNewPassword || (currentUser ? currentUser.confirmPassword : '') // Mantener la confirmación de contraseña existente si no se proporciona una nueva
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

    // Recargar los datos del usuario después de la actualización
    this.loadUserData();
  }

  isValidRUT(rut: string): boolean {
    this.isRutValid = validate(rut); // Usa la función de validación de rut.js
    return this.isRutValid;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmNewPasswordVisibility() {
    this.showConfirmNewPassword = !this.showConfirmNewPassword;
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