import { Component, OnInit } from '@angular/core';
import { FacebookLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { catchError, of, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { FormDataHandlerService } from 'src/app/form.data.handler.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    providers: [AuthService, FormDataHandlerService]
})

export class RegisterComponent implements OnInit {

    user: User = {
        name: '',
        email: '',
        password: '',
        telephone: '',
        taxPayerNumber: ''
    };

    repeatPassword: string = '';

    consent: Boolean = false;

    error: Error | String | null = null;

    success: String | null = null;

    showFacebookButton = true;

    readonly itemName: string = "userAccountRegister";

    constructor(private authService: AuthService, private socialAuthService: SocialAuthService, private formDataHandlerService: FormDataHandlerService) { }

    ngOnInit(): void {
        this.user = this.formDataHandlerService.loadSavedData(this.itemName, this.user);
    }

    register() {
        if (this.passwordsMatch()) {
            if (!this.consent) {
                this.error = 'It is not possible to continue registration without accepting the collection and processing of your personal data!';
            } else {
                this.authService.register(this.user).pipe(
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
                    (response) => {
                        if (response) {
                            this.error = null;
                            this.success = 'Your account has been registered successfully, wait for approval from an administrator!';
                            this.user = {
                                name: '',
                                email: '',
                                password: '',
                                telephone: '',
                                taxPayerNumber: ''
                            };

                            this.repeatPassword = "";
                            this.consent = false;

                            this.formDataHandlerService.destroySavedData(this.itemName);
                        }
                    }
                );
            }
        }
    }

    passwordsMatch(): boolean {
        if (this.user.password === this.repeatPassword) {
            this.error = null;
            return true;
        } else {
            this.error = 'Passwords do not match!';
            return false;
        }
    }

    registerWithFacebook() {
        this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
            .then((user) => {
                if (user) {
                    if (user.name) {
                        this.user.name = user.name;
                    }

                    if (user.email) {
                        this.user.email = user.email;
                    }

                    this.error = null;
                    this.showFacebookButton = false;
                }
            })
            .catch((error) => {
                this.error = error;
            });
    }

    saveData() {
        this.formDataHandlerService.saveData(this.itemName, this.user);
    }
}
