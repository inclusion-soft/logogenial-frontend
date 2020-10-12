import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LECCIONES_CONSTANTS } from '../../lecciones/model/lecciones-constants-model';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { PreguntaModel } from '../model/pregunta-model';
import { PreguntaService } from '../service/pregunta.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { GeneralConfirmComponent } from '../../shared/components/general-confirm/general-confirm.component';
import { DatageniaModel } from 'app/admin/datagenia/models/datagenia-model';
import { ArchivoService } from 'app/admin/archivo/services/archivo.service';
import { DatageniaSelectComponent } from 'app/admin/datagenia/datagenia-select/datagenia-select.component';

@Component({
  selector: 'app-pregunta-edit',
  templateUrl: './pregunta-edit.component.html',
  styleUrls: ['./pregunta-edit.component.css']
})
export class PreguntaEditComponent  implements OnInit{
  pregunta: PreguntaModel;
  respuesta: DatageniaModel;
  form: FormGroup;
  submitted = false;
  disableSubmit = false;
  constants = LECCIONES_CONSTANTS;
  clone = {};
  constructor(private dialogRef: MatDialogRef<PreguntaEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: PreguntaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private archivoService: ArchivoService,
    @Inject(MAT_DIALOG_DATA) data: PreguntaModel) {
      this.pregunta = data;
    }

  ngOnInit(): void {
    if (this.pregunta.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.pregunta));
    }
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  initForm() {
   this.form = this.formBuilder.group({
    'id': [this.pregunta.id, null],
    'usuario': [this.pregunta.usuario, Validators.compose([Validators.required])],
    'activo': [this.pregunta.activo, Validators.compose([Validators.required])],
    'descripcion': [this.pregunta.descripcion, Validators.compose([Validators.required, Validators.maxLength(200)])],
    'usocompartido': [this.pregunta.usocompartido, Validators.compose([Validators.required])],
    'leccion': [this.pregunta.leccion, Validators.compose([Validators.required])],
    'datagenia': [this.pregunta.datagenia, Validators.compose([Validators.required])],
   });
  }

  seleccionarRespuesta() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = true;
    const dialogRef = this.dialog.open(DatageniaSelectComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val.id !== undefined) {
          this.respuesta = val;
        }
      }
    );
  }

  onChangeArchivo(archivoId: number) {
    if (archivoId > 0 ) {
      const datagenia =  { id : archivoId  };
      let form = this.form.get('datagenia') as any;
      form.setValue(datagenia);
    }
  }

  onSubmit() {
    this.submitted = true;
    // se actualizan las listas con el model
    this.pregunta = this.form.value;
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
    // this.pregunta.dificultad = Number(this.pregunta.dificultad);
    if (this.pregunta.id === 0) {
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
        Object.assign(this.pregunta, this.clone);
        this.dialogRef.close();
      }
    });
  }

}
