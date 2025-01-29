import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usuarios: User[] = [];

  constructor(private localStorageService: LocalStorageService) { 
    this.usuarios = this.localStorageService.get('usuarios') || [];
  }

  getUsers(): User[] { 
    return this.usuarios;
  }

  getUser(username: string): User | undefined {
    return this.usuarios.find(usuario => usuario.username === username);
  }

  addUser(user: User): void {
    this.usuarios.push(user);
    this.localStorageService.save('usuarios', this.usuarios);
  }

  updateUser(user: User): void {
    const userIndex = this.usuarios.findIndex(u => u.username === user.username);
    if (userIndex !== -1) {
      this.usuarios[userIndex] = user;
      this.localStorageService.save('usuarios', this.usuarios);
    }
  }
}