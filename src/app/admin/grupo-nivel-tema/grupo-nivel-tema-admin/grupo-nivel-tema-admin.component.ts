import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { tap } from 'rxjs/operators';
import {GRUPO_NIVELTEMA_CONSTANTS} from '../model/grupo-nivel-tema-constant';
import { GrupoNivelTemaCriteria} from '../model/grupo-nivel-tema-criteria';
import { GrupoNivelTemaModel } from '../model/grupo-nivel-tema-model';
import { GrupoNivelTemaDatasource } from '../service/grupo-nivel-tema-datasource';
import { GrupoNivelTemaService } from '../service/grupo-nivel-tema.service';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { TempDataService } from '../../shared/services/temp-data.service';
import { Router } from '@angular/router';
import { GrupoNivelTemaEditComponent } from '../grupo-nivel-tema-edit/grupo-nivel-tema-edit.component';
import { GrupoNivelModel } from 'app/admin/grupo-nivel/model/grupo-nivel-model';
import { TemaService } from 'app/admin/tema/services/tema.service';
import { TemaModel } from 'app/admin/tema/models/tema-model';

@Component({
  selector: 'app-grupo-nivel-tema-admin',
  templateUrl: './grupo-nivel-tema-admin.component.html',
  styleUrls: ['./grupo-nivel-tema-admin.component.css']
})
export class GrupoNivelTemaAdminComponent implements OnInit, AfterViewInit {
  MyDataSource: any;
  grupoNivelTemaCriteria: GrupoNivelTemaCriteria = new GrupoNivelTemaCriteria();
  temaList: TemaModel[] = [];
  GrupoNivelTema: GrupoNivelTemaModel = new GrupoNivelTemaModel();
  displayedColumns = [
      'tema',
      'activo',
      'actions'
  ];
  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort;

  grupoNivelTemaDatasource: GrupoNivelTemaDatasource<GrupoNivelTemaModel>;
  loading = true;
  constants = GRUPO_NIVELTEMA_CONSTANTS;
  disabledButton = false;
  grupoNivel: GrupoNivelModel = new GrupoNivelModel();

  constructor(
    private grupoNivelService: GrupoNivelTemaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private tempDataService: TempDataService,
    private temaService: TemaService,
    private router: Router
    ) {}

  ngOnInit() {
      const grupoNivelSerializado =  this.tempDataService.getDataNivel2();
      this.grupoNivel = JSON.parse(grupoNivelSerializado);
      this.grupoNivelTemaCriteria.grupoNivel = this.grupoNivel;
      this.grupoNivelTemaDatasource = new GrupoNivelTemaDatasource(this.grupoNivelService);
      this.cargarTemas();
  }

  cargarTemas() {
    this.temaService.findAll().subscribe( (data: TemaModel[]) => {
      this.temaList = data;
    });
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
      this.grupoNivelTemaDatasource.loadingSubject$.subscribe( (_loading: boolean) => {
          this.loading = _loading;
      });

      this.paginator.page.pipe(tap(() => this.searchData())).subscribe();
      this.sort.sortChange.subscribe((dir: any) => {
          this.searchData();
      });
      this.grupoNivelTemaDatasource.errorSubject$.subscribe( (resultError: any) => {
        if ( resultError.ok !== undefined && resultError.ok === false) {
          this.utilitiesService.actionErrorMessages(resultError, this.snackBar);
        }
      });
      this.searchData();
  }

  searchData(): void {
      this.grupoNivelTemaCriteria.setTableElements(this.paginator, this.sort);
      this.grupoNivelTemaDatasource.sort = this.sort;
      this.grupoNivelTemaDatasource.paginator = this.paginator;
      this.grupoNivelTemaDatasource.search(this.grupoNivelTemaCriteria);
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newGrupoNivelTema = new GrupoNivelTemaModel();
    newGrupoNivelTema.grupoNivel = this.grupoNivel;
    const dataParam = {
      temaList: this.temaList,
      itemData: newGrupoNivelTema
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(GrupoNivelTemaEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  edit(grupoNivelTema: GrupoNivelTemaModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (grupoNivelTema !== null) {
      grupoNivelTema.grupoNivel.id = this.grupoNivel.id;
    }
    const dataParam = {
      temaList: this.temaList,
      itemData: grupoNivelTema
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(GrupoNivelTemaEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  delete(grupoNivel: GrupoNivelTemaModel): void {
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
              this.searchData();
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

  lecciones(grupoNivelTema: GrupoNivelTemaModel): void {
    this.tempDataService.setDataNivel3( JSON.stringify(grupoNivelTema));
    this.router.navigate(['/lecciones']);
  }

}

