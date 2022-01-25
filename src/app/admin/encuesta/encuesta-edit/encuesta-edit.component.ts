import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { CONSTANTS_SHARED } from 'app/admin/shared/constants-shared';
import { MarcaModel } from '../model/marca-model';
import { EncuestaModel } from '../model/encuesta-model';
import { EncuestaService } from '../service/encuesta.service';

@Component({
  selector: 'app-encuesta-edit',
  templateUrl: './encuesta-edit.component.html',
  styleUrls: ['./encuesta-edit.component.css']
})
export class EncuestaEditComponent implements OnInit{
  roles: any = [];
  listaRoles: any = ['ADMINISTRADOR', 'TUTOR', 'ESTUDIANTE'];
  encuesta: EncuestaModel;
  form: FormGroup;
  submitted = false;
  disableSubmit = false;
  constants = CONSTANTS_SHARED;
  marcaList: MarcaModel[] = [];
  marcaListFiltered: MarcaModel[] = this.marcaList;
  // filteredEstudiantes: Observable<EncuestaModel>;
  // estudianteList: EncuestaModel[] = [];
  clone = {};
  constructor(private dialogRef: MatDialogRef<EncuestaEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: EncuestaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.encuesta = data.itemData;
      this.marcaList = data.marcaList;
      this.marcaListFiltered = this.marcaList.slice();
    }

  ngOnInit(): void {
    this.initForm();
    if (this.encuesta.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.encuesta));
    }else {
      this.encuesta.id = 0;
      /* this.encuesta.avatar = 'av-1.png'; */
    }
  }

  initForm() {
    if(this.encuesta === undefined || this.encuesta === null) {
      this.encuesta = new EncuestaModel();
    }
   this.form = this.formBuilder.group({
    'id': [null, null],
    'activo': [null, Validators.compose([Validators.required])],
    'numeroDocumento': [null, [Validators.required]],
    'comentarios': [null, [Validators.required]],
    'marca': [null, [Validators.required]],
    'email': [null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(150),
      Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')
      ]]
    });
   this.form.get('activo')!.setValue(this.encuesta.activo);

  }


  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    this.markFormGroupTouched(this.form);
    // se actualizan las listas con el model
    this.encuesta = this.form.value;
    if (this.form.valid === true) {
      this.save();
    } else {
      this.utilitiesService.formWarningMessage(this.snackBar);
    }
  }

  save() {
    if (this.encuesta.id === 0) {
      this.servicio.create(this.form.value).subscribe(
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
        Object.assign(this.encuesta, this.clone);
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

  // displayFnUser(user: EncuestaModel) {
  //   if (user) { return user.nombre; }
  // }

}
