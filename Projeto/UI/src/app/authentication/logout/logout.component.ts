import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-logout',
    template: '',
    providers: [AuthService]
})

export class LogoutComponent {

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
