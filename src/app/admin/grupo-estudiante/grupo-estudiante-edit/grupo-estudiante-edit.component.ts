import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { GRUPO_ESTUDIANTE_CONSTANTS } from '../model/grupo-estudiante-constant';
import { GrupoEstudianteService } from '../service/grupo-estudiante.service';
import { GrupoEstudianteModel } from '../model/grupo-estudiante-model';
import { GrupoModel } from 'app/admin/grupo/model/grupo-model';
import { UsuarioModel } from 'app/seguridad/models/usuario-model';
import { Observable } from 'rxjs';
import { UserService } from 'app/seguridad/services/user.service';
import { GrupoService } from 'app/admin/grupo/service/grupo.service';

@Component({
  selector: 'app-grupo-estudiante-edit',
  templateUrl: './grupo-estudiante-edit.component.html',
  styleUrls: ['./grupo-estudiante-edit.component.css']
})
export class GrupoEstudianteEditComponent implements OnInit{
  grupoEstudiante: GrupoEstudianteModel;
  form: FormGroup;
  submitted = false;
  disableSubmit = false;
  constants = GRUPO_ESTUDIANTE_CONSTANTS;
  filteredEstudiantes: Observable<UsuarioModel>;
  estudianteList: UsuarioModel[] = [];
  docenteList: UsuarioModel[] = [];
  grupoList: GrupoModel[] = [];
  clone = {};
  constructor(private dialogRef: MatDialogRef<GrupoEstudianteEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: GrupoEstudianteService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    private usuarioService: UserService,
    private grupoService: GrupoService,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.grupoEstudiante = data.itemData;
    }

  ngOnInit(): void {
    this.initForm();
    this.cargarEstudiantes();
    this.cargarDocentes();
    if (this.grupoEstudiante.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.grupoEstudiante));
      this.cargarDocentes();
      this.cargarEstudiantes();
    }
  }

  initForm() {
    if(this.grupoEstudiante === undefined || this.grupoEstudiante === null) {
      this.grupoEstudiante = new GrupoEstudianteModel();
    }
   this.form = this.formBuilder.group({
    'id': [null, null],
    'activo': [null, Validators.compose([Validators.required])],
    'grupo': [null, Validators.compose([Validators.required])],
    'usuarioestudiante': [null, Validators.compose([Validators.required])],
    'docente': [null, Validators.compose([Validators.required])],
   });
   this.form.get('activo')!.setValue(this.grupoEstudiante.activo);
  }

  cargarEstudiantes() {
    this.usuarioService.findAllEstudiantes().subscribe( (estudiantes: any[]) => {
      this.estudianteList = estudiantes;
      if(this.grupoEstudiante.id > 0) {
        const toSelect = estudiantes.find(c => c.id === this.grupoEstudiante.usuarioestudiante.id);
        this.form.get('usuarioestudiante')!.setValue(toSelect);
      }
    }, err => { this.utilitiesService.simpleWarningMessage('Error consultando estudiantes', this.snackBar) });
  }

  cargarDocentes() {
    this.usuarioService.findAllDocentes().subscribe( (docentes: any[]) => {
      this.docenteList = docentes;
      if(this.grupoEstudiante.id > 0) {
        const toSelect = docentes.find(c => c.id === this.grupoEstudiante.grupo.usuario.id);
        this.form.get('docente')!.setValue(toSelect);
        this.cargarGruposPorDocente(this.grupoEstudiante.grupo.usuario.id);
      }
    }, err => { this.utilitiesService.simpleWarningMessage('Error consultando docente', this.snackBar) });
  }

  docenteSeleccionadoEvent(event: any) {
    this.cargarGruposPorDocente(event.value.id);
  }

  cargarGruposPorDocente(docenteId: number) {
    this.grupoService.findAllByDocenteId(docenteId).subscribe( (grupos: any[]) => {
      this.grupoList = grupos;
      if(this.grupoEstudiante.id > 0) {
        const toSelect = grupos.find(c => c.id === this.grupoEstudiante.grupo.id);
        this.form.get('grupo')!.setValue(toSelect);
      }
    }, err => {});
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
    this.markFormGroupTouched(this.form);
    // se actualizan las listas con el model
    this.grupoEstudiante = this.form.value;
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
    if (this.grupoEstudiante.id === 0) {
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
        Object.assign(this.grupoEstudiante, this.clone);
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
