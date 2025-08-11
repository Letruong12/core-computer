import { Routes } from '@angular/router';
import { LoginComponent } from '../view/auth/login.component';
import { RegisterComponent } from '../view/auth/register.component';

export const authRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
];
