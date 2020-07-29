import { Component, OnInit, Inject } from '@angular/core';
import { NivelModel } from '../nivel/models/nivel-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { NivelService } from '../nivel-list/service/nivel.service';
import { NIVELCONSTANTS } from '../nivel/models/nivel-constants';
import { UtilitiesService } from '../shared/services/utilities.service';
import { Menu } from 'app/shared/menu-items/menu-items';
import { GeneralConfirmComponent } from '../shared/components/general-confirm/general-confirm.component';

@Component({
  selector: 'app-nivel-edit',
  templateUrl: './nivel-edit.component.html',
  styleUrls: ['./nivel-edit.component.css']
})
export class NivelEditComponent implements OnInit {
  nivel: NivelModel;
  form: FormGroup;
  submitted = false;
  disableSubmit = false;
  constants = NIVELCONSTANTS;
  clone = {};
  constructor(private dialogRef: MatDialogRef<NivelEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: NivelService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: NivelModel) {
      this.nivel = data;
    }

  ngOnInit(): void {
    if(this.nivel.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.nivel));
    }
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  initForm() {
   this.form = this.formBuilder.group({
    'id': [this.nivel.id, null],
    'activo': [this.nivel.activo, Validators.compose([Validators.required])],
    'nombre': [this.nivel.nombre, Validators.compose([Validators.required, Validators.maxLength(30)])],
    'dificultad': [this.nivel.dificultad, Validators.compose([Validators.max(9), Validators.pattern('[0-9]*')])],
   });
  }

  onSubmit() {
    this.submitted = true;
    // se actualizan las listas con el model
    this.nivel = this.form.value;
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
    //this.nivel.dificultad = Number(this.nivel.dificultad);
    if (this.nivel.id === 0) {
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
        Object.assign(this.nivel, this.clone);
        this.dialogRef.close();
      }
    });
  }

}
