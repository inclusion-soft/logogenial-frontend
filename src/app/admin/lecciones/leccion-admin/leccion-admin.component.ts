

import { Component, OnInit,  AfterViewInit } from '@angular/core';
import {  MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import {LECCIONES_CONSTANTS} from '../model/lecciones-constants-model';
import { LeccionModel } from '../model/leccion-model';
import { LeccionService } from '../service/leccion.service';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { TempDataService } from '../../shared/services/temp-data.service';
import { Router } from '@angular/router';
import { SimpleModel } from '../../shared/model/simple-model';
import { GrupoNivelTemaModel } from 'app/admin/grupo-nivel-tema/model/grupo-nivel-tema-model';
import { LeccionEditComponent } from '../leccion-edit/leccion-edit.component';
import { PreguntaService } from 'app/admin/preguntas/service/pregunta.service';
import { PreguntaModel } from 'app/admin/preguntas/model/pregunta-model';
import { PreguntaEditComponent } from 'app/admin/preguntas/pregunta-edit/pregunta-edit.component';
import { DatageniaService } from 'app/admin/datagenia/services/datagenia.service';
import { ArchivoService } from 'app/admin/archivo/services/archivo.service';
import { OpcionRespuestaService } from 'app/admin/opcion-respuestas/service/opcion-respuesta.service';
import { OpcionRespuestaModel } from 'app/admin/opcion-respuestas/model/opcion-respuesta-model';
import { OpcionRespuestaEditComponent } from 'app/admin/opcion-respuestas/opcion-respuesta-edit/opcion-respuesta-edit.component';

@Component({
  selector: 'app-leccion-admin',
  templateUrl: './leccion-admin.component.html',
  styleUrls: ['./leccion-admin.component.css']
})
export class LeccionAdminComponent  implements OnInit, AfterViewInit {

  lecciones: SimpleModel[] = [];
  preguntas: PreguntaModel[] = [];
  opciones: OpcionRespuestaModel[] = [];
  leccionSeleccionada: LeccionModel = new LeccionModel();
  preguntaSeleccionada: PreguntaModel = new PreguntaModel();
  leccionesDisplayedColumns = [
    'enumeracion',
    'leyenda',
    'actions'
  ];
  PreguntasDisplayedColumns = [
    'tipopregunta',
    'respueta.id',
    'fraseRespuesta',
    'actions'
  ];
  OpcionesDisplayedColumns = [
    'orden',
    'opcion',
    'actions'
  ];
  loadingLecciones = true;
  loadingPreguntas = false;
  loadingOpciones = false;
  constants = LECCIONES_CONSTANTS;
  disabledButton = false;
  grupoNivelTema: GrupoNivelTemaModel = new GrupoNivelTemaModel();
  leccionSelectedId: number;
  PreguntaSelectedId: number;

  constructor(
    private grupoNivelService: LeccionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private tempDataService: TempDataService,
    private leccionService: LeccionService,
    private preguntaService: PreguntaService,
    private datageniaService: DatageniaService,
    private archivoService: ArchivoService,
    private opcionesRespuestaService: OpcionRespuestaService
    ) {}

  ngOnInit() {
      const grupoNivelTemaSerializado =  this.tempDataService.getDataNivel3();
      this.grupoNivelTema = JSON.parse(grupoNivelTemaSerializado);
      this.cargarLecciones();
  }

  cargarLecciones() {
    this.leccionService.findAllByGrupoNivelTemaId(this.grupoNivelTema.id).subscribe( (data: any) => {
      this.lecciones = data;
      this.loadingLecciones = false;
    });
  }

  cargarDatagenias() {
    // this.datageniaService.(this.grupoNivelTema.id).subscribe( (data: any) => {
    //   this.lecciones = data;
    //   this.loadingLecciones = false;
    // });
  }

  ngAfterViewInit(): void {
  }

  searchData(): void {
  }

  createLeccion(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newLeccion = new LeccionModel();
    newLeccion.grupoNivelTema = this.grupoNivelTema;
    const dataParam = {
      itemData: newLeccion
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(LeccionEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.cargarLecciones();
        }
      }
    );
  }

  edit(grupoNivelTema: LeccionModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (grupoNivelTema !== null) {
      grupoNivelTema.id = this.grupoNivelTema.id;
    }
    const dataParam = {
      itemData: grupoNivelTema
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(LeccionEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.cargarLecciones();
        }
      }
    );
  }

  delete(grupoNivel: LeccionModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = grupoNivel;

    const dialogRef = this.dialog.open(GeneralConfirmComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      (val: any) => {
        if (val) {
          this.disabledButton = true;
          this.leccionService.delete(dialogConfig.data.id).subscribe(
            () => {
              this.disabledButton = false;
              this.utilitiesService.actionSuccessDeleteMessage(this.snackBar);
              this.cargarLecciones();
            },
            error => {
              this.disabledButton = false;
              this.utilitiesService.actionErrorMessages(error, this.snackBar);
            }
          );
        }
      }
    );
  }

  leccionSelected(row: any) {
    this.leccionSeleccionada = row;
    this.cargarPreguntas(row.id);
    this.opciones = [];
  }

  cargarPreguntas(leccionId: number) {
    this.loadingPreguntas = true;
    this.preguntaService.findAllByLeccionId(leccionId).subscribe(  (data: any) => {
      this.preguntas = data;
      this.loadingPreguntas = false;
    });
  }

  createPregunta(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newPregunta = new PreguntaModel();
    newPregunta.leccion = this.leccionSeleccionada;
    const dataParam = {
      itemPregunta: newPregunta,
      itemLeccion: this.leccionSeleccionada
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(PreguntaEditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.cargarPreguntas(this.leccionSeleccionada.id);
        }
      }
    );
  }

  editPregunta(item: PreguntaModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dataParam = {
      itemPregunta: item,
      itemLeccion: this.leccionSeleccionada
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(PreguntaEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.cargarLecciones();
        }
      }
    );
  }

  deletePregunta(pregunta: PreguntaModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = pregunta;

    const dialogRef = this.dialog.open(GeneralConfirmComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      (val: any) => {
        if (val) {
          this.disabledButton = true;
          this.preguntaService.delete(dialogConfig.data.id).subscribe(
            () => {
              this.disabledButton = false;
              this.utilitiesService.actionSuccessDeleteMessage(this.snackBar);
              this.cargarPreguntas(this.leccionSeleccionada.id);
            },
            error => {
              this.disabledButton = false;
              this.utilitiesService.actionErrorMessages(error, this.snackBar);
            }
          );
        }
      }
    );
  }

  preguntaSelected(row: any) {
    this.preguntaSeleccionada = row;
    this.cargarOpciones(this.preguntaSeleccionada.id);
  }

  cargarOpciones(preguntaId: number) {
    this.loadingOpciones = true;
    this.opcionesRespuestaService.findAllByPreguntaId(preguntaId).subscribe(  (data: any) => {
      this.opciones = data;
      this.loadingOpciones = false;
    });
  }

  createOpcion(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newOpcion = new OpcionRespuestaModel();
    newOpcion.pregunta = this.preguntaSeleccionada;
    const dataParam = {
      itemOpcion: newOpcion,
      itemPregunta: this.preguntaSeleccionada
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(OpcionRespuestaEditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.cargarOpciones(this.preguntaSeleccionada.id);
        }
      }
    );
  }

  editOpcion(item: PreguntaModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dataParam = {
      itemOpcion: item,
      itemPregunta: this.preguntaSeleccionada
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(OpcionRespuestaEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.cargarOpciones(this.preguntaSeleccionada.id);
        }
      }
    );
  }

  deleteOpcion(opcion: OpcionRespuestaModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = opcion;

    const dialogRef = this.dialog.open(GeneralConfirmComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(
      (val: any) => {
        if (val) {
          this.disabledButton = true;
          this.opcionesRespuestaService.delete(dialogConfig.data.id).subscribe(
            () => {
              this.disabledButton = false;
              this.utilitiesService.actionSuccessDeleteMessage(this.snackBar);
              this.cargarOpciones(this.preguntaSeleccionada.id);
            },
            error => {
              this.disabledButton = false;
              this.utilitiesService.actionErrorMessages(error, this.snackBar);
            }
          );
        }
      }
    );
  }

}
