import { Component, OnInit, Inject } from '@angular/core';
import { GrupoModel } from '../model/grupo-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { GrupoService } from '../service/grupo.service';
import { GRUPO_CONSTANTS } from '../model/grupo-constants';
import { Menu } from 'app/shared/menu-items/menu-items';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';

@Component({
  selector: 'app-grupo-edit',
  templateUrl: './grupo-edit.component.html',
  styleUrls: ['./grupo-edit.component.css']
})
export class GrupoEditComponent implements OnInit {
  grupo: GrupoModel;
  form: FormGroup;
  submitted = false;
  constants = GRUPO_CONSTANTS;
  clone = {};
  disableSubmit: boolean = false;
  constructor(private dialogRef: MatDialogRef<GrupoEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: GrupoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: GrupoModel) {
      this.grupo = data;
    }

  ngOnInit(): void {
    if(this.grupo.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.grupo));
    }
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  initForm() {
   this.form = this.formBuilder.group({
    'id': [this.grupo.id, null],
    'activo': [this.grupo.activo, Validators.compose([Validators.required])],
    'nombre': [this.grupo.nombre, Validators.compose([Validators.required, Validators.maxLength(30)])],
    'anio': [this.grupo.anio, Validators.compose([Validators.max(2050), Validators.pattern('[0-9]*')])],
   });
  }

  onSubmit() {
    this.submitted = true;
    // se actualizan las listas con el model
    this.grupo = this.form.value;
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
    if (this.grupo.id === 0) {
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
        Object.assign(this.grupo, this.clone);
        this.dialogRef.close();
      }
    });
  }

}
