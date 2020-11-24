import { Component, OnInit, Inject } from '@angular/core';
import { TemaModel } from '../models/tema-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { TemaService } from '../services/tema.service';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { TEMACONSTANTS } from '../models/tema-constants';

@Component({
  selector: 'app-tema-edit',
  templateUrl: './tema-edit.component.html',
  styleUrls: ['./tema-edit.component.css']
})
export class TemaEditComponent implements OnInit {
  tema: TemaModel;
  form: FormGroup;
  submitted = false;
  disableSubmit = false;
  constants = TEMACONSTANTS;
  clone = {};
  constructor(private dialogRef: MatDialogRef<TemaEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: TemaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: TemaModel) {
      this.tema = data;
    }

  ngOnInit(): void {
    if(this.tema.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.tema));
    }
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  initForm() {
   this.form = this.formBuilder.group({
    'id': [this.tema.id, null],
    'activo': [this.tema.activo, Validators.compose([Validators.required])],
    'nombre': [this.tema.nombre, Validators.compose([Validators.required, Validators.maxLength(30)])],
   });
  }

  onSubmit() {
    this.submitted = true;
    // se actualizan las listas con el model
    this.tema = this.form.value;
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
    //this.tema.dificultad = Number(this.tema.dificultad);
    if (this.tema.id === 0) {
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
        Object.assign(this.tema, this.clone);
        this.dialogRef.close();
      }
    });
  }

}
