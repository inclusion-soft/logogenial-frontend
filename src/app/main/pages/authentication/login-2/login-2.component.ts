import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { UserLogin } from 'app/main/apps/seguridad/model/user-login';
import { AuthService } from 'app/main/apps/seguridad/services/auth.service';
import { TokenStorageService } from 'app/main/apps/seguridad/services/token-storage.service';
import { TokenResultData } from 'app/main/apps/seguridad/model/token-result-data';
import { Router } from '@angular/router';
import { Console } from 'console';

@Component({
    selector     : 'login-2',
    templateUrl  : './login-2.component.html',
    styleUrls    : ['./login-2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class Login2Component implements OnInit
{
    userLogin: UserLogin = new UserLogin();
    loginForm: FormGroup;
    

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _tokenStorageService: TokenStorageService,
        private _router: Router
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        this.userLogin.username = 'andres';
        this.userLogin.password = '12345';
        this.userLogin.grant_type = 'password';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }

    submit(): void {
        if (this.isValid()) {
            this._authService.attemptAuth(this.userLogin).subscribe( (r: TokenResultData) => {
                this._tokenStorageService.setTokenUser(r.token);
                this._tokenStorageService.setNameUser(r.nombre + ' ' + r.apellido);
                this._tokenStorageService.setEmail(r.email);
                this._router.navigate(['/']);
            }, err => {
                if ( err.status === 404 ) {
                    alert('Usuario no encontrado');
                    // this.messageService.add({ key: 'cc', severity: 'error', summary: 'Acción inicio de sesión',
                    // detail: 'Usuario o password incorrecto'});
                } else {
                    console.log('Se ha presentado un error, por favor inténtelo nuevamente o consulte al administrador');
                    // alert('Se ha presentado un error, por favor inténtelo nuevamente o consulte al administrador');
                }
            });
        }
    }

    isValid(): boolean {
        return true;
    }
}
