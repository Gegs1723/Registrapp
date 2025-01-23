import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { LocalStorageService } from './local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  usuarios: User[]= []

  constructor(
    private localStorageService: LocalStorageService
  ) { 
    this.usuarios = this.localStorageService.getItem('usuarios') || [];
  }

  //llamar 
  getUsers(): User[]{ 
    return this.usuarios;
  }

  //buscar
  getUaser(usua: string): User | undefined{
    return this.usuarios.find(usuario => usuario.username === usua);
  }

  //agregar
  addUser(nombre: string, corre: string, ru: string, carre: string, ususa: string, pass: string, cpass: string): void{
    this.usuarios.push({nombreCompleto: nombre, correo: corre, rut: ru, carrera: carre, username: ususa, password: pass, confirmPassword: cpass})
   
    
    

    this.localStorageService.setItem('usuarios', this.usuarios);
  }


}
