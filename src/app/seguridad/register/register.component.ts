import { Component, OnInit } from '@angular/core';
import {UsuarioModel} from 'app/seguridad/models/usuario-model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { AuthService } from '../services/auth.service';
import { TokenResultData } from '../models/token-result-data';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  Roles: any = [];
  ListaRoles: any = ['ADMINISTRADOR', 'TUTOR', 'ESTUDIANTE'];
  selected: string;
  status = 'editando';
  constructor(
    private _formBuilder: FormBuilder,
    private service: UserService,
    private _authService: AuthService,
    private _tokenStorageService: TokenStorageService,
    private _router: Router,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService
  ) { }

  userLogin: UsuarioModel = new UsuarioModel();
  registerForm!: FormGroup;
  submitted = false;
  url = 'https://www.positronx.io';
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      nombre   : [this.userLogin.username, [Validators.required]],
      apellido   : [this.userLogin.username, [Validators.required]],
      email   : [this.userLogin.username, [Validators.required]],
      password: [this.userLogin.password, Validators.required],
      repetirPassword: [this.userLogin.repetirPassword, Validators.required],
      rol: [null, Validators.required]
  });
  }

  submit(): void {
    if (this.userLogin.password !== this.userLogin.repetirPassword) {
      this.utilitiesService.simpleWarningMessage('La contraseña es distinta en cada campo', this.snackBar);
      return;
    }

    this.userLogin.username = this.userLogin.email;
    if (this.registerForm.valid) {
      //this.submitted = true;
      this.userLogin.roles = [];
      const rol =  {
        id: 0,
        nombre: this.selected
      };
      this.userLogin.roles.push(rol);
      this.service.register(this.userLogin).subscribe(
        data => {
          this.status = 'finalizado';
          // Realiza login usuario
          // this._authService.attemptAuth(this.userLogin).subscribe(
          //   (r: TokenResultData) => {
          //     this._tokenStorageService.setDatosUsuario(r.token);
          //     this._router.navigate(['/']);
          //   }, err => {
          //     this.utilitiesService.formErrorMessages(err, this.registerForm, this.snackBar);
          //  });

        },
        error => {
          this.submitted = false;
          this.utilitiesService.formErrorMessages(error, this.registerForm, this.snackBar);
        }
      );
    }
  }

  clicGoLogin() {
    this._router.navigate(['/login']);
  }

}
