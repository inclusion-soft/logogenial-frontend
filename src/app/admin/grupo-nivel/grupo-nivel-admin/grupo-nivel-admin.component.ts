import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { tap } from 'rxjs/operators';
import {GRUPO_NIVEL_CONSTANTS} from '../model/grupo-nivel-constant';
import { GrupoNivelCriteria} from '../model/grupo-nivel-criteria';
import { GrupoNivelModel } from '../model/grupo-nivel-model';
import { NivelModel } from '../../nivel/models/nivel-model';
import { GrupoNivelDatasource } from '../service/grupo-nivel-datasource';
import { GrupoNivelService } from '../service/grupo-nivel.service';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { TempDataService } from '../../shared/services/temp-data.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { GrupoModel } from 'app/admin/grupo/model/grupo-model';
import { NivelService } from 'app/admin/nivel-list/service/nivel.service';
import { GrupoNivelEditComponent } from '../grupo-nivel-edit/grupo-nivel-edit.component';

@Component({
  selector: 'app-grupo-nivel-admin',
  templateUrl: './grupo-nivel-admin.component.html',
  styleUrls: ['./grupo-nivel-admin.component.css']
})
export class GrupoNivelAdminComponent implements OnInit, AfterViewInit {
  MyDataSource: any;
  GrupoNivelCriteria: GrupoNivelCriteria = new GrupoNivelCriteria();
  grupoNivelList: NivelModel[] = [];
  GrupoNivel: GrupoNivelModel = new GrupoNivelModel();
  displayedColumns = [
      'nivel',
      'activo',
      'actions'
  ];
  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort;

  grupoNivelDatasource: GrupoNivelDatasource<GrupoNivelModel>;
  loading = true;
  constants = GRUPO_NIVEL_CONSTANTS;
  disabledButton = false;
  grupo: GrupoModel = new GrupoModel();

  constructor(
    private grupoNivelService: GrupoNivelService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private tempDataService: TempDataService,
    private nivelService: NivelService,
    private router: Router
    ) {}

  ngOnInit() {
      const grupoSerializado =  this.tempDataService.getDataNivel1();
      this.grupo = JSON.parse(grupoSerializado);
      this.GrupoNivelCriteria.grupo = this.grupo;
      this.grupoNivelDatasource = new GrupoNivelDatasource(this.grupoNivelService);
      this.cargarGrupoNivel();
  }

  cargarGrupoNivel() {
    this.nivelService.findAll().subscribe( (data: NivelModel[]) => {
      this.grupoNivelList = data;
    });
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
      this.grupoNivelDatasource.loadingSubject$.subscribe( (_loading: boolean) => {
          this.loading = _loading;
      });

      this.paginator.page.pipe(tap(() => this.searchData())).subscribe();
      this.sort.sortChange.subscribe((dir: any) => {
          this.searchData();
      });
      this.grupoNivelDatasource.errorSubject$.subscribe( (resultError: any) => {
        if ( resultError.ok !== undefined && resultError.ok === false) {
          this.utilitiesService.actionErrorMessages(resultError, this.snackBar);
        }
      });
      this.searchData();
  }

  searchData(): void {
      this.GrupoNivelCriteria.setTableElements(this.paginator, this.sort);
      this.grupoNivelDatasource.sort = this.sort;
      this.grupoNivelDatasource.paginator = this.paginator;
      this.grupoNivelDatasource.search(this.GrupoNivelCriteria);
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newGrupoNivel = new GrupoNivelModel();
    newGrupoNivel.grupo = this.grupo;
    const dataParam = {
      grupoNivelList: this.grupoNivelList,
      itemData: newGrupoNivel
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(GrupoNivelEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  edit(nivel: GrupoNivelModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (nivel !== null) {
      nivel.grupo.id = this.grupo.id;
    }
    const dataParam = {
      grupoNivelList: this.grupoNivelList,
      itemData: nivel
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(GrupoNivelEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  delete(grupoNivel: GrupoNivelModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = grupoNivel;

    const dialogRef = this.dialog.open(GeneralConfirmComponent, dialogConfig);
    // const _this = this;
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

  grupoNivelTemas(grupoNivel: GrupoNivelModel): void {
    this.tempDataService.setDataNivel2( JSON.stringify(grupoNivel));
    this.router.navigate(['/grupo-nivel-tema']);
  }

}

