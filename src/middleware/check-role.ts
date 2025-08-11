import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/api-service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate{
    constructor(private auth: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRoles: string[] = route.data['role'];
        const user = this.auth.currentUser;

        if (!user) {
            this.router.navigate(['/login']);
            return false;
        }

        if (expectedRoles.length == 0 && !expectedRoles.includes(user.role)) {
            this.router.navigate(['/401']);
            return false;
        }

        return true;
    }
}