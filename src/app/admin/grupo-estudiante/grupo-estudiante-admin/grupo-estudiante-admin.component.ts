import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NivelModel } from 'app/admin/nivel/models/nivel-model';
import { GrupoEstudianteModel } from '../model/grupo-estudiante-model';
import { GrupoEstudianteCriteria } from '../model/grupo-estudiante-criteria';
import { GrupoEstudianteDatasource } from '../service/grupo-estudiante-datasource';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { GrupoModel } from 'app/admin/grupo/model/grupo-model';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { TempDataService } from 'app/admin/shared/services/temp-data.service';
import { NivelService } from 'app/admin/nivel-list/service/nivel.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { GrupoEstudianteEditComponent } from '../grupo-estudiante-edit/grupo-estudiante-edit.component';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { GrupoEstudianteService } from '../service/grupo-estudiante.service';
import { GRUPO_ESTUDIANTE_CONSTANTS } from '../model/grupo-estudiante-constant';

@Component({
  selector: 'app-grupo-estudiante-admin',
  templateUrl: './grupo-estudiante-admin.component.html',
  styleUrls: ['./grupo-estudiante-admin.component.css']
})
export class GrupoEstudianteAdminComponent implements OnInit, AfterViewInit {
  MyDataSource: any;
  GrupoEstudianteCriteria: GrupoEstudianteCriteria = new GrupoEstudianteCriteria();
  grupoNivelList: NivelModel[] = [];
  GrupoEstudiante: GrupoEstudianteModel = new GrupoEstudianteModel();
  displayedColumns = [
      'grupo',
      'docente',
      'estudiante',
      'activo',
      'actions'
  ];
  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort;

  grupoEstudianteDatasource: GrupoEstudianteDatasource<GrupoEstudianteModel>;
  loading = true;
  constants = GRUPO_ESTUDIANTE_CONSTANTS;
  disabledButton = false;
  grupo: GrupoModel = new GrupoModel();

  constructor(
    private grupoNivelService: GrupoEstudianteService,
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
      this.GrupoEstudianteCriteria.grupo = this.grupo;
      this.grupoEstudianteDatasource = new GrupoEstudianteDatasource(this.grupoNivelService);
      this.cargarGrupoEstudiante();
  }

  cargarGrupoEstudiante() {
    this.nivelService.findAll().subscribe( (data: NivelModel[]) => {
      this.grupoNivelList = data;
    });
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
      this.grupoEstudianteDatasource.loadingSubject$.subscribe( (_loading: boolean) => {
          this.loading = _loading;
      });

      this.paginator.page.pipe(tap(() => this.searchData())).subscribe();
      this.sort.sortChange.subscribe((dir: any) => {
          this.searchData();
      });
      this.grupoEstudianteDatasource.errorSubject$.subscribe( (resultError: any) => {
        if ( resultError.ok !== undefined && resultError.ok === false) {
          this.utilitiesService.actionErrorMessages(resultError, this.snackBar);
        }
      });
      this.searchData();
  }

  searchData(): void {
      this.GrupoEstudianteCriteria.setTableElements(this.paginator, this.sort);
      this.grupoEstudianteDatasource.sort = this.sort;
      this.grupoEstudianteDatasource.paginator = this.paginator;
      this.grupoEstudianteDatasource.search(this.GrupoEstudianteCriteria);
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newGrupoEstudiante = new GrupoEstudianteModel();
    newGrupoEstudiante.grupo = this.grupo;
    const dataParam = {
      grupoNivelList: this.grupoNivelList,
      itemData: newGrupoEstudiante
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(GrupoEstudianteEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  edit(grupoEstudiante: GrupoEstudianteModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dataParam = {
      itemData: grupoEstudiante
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(GrupoEstudianteEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  delete(grupoNivel: GrupoEstudianteModel): void {
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

  grupoNivelTemas(grupoNivel: GrupoEstudianteModel): void {
    this.tempDataService.setDataNivel2( JSON.stringify(grupoNivel));
    this.router.navigate(['/grupo-nivel-tema']);
  }

}

