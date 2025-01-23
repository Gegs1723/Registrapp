import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./page/home/home.module').then(m => m.HomePageModule),  },
  { path: 'perfil', loadChildren: () => import('./page/perfil/perfil.module').then(m => m.PerfilPageModule),  },
  { path: 'login', loadChildren: () => import('./page/login/login.module').then(m => m.LoginPageModule) },
  { path: 'registro', loadChildren: () => import('./page/registro/registro.module').then(m => m.RegistroPageModule) },
  { path: 'escanear', loadChildren: () => import('./page/escanear/escanear.module').then(m => m.EscanearPageModule), },
  { path: 'logout', loadChildren: () => import('./page/logout/logout.module').then(m => m.LogoutPageModule) },
  { path: 'historial', loadChildren: () => import('./page/historial/historial.module').then(m => m.HistorialPageModule) },
  { path: '**', loadChildren: () => import('./page/page-not-found/page-not-found.module').then(m => m.PageNotFoundPageModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
