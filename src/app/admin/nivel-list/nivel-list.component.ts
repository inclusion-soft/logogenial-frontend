import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { tap } from 'rxjs/operators';
import {NivelModel} from '../nivel/models/nivel-model';
import { NivelDatasource} from '../nivel/models/nivel-datasource';
import { NivelService } from './service/nivel.service';
import { NivelCriteria } from '../nivel/models/nivel-criteria';
import {CONSTANTS_SHARED} from '../shared/constants-shared';
import { NivelEditComponent } from '../nivel-edit/nivel-edit.component';
import { GeneralConfirmComponent } from '../shared/components/general-confirm/general-confirm.component';
import { UtilitiesService } from '../shared/services/utilities.service';

@Component({
  selector: 'app-nivel-list',
  templateUrl: './nivel-list.component.html',
  styleUrls: ['./nivel-list.component.css']
})
export class NivelListComponent implements OnInit, AfterViewInit {
  MyDataSource: any;
  NivelCriteria: NivelCriteria = new NivelCriteria();
  Nivel: NivelModel = new NivelModel();
  displayedColumns = [
      'nombre',
      'dificultad',
      'activo',
      'actions'
  ];
  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort;

  nivelDatasource!: NivelDatasource<NivelModel>;
  loading = true;
  constants = CONSTANTS_SHARED;
  disabledButton = false;

  constructor(
    private nivelService: NivelService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService
    ) {}

  ngOnInit() {
      this.nivelDatasource = new NivelDatasource(this.nivelService);
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
      this.nivelDatasource.loadingSubject$.subscribe( (_loading: boolean) => {
          this.loading = _loading;
      });

      this.paginator.page.pipe(tap(() => this.searchData())).subscribe();
      this.sort.sortChange.subscribe((dir: any) => {
          this.searchData();
      });
      this.nivelDatasource.errorSubject$.subscribe(resultError => {
        if ( resultError.ok !== undefined && resultError.ok === false) {
          this.utilitiesService.actionErrorMessages(resultError, this.snackBar);
        }
      });
      this.searchData();
  }

  searchData(): void {
      this.NivelCriteria.setTableElements(this.paginator, this.sort);
      this.nivelDatasource.sort = this.sort;
      this.nivelDatasource.paginator = this.paginator;
      this.nivelDatasource.search(this.NivelCriteria);
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newNivel = new NivelModel();
    dialogConfig.data = newNivel;

    const dialogRef = this.dialog.open(NivelEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  edit(menu: NivelModel): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = menu;

    const dialogRef = this.dialog.open(NivelEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  delete(menu: NivelModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = menu;

    const dialogRef = this.dialog.open(GeneralConfirmComponent, dialogConfig);
    // const _this = this;
    dialogRef.beforeClosed().subscribe(
      (val: any) => {
        if (val) {
          this.disabledButton = true;
          this.nivelService.delete(dialogConfig.data.id).subscribe(
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

}
