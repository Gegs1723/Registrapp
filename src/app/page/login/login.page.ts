import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit, AfterViewInit {
  cabecera: string = 'Inicio de Sesión';
  bienve: string = 'Bienvenido a ';
  mensaje: string = 'Accede a tu cuenta para registrar tu asistencia de manera fácil y rápida.';
  username: string = '';
  password: string = '';

  constructor(
    private animationCtrl: AnimationController,
    private alertCtrl: AlertController,
    private router: Router,
    private userService: UserService,
    private sessionService: SessionService
  ) {}

  ngAfterViewInit(): void {
    const element = document.querySelector('#animationTitle');
    if (!element) {
      console.log('No se encontró el elemento para animar');
      return;
    }

    this.animationCtrl
      .create()
      .addElement(element)
      .duration(3000)
      .fromTo('opacity', '1', '0.5')
      .fromTo('transform', 'translateX(0px)', 'translateX(100px)')
      .play(); // Asegúrate de llamar a play()
  }

  ngOnInit(): void {}

  async login(): Promise<void> {
    const user = this.userService.getUser(this.username);

    if (!user || user.password !== this.password) {
      const alert = await this.alertCtrl.create({
        header: 'Error de inicio de sesión',
        message: 'Nombre de usuario o contraseña incorrectos.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Establece la sesión y redirige
    this.sessionService.setUserSession(this.username);
    this.sessionService.loginUser();
    this.router.navigate(['/home']);
  }

  navigateTo(route: string) {
    if (this.router.url !== route) {
      this.router.navigate([route]);
    }
  }
}
