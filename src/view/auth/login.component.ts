import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/api-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [CommonModule, FormsModule],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
    email = '';
    password = '';
    error = '';

    private service = inject(AuthService);

    constructor(private auth: AuthService, private router: Router) {}

    login() {
        this.auth.login({ email: this.email, password: this.password }).subscribe({
            next: res => {
                var data = res;
                console.log(res);
                this.service.setLoginState(true, `${data.firstName} ${data.lastName}`, data.role);
                this.router.navigate(['/home'], { replaceUrl: true });
            },
            error: err => {
                console.log(err);
                this.error = 'Đăng nhập thất bại'
            }
        });
    }
}