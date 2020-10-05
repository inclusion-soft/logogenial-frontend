import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { tap } from 'rxjs/operators';
import {GRUPO_CONSTANTS} from '../model/grupo-constants';
import { GrupoCriteria} from '../model/grupo-criteria';
import { GrupoModel } from '../model/grupo-model';
import { GrupoDataSource } from '../service/grupo-data-source';
import { GrupoService } from '../service/grupo.service';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { GrupoEditComponent } from '../grupo-edit/grupo-edit.component';
import { TempDataService } from '../../shared/services/temp-data.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-grupo-admin',
  templateUrl: './grupo-admin.component.html',
  styleUrls: ['./grupo-admin.component.css']
})
export class GrupoAdminComponent  implements OnInit, AfterViewInit {
  MyDataSource: any;
  GrupoCriteria: GrupoCriteria = new GrupoCriteria();
  Grupo: GrupoModel = new GrupoModel();
  displayedColumns = [
      'nombre',
      'anio',
      'activo',
      'actions'
  ];
  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort;

  grupoDatasource!: GrupoDataSource<GrupoModel>;
  loading = true;
  constants = GRUPO_CONSTANTS;
  disabledButton = false;

  constructor(
    private grupoService: GrupoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private tempDataService: TempDataService,
    private router: Router
    ) {}

  ngOnInit() {
      this.grupoDatasource = new GrupoDataSource(this.grupoService);
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
      this.grupoDatasource.loadingSubject$.subscribe( (_loading: boolean) => {
          this.loading = _loading;
      });

      this.paginator.page.pipe(tap(() => this.searchData())).subscribe();
      this.sort.sortChange.subscribe((dir: any) => {
          this.searchData();
      });
      this.grupoDatasource.errorSubject$.subscribe(resultError => {
        if ( resultError.ok !== undefined && resultError.ok === false) {
          this.utilitiesService.actionErrorMessages(resultError, this.snackBar);
        }
      });
      this.searchData();
  }

  searchData(): void {
      this.GrupoCriteria.setTableElements(this.paginator, this.sort);
      this.grupoDatasource.sort = this.sort;
      this.grupoDatasource.paginator = this.paginator;
      this.grupoDatasource.search(this.GrupoCriteria);
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newGrupo = new GrupoModel();
    dialogConfig.data = newGrupo;

    const dialogRef = this.dialog.open(GrupoEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  edit(grupo: GrupoModel): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = grupo;

    const dialogRef = this.dialog.open(GrupoEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  delete(grupo: GrupoModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = grupo;

    const dialogRef = this.dialog.open(GeneralConfirmComponent, dialogConfig);
    // const _this = this;
    dialogRef.beforeClosed().subscribe(
      (val: any) => {
        if (val) {
          this.disabledButton = true;
          this.grupoService.delete(dialogConfig.data.id).subscribe(
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

  grupoNiveles(grupo: GrupoModel): void {
    this.tempDataService.setDataNivel1( JSON.stringify(grupo));
    this.router.navigate(['/grupo-nivel']);
  }

}
