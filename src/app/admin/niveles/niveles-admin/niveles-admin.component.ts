import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { tap } from 'rxjs/operators';
import {NIVELES_CONSTANTS} from '../model/niveles-constants';
import { NivelesCriteria} from '../model/niveles-criteria';
import { NivelesModel } from '../model/niveles-model';
import { NivelModel } from '../../nivel/models/nivel-model';
import { NivelesDataSource } from '../service/niveles-data-source';
import { NivelesService } from '../service/niveles.service';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { NivelesEditComponent } from '../niveles-edit/niveles-edit.component';
import { TempDataService } from '../../shared/services/temp-data.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { GrupoModel } from 'app/admin/grupo/model/grupo-model';
import { NivelService } from 'app/admin/nivel-list/service/nivel.service';

@Component({
  selector: 'app-niveles-admin',
  templateUrl: './niveles-admin.component.html',
  styleUrls: ['./niveles-admin.component.css']
})
export class NivelesAdminComponent implements OnInit, AfterViewInit {
  MyDataSource: any;
  NivelesCriteria: NivelesCriteria = new NivelesCriteria();
  nivelesList: NivelModel[] = [];
  Niveles: NivelesModel = new NivelesModel();
  displayedColumns = [
      'nivel',
      'activo',
      'actions'
  ];
  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort;

  nivelesDatasource: NivelesDataSource<NivelesModel>;
  loading = true;
  constants = NIVELES_CONSTANTS;
  disabledButton = false;
  grupo: GrupoModel = new GrupoModel();

  constructor(
    private nivelesService: NivelesService,
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
      this.NivelesCriteria.grupo = this.grupo;
      this.nivelesDatasource = new NivelesDataSource(this.nivelesService);
      this.cargarNiveles();
  }

  cargarNiveles() {
    this.nivelService.findAll().subscribe( (data: NivelModel[]) => {
      this.nivelesList = data;
    });
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
      this.nivelesDatasource.loadingSubject$.subscribe( (_loading: boolean) => {
          this.loading = _loading;
      });

      this.paginator.page.pipe(tap(() => this.searchData())).subscribe();
      this.sort.sortChange.subscribe((dir: any) => {
          this.searchData();
      });
      this.nivelesDatasource.errorSubject$.subscribe(resultError => {
        if ( resultError.ok !== undefined && resultError.ok === false) {
          this.utilitiesService.actionErrorMessages(resultError, this.snackBar);
        }
      });
      this.searchData();
  }

  searchData(): void {
      this.NivelesCriteria.setTableElements(this.paginator, this.sort);
      this.nivelesDatasource.sort = this.sort;
      this.nivelesDatasource.paginator = this.paginator;
      this.nivelesDatasource.search(this.NivelesCriteria);
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newNiveles = new NivelesModel();
    newNiveles.grupo = this.grupo;
    const dataParam = {
      nivelesList: this.nivelesList,
      itemData: newNiveles
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(NivelesEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  edit(nivel: NivelesModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (nivel !== null) {
      nivel.grupo.id = this.grupo.id;
    }
    const dataParam = {
      nivelesList: this.nivelesList,
      itemData: nivel
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(NivelesEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  delete(niveles: NivelesModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = niveles;

    const dialogRef = this.dialog.open(GeneralConfirmComponent, dialogConfig);
    // const _this = this;
    dialogRef.beforeClosed().subscribe(
      (val: any) => {
        if (val) {
          this.disabledButton = true;
          this.nivelesService.delete(dialogConfig.data.id).subscribe(
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

  niveles(niveles: NivelesModel): void {

    this.tempDataService.setDataNivel2( JSON.stringify(niveles));
    this.router.navigate([environment.apiUrl + '/temas']);
  }

}

