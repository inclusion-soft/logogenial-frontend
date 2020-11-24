import { MatPaginator, MatSort, MatDialogConfig, MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { tap } from 'rxjs/operators';
import { DatageniaModel} from '../models/datagenia-model';
import { DatageniaCriteria} from '../models/datagenia-criteria';
import { DatageniaDatasourceService} from '../services/datagenia-datasource.service';
import { DatageniaService } from '../services/datagenia.service';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { DatageniaEditComponent } from '../datagenia-edit/datagenia-edit.component';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { Component, OnInit, AfterViewInit, ViewChild, Input, Inject } from '@angular/core';
import { CONSTANT_DATAGENIA } from '../models/CONSTANT_DATAGENIA';
import { ArchivoService } from 'app/admin/archivo/services/archivo.service';

@Component({
  selector: 'app-datagenia-select',
  templateUrl: './datagenia-select.component.html',
  styleUrls: ['./datagenia-select.component.css']
})
export class DatageniaSelectComponent implements OnInit, AfterViewInit {
  MyDataSource: any;
  DatageniaCriteria: DatageniaCriteria = new DatageniaCriteria();
  Datagenia: DatageniaModel = new DatageniaModel();
  displayedColumns = [
      'nombre',
      'frase',
      // 'compartido',
      // 'usuarioCreadorId',
      'dificultad',
      'archivoId',
      'activo',
      'actions'
  ];

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort;

  datageniaDatasource!: DatageniaDatasourceService<DatageniaModel>;
  loading = true;
  constants = CONSTANT_DATAGENIA;
  disabledButton = false;
  @Input() modeAdmin = true;

  constructor(
    private dialogRef: MatDialogRef<DatageniaSelectComponent>,
    public datageniaService: DatageniaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private archivoService: ArchivoService,
    @Inject(MAT_DIALOG_DATA) data: any
    ) {

    }


  ngOnInit() {
      this.datageniaDatasource = new DatageniaDatasourceService(this.datageniaService);
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
      this.datageniaDatasource.loadingSubject$.subscribe( (_loading: boolean) => {
          this.loading = _loading;
      });

      this.paginator.page.pipe(tap(() => this.searchData())).subscribe();
      this.sort.sortChange.subscribe((dir: any) => {
          this.searchData();
      });
      this.datageniaDatasource.errorSubject$.subscribe(resultError => {
        if ( resultError.ok !== undefined && resultError.ok === false) {
          this.utilitiesService.actionErrorMessages(resultError, this.snackBar);
        }
      });
      this.searchData();
  }

  searchData(): void {
      this.DatageniaCriteria.setTableElements(this.paginator, this.sort);
      this.datageniaDatasource.sort = this.sort;
      this.datageniaDatasource.paginator = this.paginator;
      this.datageniaDatasource.search(this.DatageniaCriteria);
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newDatagenia = new DatageniaModel();
    dialogConfig.data = newDatagenia;

    const dialogRef = this.dialog.open(DatageniaEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  edit(menu: DatageniaModel): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = menu;

    const dialogRef = this.dialog.open(DatageniaEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  selected(datagenia: DatageniaModel): void {
    this.dialogRef.close(datagenia);
  }

  delete(menu: DatageniaModel): void {
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
          this.datageniaService.delete(dialogConfig.data.id).subscribe(
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

  cancelar() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(GeneralConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe((val: any) => {
      if (val === 1) {
        this.dialogRef.close();
      }
    });
  }

}
