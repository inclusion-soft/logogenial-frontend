import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LECCIONES_CONSTANTS } from '../../lecciones/model/lecciones-constants-model';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { OpcionRespuestaModel } from '../model/opcion-respuesta-model';
import { OpcionRespuestaService } from '../service/opcion-respuesta.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { GeneralConfirmComponent } from '../../shared/components/general-confirm/general-confirm.component';
import { DatageniaModel } from 'app/admin/datagenia/models/datagenia-model';
import { ArchivoService } from 'app/admin/archivo/services/archivo.service';
import { DatageniaSelectComponent } from 'app/admin/datagenia/datagenia-select/datagenia-select.component';
import { LeccionModel } from 'app/admin/lecciones/model/leccion-model';
import { PreguntaModel } from 'app/admin/preguntas/model/pregunta-model';

@Component({
  selector: 'app-opcion-respuesta-edit',
  templateUrl: './opcion-respuesta-edit.component.html',
  styleUrls: ['./opcion-respuesta-edit.component.css']
})
export class OpcionRespuestaEditComponent implements OnInit {
  opcionRespuesta: OpcionRespuestaModel;
  pregunta: PreguntaModel;
  opcionSeleccionada: DatageniaModel;
  form: FormGroup;
  submitted = false;
  disableSubmit = false;
  constants = LECCIONES_CONSTANTS;
  clone = {};
  constructor(private dialogRef: MatDialogRef<OpcionRespuestaEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: OpcionRespuestaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private archivoService: ArchivoService,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.opcionRespuesta = data.itemOpcion;
      this.pregunta = data.itemPregunta;
    }

  ngOnInit(): void {
    this.initForm();
    if (this.opcionRespuesta.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.opcionRespuesta));
      this.pregunta = this.opcionRespuesta.pregunta;
      //this.opcionSeleccionada = this.opcionRespuesta.opcion;
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  initForm() {
   this.form = this.formBuilder.group({
    'id': [this.opcionRespuesta.id, null],
    'activo': [this.opcionRespuesta.activo, Validators.compose([Validators.required])],
    'fraseRespuesta': [this.opcionRespuesta.fraseRespuesta, Validators.compose([Validators.required, Validators.maxLength(200)])],
    'orden': [null, Validators.nullValidator],
    'opcion': [null, Validators.compose([Validators.required])],
    'pregunta': [this.opcionRespuesta.pregunta, Validators.compose([Validators.required])],
   });
  }

  getUrlBase(): string {
    return this.archivoService.getUrlBase();
  }

  seleccionarOpcion() {
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
          this.opcionRespuesta.opcion = val;
          this.opcionRespuesta.fraseRespuesta = val.frase;
          this.opcionSeleccionada = val;
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
    this.opcionRespuesta = this.form.value;
    //this.form.get('tipoopcionRespuesta')!.setValue(this.form.value.listatipoopcionRespuesta.id);
    if (this.form.valid === true) {
      this.save();
    } else {
      this.utilitiesService.formWarningMessage(this.snackBar);
    }
  }

  save() {
    if (this.opcionRespuesta.id === 0) {
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
        Object.assign(this.opcionRespuesta, this.clone);
        this.dialogRef.close();
      }
    });
  }

}
