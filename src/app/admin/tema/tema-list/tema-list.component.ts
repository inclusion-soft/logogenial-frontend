import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { tap } from 'rxjs/operators';
import { TemaModel} from '../models/tema-model';
import { TemaCriteria} from '../models/tema-criteria';
import { TemaDatasource} from '../models/tema-datasource';
import { TEMACONSTANTS} from '../models/tema-constants';
import { TemaService } from '../services/tema.service';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { TemaEditComponent } from '../tema-edit/tema-edit.component';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';

@Component({
  selector: 'app-tema-list',
  templateUrl: './tema-list.component.html',
  styleUrls: ['./tema-list.component.css']
})
export class TemaListComponent implements OnInit, AfterViewInit {
  MyDataSource: any;
  TemaCriteria: TemaCriteria = new TemaCriteria();
  Tema: TemaModel = new TemaModel();
  displayedColumns = [
      'nombre',
      'activo',
      'actions'
  ];
  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort;

  temaDatasource!: TemaDatasource<TemaModel>;
  loading = true;
  constants = TEMACONSTANTS;
  disabledButton = false;

  constructor(
    private temaService: TemaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService
    ) {}

  ngOnInit() {
      this.temaDatasource = new TemaDatasource(this.temaService);
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
      this.temaDatasource.loadingSubject$.subscribe( (_loading: boolean) => {
          this.loading = _loading;
      });

      this.paginator.page.pipe(tap(() => this.searchData())).subscribe();
      this.sort.sortChange.subscribe((dir: any) => {
          this.searchData();
      });
      this.temaDatasource.errorSubject$.subscribe(resultError => {
        if ( resultError.ok !== undefined && resultError.ok === false) {
          this.utilitiesService.actionErrorMessages(resultError, this.snackBar);
        }
      });
      this.searchData();
  }

  searchData(): void {
      this.TemaCriteria.setTableElements(this.paginator, this.sort);
      this.temaDatasource.sort = this.sort;
      this.temaDatasource.paginator = this.paginator;
      this.temaDatasource.search(this.TemaCriteria);
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newTema = new TemaModel();
    dialogConfig.data = newTema;

    const dialogRef = this.dialog.open(TemaEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  edit(menu: TemaModel): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = menu;

    const dialogRef = this.dialog.open(TemaEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  delete(menu: TemaModel): void {
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
          this.temaService.delete(dialogConfig.data.id).subscribe(
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
