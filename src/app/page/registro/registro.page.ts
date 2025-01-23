import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {

  nombreCompleto!: string;
  username!: string;
  correo!: string;
  rut!: string;
  carrera!: string;
  password!: string;
  confirmPassword!: string;

  constructor(
    private userService: UserService,
    private alertCtrl: AlertController,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
  }

  async register() {
    console.log('Nombre Completo: ', this.nombreCompleto);
    console.log('Username: ', this.username);
    console.log('Correo: ', this.correo);
    console.log('RUT: ', this.rut);
    console.log('Carrera: ', this.carrera);
    console.log('Password: ', this.password);
    console.log('Confirm Password: ', this.confirmPassword);

    if (!this.nombreCompleto || !this.username || !this.correo || !this.rut || !this.carrera || !this.password || !this.confirmPassword) {
      const alert = await this.alertCtrl.create({
        header: 'Error de registro',
        message: 'Por favor, complete todos los campos.',
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

    this.userService.addUser(this.nombreCompleto, this.correo, this.rut, this.carrera, this.username, this.password, this.confirmPassword);
    this.localStorageService.setItem('userData', {
      nombreCompleto: this.nombreCompleto,
      username: this.username,
      correo: this.correo,
      rut: this.rut,
      carrera: this.carrera,
      password: this.password
    });

    const alert = await this.alertCtrl.create({
      header: 'Registro exitoso',
      message: 'Usuario registrado correctamente.',
      buttons: [{
      text: 'OK',
      handler: () => {
        window.location.href = '/home';
      }
      }]
    });
    await alert.present();
  }
}
