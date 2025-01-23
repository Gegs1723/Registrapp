import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController, ToastController } from '@ionic/angular';
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
  bienve: string = 'Bienvenido';
  mensaje: string = 'Accede a tu cuenta para registrar tu asistencia de manera fácil y rápida.';
  usuario!: string;
  pass!: string;
  loginErrorMessage!: string;

  constructor(
    private animationCtrl: AnimationController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private userService: UserService,
    private sessionService: SessionService
  ) { }

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
      //.play()
  }

  ngOnInit() {
  }

  async login() {
    console.log(`El usuario es ${this.usuario}`);
    console.log(`La contraseña es ${this.pass}`);

    const users = this.userService.getUsers();
    const user = users.find(u => u.username === this.usuario);

    let pwdValid = false;

    if (user !== undefined) {
      pwdValid = user.password === this.pass;
    }

    const loginSuccess = user !== undefined && pwdValid;

    if (loginSuccess) {
      console.log('Login exitoso');
      this.sessionService.setUserSession(this.usuario);
      this.router.navigateByUrl('/home');
    } else {
      console.log('Login fallido');
      this.loginErrorMessage = 'Login fallido';
      const alert = await this.alertCtrl.create({
        header: 'Error de login',
        message: 'usuario o contraseña incorrectos',
        buttons: ['ok']
      });
      alert.present();

      const toastPromise = this.toastCtrl.create({
        header: 'Error de login',
        message: 'Login fallido',
        duration: 2000,
      });

      toastPromise.then(toast => toast.present());
    }
  }
}
