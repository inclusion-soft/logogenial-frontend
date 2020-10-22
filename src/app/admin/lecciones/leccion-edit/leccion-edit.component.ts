import { Component, OnInit, Inject } from '@angular/core';
import { LeccionModel } from '../model/leccion-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { LeccionService } from '../service/leccion.service';
import { LECCIONES_CONSTANTS } from '../model/lecciones-constants-model';
import { Menu } from 'app/shared/menu-items/menu-items';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';


@Component({
  selector: 'app-leccion-edit',
  templateUrl: './leccion-edit.component.html',
  styleUrls: ['./leccion-edit.component.css']
})
export class LeccionEditComponent implements OnInit {
  leccion: LeccionModel;
  form: FormGroup;
  submitted = false;
  constants = LECCIONES_CONSTANTS;
  clone = {};
  disableSubmit: boolean = false;
  constructor(private dialogRef: MatDialogRef<LeccionEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: LeccionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.leccion = data.itemData;
    }

  ngOnInit(): void {
    if(this.leccion.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.leccion));
    }
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  initForm() {
   this.form = this.formBuilder.group({
    'id': [this.leccion.id, null],
    'activo': [this.leccion.activo, Validators.compose([Validators.required])],
    'leyenda': [this.leccion.leyenda, Validators.compose([Validators.required, Validators.maxLength(100)])],
    'enumeracion': [this.leccion.enumeracion, Validators.compose([Validators.max(30), Validators.pattern('[0-9]*')])],
    'puntos': [this.leccion.enumeracion, Validators.compose([Validators.max(10000), Validators.pattern('[0-9]*')])],
    'grupoNivelTema': [this.leccion.grupoNivelTema, null],
   });
  }

  onSubmit() {
    this.submitted = true;
    this.markFormGroupTouched(this.form);
    // se actualizan las listas con el model
    this.leccion = this.form.value;
    // this.form.value.permiso = this.menu.permiso;
    // this.form.value.parent = this.menu.parent;
    if (this.form.valid === true) {
      // this.enviada = true;
      // this.disabledBtn_Login = true;
      this.save();
    } else {
      this.utilitiesService.formWarningMessage(this.snackBar);
    }
  }

  save() {
    this.disableSubmit = true;
    if (this.leccion.id === 0) {
      this.servicio.create(this.form.value).subscribe(
        data => {
          this.disableSubmit = false;
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
        Object.assign(this.leccion, this.clone);
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

}
