

import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkWithHref, NgIf],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  constructor(public router: Router, public auth: AuthService) {}

  goTo(path: string) {
    this.router.navigate([path]);
  }

  isLoggedIn(): boolean {
    return !!this.auth.getToken();
  }

  logout() {
    this.auth.logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}