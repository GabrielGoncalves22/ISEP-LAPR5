import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { catchError, of, tap } from "rxjs";
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [AuthService]
})

export class LoginComponent {

    email: string = "";

    password: string = "";

    withFacebook: boolean = false;

    showPassword: boolean = false;

    error: Error | String | null = null;

    success: String | null = null;

    constructor(private authService: AuthService, private router: Router, private socialAuthService: SocialAuthService) { }

    login() {
        this.authService.login(this.email, this.password, this.withFacebook).pipe(
            tap({
                error: (error) => {
                    this.error = error.message;
                    this.success = null;
                }
            }),
            catchError(
                err => of(null)
            )
        ).subscribe(
            () => {
                this.router.navigate(['/home']);
            }
        );
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    signInWithFacebook() {
        this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
            .then((user) => {
                if (user && user.email) {
                    this.email = user.email;
                    this.withFacebook = true;
                    this.login();
                }
            })
            .catch((error) => {
                this.error = error;
            });
    }
}
