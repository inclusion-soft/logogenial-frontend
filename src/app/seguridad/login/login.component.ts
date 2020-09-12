import { Component, OnInit } from '@angular/core';
import {UserLogin} from '../models/user-login'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../../seguridad/services/auth.service';
import {TokenStorageService} from '../../seguridad/services/token-storage.service';
import {TokenResultData} from '../../seguridad/models/token-result-data';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Roles: any = ['Admin', 'Author', 'Reader'];
  userLogin: UserLogin = new UserLogin();
  loginForm!: FormGroup;
  hide = true;

  selected: any;
  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _tokenStorageService: TokenStorageService,
    private _router: Router,
    private snackBar: MatSnackBar
  ) {
    // this.userLogin.username = 'carlos.romero';
    // this.userLogin.password = 'carlos.romero';
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email   : [this.userLogin.username, [Validators.required]],
      password: [this.userLogin.password, Validators.required]
  });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  submit(): void {
    if (this.isValid()) {
      this.asignarForm();
        this._authService.attemptAuth(this.userLogin).subscribe( (r: TokenResultData) => {
            this._tokenStorageService.setDatosUsuario(r.token);
            this._router.navigate(['/']);
        }, err => {
            if ( err.status === 404 ) {

                this.openSnackBar('Usuario no encontrado', 'Cerrar', 'error-snackbar');
                // this.messageService.add({ key: 'cc', severity: 'error', summary: 'Acción inicio de sesión',
                // detail: 'Usuario o password incorrecto'});
            } else {
              let config = new MatSnackBarConfig();
                config.duration = 5000;
                config.panelClass = ['error-snackbar'];
              // this.snackBar.open("", null, {
              //   config
              // });
              //this.snackBar.open('Nombre de usuario o password incorrecto', '', config);

              this.openSnackBar('Nombre de usuario o password incorrecto', 'Cerrar', 'error-snackbar');
                // alert('Se ha presentado un error, por favor inténtelo nuevamente o consulte al administrador');
            }
        });
    }
}

openSnackBar(message: string, action: string, className: string) {
  this.snackBar.open(message, action, {
    duration: 2000,
    panelClass: [className]
  });
}

asignarForm(): void {
  // this.userLogin.username = this.loginForm.get('email') !== null ? this.loginForm.get('email').value() : '';
  // this.userLogin.password = this.loginForm.get('password')?.value();
}

isValid(): boolean {
  return this.loginForm.valid;
}

}
