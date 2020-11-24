import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CONSTANT_DATAGENIA } from '../models/CONSTANT_DATAGENIA';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { DatageniaModel } from '../models/datagenia-model';
import { DatageniaService } from '../services/datagenia.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { GeneralConfirmComponent } from '../../shared/components/general-confirm/general-confirm.component';

@Component({
  selector: 'app-datagenia-edit',
  templateUrl: './datagenia-edit.component.html',
  styleUrls: ['./datagenia-edit.component.css']
})
export class DatageniaEditComponent implements OnInit{
  datagenia: DatageniaModel;
  form: FormGroup;
  submitted = false;
  disableSubmit = false;
  constants = CONSTANT_DATAGENIA;
  clone = {};
  constructor(private dialogRef: MatDialogRef<DatageniaEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: DatageniaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: DatageniaModel) {
      this.datagenia = data;
    }

  ngOnInit(): void {
    if (this.datagenia.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.datagenia));
    }
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  initForm() {
   this.form = this.formBuilder.group({
    'id': [this.datagenia.id, null],
    'archivoId': [this.datagenia.archivoId, Validators.compose([Validators.required])],
    'activo': [this.datagenia.activo, Validators.compose([Validators.required])],
    'nombre': [this.datagenia.nombre, Validators.compose([Validators.required, Validators.maxLength(50)])],
    'frase': [this.datagenia.frase, Validators.compose([Validators.required, Validators.maxLength(500)])],
    'compartido': [this.datagenia.compartido, Validators.compose([Validators.required])],
    'dificultad': [this.datagenia.dificultad, Validators.compose([Validators.max(9), Validators.pattern('[0-9]*')])],
   });
  }

  onChangeArchivo(archivoId: number) {
    if (archivoId > 0 ) {
      let form = this.form.get('archivoId') as any;
      form.setValue(archivoId);
    }
  }

  onSubmit() {
    this.submitted = true;
    // se actualizan las listas con el model
    this.datagenia = this.form.value;
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
    this.datagenia.usuarioCreadorId = 1;
    // this.datagenia.dificultad = Number(this.datagenia.dificultad);
    if (this.datagenia.id === 0) {
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
        Object.assign(this.datagenia, this.clone);
        this.dialogRef.close();
      }
    });
  }

}
