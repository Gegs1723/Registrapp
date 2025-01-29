import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
  standalone: false
})
export class RecuperarPage {
  username: string = '';

  constructor(
    private alertCtrl: AlertController,
    private router: Router,
    private userService: UserService
  ) {}

  async recoverPassword() {
    const user = this.userService.getUser(this.username);
    if (user) {
      const alert = await this.alertCtrl.create({
        header: 'Recuperación de Contraseña',
        message: 'Se han enviado las instrucciones para restablecer tu contraseña a tu correo electrónico.',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigate(['/login']);
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Usuario no encontrado.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
