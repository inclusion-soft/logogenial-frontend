import { Component, OnInit, Inject } from '@angular/core';
import { UsuarioModel } from 'app/seguridad/models/usuario-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { UserService } from 'app/seguridad/services/user.service';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GrupoService } from 'app/admin/grupo/service/grupo.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { CONSTANTS_SHARED } from 'app/admin/shared/constants-shared';

@Component({
  selector: 'app-usuario-edit',
  templateUrl: './usuario-edit.component.html',
  styleUrls: ['./usuario-edit.component.css']
})
export class UsuarioEditComponent implements OnInit{
  roles: any = [];
  listaRoles: any = ['ADMINISTRADOR', 'TUTOR', 'ESTUDIANTE'];
  usuario: UsuarioModel;
  form: FormGroup;
  submitted = false;
  disableSubmit = false;
  constants = CONSTANTS_SHARED;
  filteredEstudiantes: Observable<UsuarioModel>;
  estudianteList: UsuarioModel[] = [];
  clone = {};
  constructor(private dialogRef: MatDialogRef<UsuarioEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private usuarioService: UserService,
    private grupoService: GrupoService,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.usuario = data.itemData;
    }

  ngOnInit(): void {
    this.initForm();
    if (this.usuario.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.usuario));
    }else {
      this.usuario.id = 0;
      this.usuario.avatar = 'av-1.png';
    }
  }

  initForm() {
    if(this.usuario === undefined || this.usuario === null) {
      this.usuario = new UsuarioModel();
    }
   this.form = this.formBuilder.group({
    'id': [null, null],
    'activo': [null, Validators.compose([Validators.required])],
    'nombre': [null, [Validators.required]],
    'apellido': [null, [Validators.required]],
    'email': [null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(150),
      Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')
    ]],
    'avatar': [null, [Validators.required]],
    'password': [null, [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(50),
      Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$')
    ]],
    'repetirPassword': [null, Validators.required],
    'roles': [null, Validators.required]
   });
   this.form.get('activo')!.setValue(this.usuario.activo);
   this.form.get('avatar')!.setValue(this.usuario.avatar);

  }


  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onChangeArchivo(archivoId: number) {
    if (archivoId > 0 ) {
      const datagenia =  { id : archivoId  };
      let form = this.form.get('datagenia') as any;
      form.setValue(datagenia);
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.usuario.password !== this.usuario.repetirPassword) {
      this.utilitiesService.simpleWarningMessage('La contraseña es distinta en cada campo', this.snackBar);
      return;
    }
    this.usuario.username = this.usuario.email;
    //this.form.get('activo')!.setValue(this.usuario.activo);

    this.markFormGroupTouched(this.form);
    // se actualizan las listas con el model
    this.usuario = this.form.value;
    // if (this.form.value.listatipopregunta !== undefined) {
    //   this.form.get('tipopregunta')!.setValue(this.form.value.listatipopregunta.id);
    // }
    if (this.form.valid === true) {
      // this.enviada = true;
      // this.disabledBtn_Login = true;
      this.save();
    } else {
      this.utilitiesService.formWarningMessage(this.snackBar);
    }
  }

  save() {
    if (this.usuario.id === 0) {
      this.servicio.register(this.form.value).subscribe(
        data => {
          this.dialogRef.close(this.form.value);
        },
        error => {
          this.disableSubmit = false;
          this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
        }
      );
    }
    this.servicio.update(this.form.value).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }


  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(GeneralConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe((val: any) => {
      if (val === 1) {
        Object.assign(this.usuario, this.clone);
        this.dialogRef.close();
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: FormGroup) => {
      control.markAsTouched();
      control.updateValueAndValidity();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  displayFnUser(user: UsuarioModel) {
    if (user) { return user.nombre; }
  }

}

