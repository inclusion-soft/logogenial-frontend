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
import { LeccionModel } from 'app/admin/lecciones/model/leccion-model';
import { UsuarioModel } from 'app/seguridad/models/usuario-model';

@Component({
  selector: 'app-pregunta-edit',
  templateUrl: './pregunta-edit.component.html',
  styleUrls: ['./pregunta-edit.component.css']
})
export class PreguntaEditComponent  implements OnInit{
  pregunta: PreguntaModel;
  respuesta: DatageniaModel;
  leccion: LeccionModel;
  form: FormGroup;
  submitted = false;
  disableSubmit = false;
  constants = LECCIONES_CONSTANTS;
  clone = {};
  tipoPregunta = [
    {id: 1, nombre: 'Tipo 1: multiple respuesta'},
    {id: 2, nombre: 'Tipo 2: relación'},
  ];
  constructor(private dialogRef: MatDialogRef<PreguntaEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: PreguntaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private archivoService: ArchivoService,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.pregunta = data.itemPregunta;
      this.leccion = data.itemLeccion;
      //this.pregunta.usuario.id = 1;
    }

  ngOnInit(): void {
    this.initForm();
    if (this.pregunta.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.pregunta));
      this.respuesta = this.pregunta.respuesta;
      const toSelect = this.tipoPregunta.find(c => c.id === this.pregunta.tipopregunta);
      this.form.get('listatipopregunta')!.setValue(toSelect);
      this.form.get('usuario')!.setValue({ id: 1});
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  initForm() {
   this.form = this.formBuilder.group({
    'id': [this.pregunta.id, null],
    'usuario': [this.pregunta.usuario, Validators.compose([Validators.required])],
    'activo': [this.pregunta.activo, Validators.compose([Validators.required])],
    'fraseRespuesta': [this.pregunta.fraseRespuesta, Validators.compose([Validators.required, Validators.maxLength(200)])],
    'tipopregunta': [null, Validators.compose([Validators.required])],
    'listatipopregunta': [null, Validators.compose([Validators.required])],
    'enumeracion': [null, Validators.compose([Validators.max(30), Validators.pattern('[0-9]*')])],
    'leccion': [this.pregunta.leccion, Validators.compose([Validators.required])],
    'respuesta': [this.pregunta.respuesta, null],
    'respuestaid': [null, Validators.compose([Validators.min(1)])],
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
          this.pregunta.respuesta = val;
          this.pregunta.fraseRespuesta = val.frase;
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
    this.markFormGroupTouched(this.form);
    // se actualizan las listas con el model
    this.pregunta = this.form.value;
    if (this.form.value.listatipopregunta !== undefined) {
      this.form.get('tipopregunta')!.setValue(this.form.value.listatipopregunta.id);
    }
    if (this.form.valid === true) {
      // this.enviada = true;
      // this.disabledBtn_Login = true;
      this.save();
    } else {
      this.utilitiesService.formWarningMessage(this.snackBar);
    }
  }

  save() {
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
