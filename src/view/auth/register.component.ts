import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/api-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    imports: [CommonModule, FormsModule],
    encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
    registerDto = {
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        confirmPassword: null            
    };
    error = '';
    private service = inject(AuthService);

    constructor(private auth: AuthService, private router: Router) { }

    login() {
        this.auth.register(this.registerDto).subscribe({
            next: res => {
                console.log(res);
                this.router.navigate(['/login'], { replaceUrl: true });
            },
            error: err => {
                console.log(err);
                this.error = 'Đăng ký thất bại'
            }
        });
    }

    goToUrl(url: string) {
        if (!url) {
            this.router.navigate(['/home']);
        }
        this.router.navigate([`/${url}`]);
    }
}