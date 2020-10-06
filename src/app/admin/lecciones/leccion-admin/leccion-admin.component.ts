

import { Component, OnInit,  AfterViewInit } from '@angular/core';
import {  MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import {LECCIONES_CONSTANTS} from '../model/lecciones-constants-model';
import { LeccionModel } from '../model/leccion-model';
import { LeccionService } from '../service/leccion.service';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { TempDataService } from '../../shared/services/temp-data.service';
import { Router } from '@angular/router';
import { TemaService } from 'app/admin/tema/services/tema.service';
import { SimpleModel } from '../../shared/model/simple-model';
import { TemaModel } from 'app/admin/tema/models/tema-model';
import { GrupoNivelTemaModel } from 'app/admin/grupo-nivel-tema/model/grupo-nivel-tema-model';
import { LeccionEditComponent } from '../leccion-edit/leccion-edit.component';

@Component({
  selector: 'app-leccion-admin',
  templateUrl: './leccion-admin.component.html',
  styleUrls: ['./leccion-admin.component.css']
})
export class LeccionAdminComponent  implements OnInit, AfterViewInit {

  lecciones: SimpleModel[] = [];
  Leccion: LeccionModel = new LeccionModel();
  leccionesDisplayedColumns = [
    'nombre',
    'activo',
    'actions'
  ];
  loadingLecciones = true;
  constants = LECCIONES_CONSTANTS;
  disabledButton = false;
  grupoNivelTema: GrupoNivelTemaModel = new GrupoNivelTemaModel();
  LeccionSelectedRowIndex:any;

  constructor(
    private grupoNivelService: LeccionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private tempDataService: TempDataService,
    private leccionService: LeccionService,
    private router: Router
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
          this.grupoNivelService.delete(dialogConfig.data.id).subscribe(
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

  leccionHighlight(row: any) {
    this.LeccionSelectedRowIndex = row.id;
  }

  // grupoNivelTema(grupoNivel: LeccionModel): void {
  //   this.tempDataService.setDataNivel2( JSON.stringify(grupoNivel));
  //   this.router.navigate([environment.apiUrl + '/temas']);
  // }

}

