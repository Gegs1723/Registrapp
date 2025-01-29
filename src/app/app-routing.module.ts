import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Asegúrate de que la ruta sea correcta

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./page/home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard] },
  { path: 'perfil', loadChildren: () => import('./page/perfil/perfil.module').then(m => m.PerfilPageModule), canActivate: [AuthGuard] },
  { path: 'escanear', loadChildren: () => import('./page/escanear/escanear.module').then(m => m.EscanearPageModule), canActivate: [AuthGuard] },
  { path: 'historial', loadChildren: () => import('./page/historial/historial.module').then(m => m.HistorialPageModule), canActivate: [AuthGuard] },
  { path: 'login', loadChildren: () => import('./page/login/login.module').then(m => m.LoginPageModule) },
  { path: 'registro', loadChildren: () => import('./page/registro/registro.module').then(m => m.RegistroPageModule) },
  { path: 'logout', loadChildren: () => import('./page/logout/logout.module').then(m => m.LogoutPageModule) },
  { path: 'recuperar', loadChildren: () => import('./page/recuperar/recuperar.module').then(m => m.RecuperarPageModule) },
  { path: '**', loadChildren: () => import('./page/page-not-found/page-not-found.module').then(m => m.PageNotFoundPageModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }