import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { User } from 'src/app/models/user';
import { validate } from 'rut.js'; // Importa la función de validación

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage {
  nombreCompleto: string = '';
  username: string = '';
  correo: string = '';
  rut: string = '';
  carrera: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  router: any;

  constructor(
    private userService: UserService,
    private alertCtrl: AlertController,
    private localStorageService: LocalStorageService
  ) {}

  async register() {
    if (!this.nombreCompleto || !this.username || !this.correo || !this.rut || !this.carrera || !this.password || !this.confirmPassword) {
      const alert = await this.alertCtrl.create({
        header: 'Error de registro',
        message: 'Por favor, complete todos los campos.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!this.isValidEmail(this.correo)) {
      const alert = await this.alertCtrl.create({
        header: 'Error de registro',
        message: 'El correo debe terminar en @duocuc.cl o @duoc.cl.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!this.isValidRUT(this.rut)) {
      const alert = await this.alertCtrl.create({
        header: 'Error de registro',
        message: 'El RUT ingresado no es válido.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.password !== this.confirmPassword) {
      const alert = await this.alertCtrl.create({
        header: 'Error de registro',
        message: 'Las contraseñas no coinciden.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const userExists = this.userService.getUsers().some(user => user.username === this.username);

    if (userExists) {
      const alert = await this.alertCtrl.create({
        header: 'Error de registro',
        message: 'El nombre de usuario ya existe.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const newUser: User = {
      nombreCompleto: this.nombreCompleto,
      username: this.username,
      correo: this.correo,
      rut: this.rut,
      carrera: this.carrera,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

    this.userService.addUser(newUser);
    this.localStorageService.save('userData', newUser);

    const alert = await this.alertCtrl.create({
      header: 'Registro exitoso',
      message: 'Usuario registrado correctamente.',
      buttons: [{
        text: 'OK',
        handler: () => {
          window.location.href = '/login';
        }
      }]
    });
    await alert.present();
  }

  isValidEmail(email: string): boolean {
    const domainPattern = /^[a-zA-Z0-9._%+-]+@(duocuc\.cl|duoc\.cl)$/;
    return domainPattern.test(email);
  }

  isValidRUT(rut: string): boolean {
    return validate(rut); // Usa la función de validación de rut.js
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navigateTo(route: string) {
    if (this.router.url !== route) {
      this.router.navigate([route]);
    }
  }
}