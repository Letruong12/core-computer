import { Component, inject, Signal, signal, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/api-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None
})
export class App {
  protected readonly title = signal('core-computer');
  loading!: Signal<boolean>;
  constructor(private loader: LoadingService) {
    this.loading = this.loader.loading;
  }

  private service = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = this.service.IsLoggedIn;
  username = this.service.UserName;
  role = this.service.Role;

  logout() {
    this.service.logout();
    this.service.setLoginState(false, '', '');
    this.router.navigate(['/home']);
  }
}
