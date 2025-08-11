import { Routes } from '@angular/router';
import { HomeComponent } from '../view/home/home';
import { adminRoutes } from '../routes/admin.routes';
import { viewRoutes } from '../routes/view.routes';
import { authRoutes } from '../routes/auth.routes';

export const routes: Routes = [
    ...adminRoutes,
    ...viewRoutes,
    ...authRoutes,
    { path: '', component: HomeComponent }
];
