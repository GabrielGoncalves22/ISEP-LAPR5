import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './authentication/auth.service';

@Injectable({
    providedIn: 'root'
})

export class VerifyAuthService {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        // Verificar se o utilizador está autenticado
        if (this.authService.getUser()) {
            // Verificar se o utilizador tem permissão para aceder à rota
            const allowedRoles = (route.data as any)['roles'] as Array<string>;

            if (allowedRoles && allowedRoles.length > 0) {
                // Obter a role do utilizador
                const userRole = this.authService.getRole();

                // Verificar se a role do utilizador está entre as roles permitidas
                if (userRole && allowedRoles.includes(userRole)) {
                    return true;
                } else {
                    // O utilizador não tem permissão, redirecionar para a página anterior
                    this.router.navigate(['/']);
                }
            } else {
                return true;
            }

        } else {
            // Não está autenticado, redirecionar para a página de login
            this.router.navigate(['/login']);
        }

        return false;
    }
}
