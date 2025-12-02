import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService, UsuarioDTO } from '../../core/user.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  nome = '';
  email = '';
  senha = '';
  cpf = '';
  error = '';
  loading = false;
  success = false;

  constructor(public router: Router, private userService: UserService, public auth: AuthService) {}
  isLoggedIn(): boolean {
    return !!this.auth.getToken();
  }

  onSubmit() {
    this.error = '';
    this.success = false;
    this.loading = true;
    const usuario: UsuarioDTO = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      cpf: this.cpf,
      contasIds: [],
      centrosCustoIds: []
    };
    this.userService.register(usuario).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        if (err?.error && typeof err.error === 'string') {
          this.error = err.error;
        } else if (err?.status === 0) {
          this.error = 'Não foi possível conectar ao servidor.';
        } else {
          this.error = 'Erro ao registrar usuário.';
        }
      }
    });
  }
}