import { Component, OnInit, AfterViewInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { EncuestaCriteria } from '../model/encuesta-criteria';
import { MatPaginator, MatSort, MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { CONSTANTS_SHARED } from 'app/admin/shared/constants-shared';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { TempDataService } from 'app/admin/shared/services/temp-data.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { EncuestaEditComponent } from '../encuesta-edit/encuesta-edit.component';
// import { EncuestaService } from 'app/seguridad/services/user.service';
import { EncuestaDatasource } from '../service/encuesta-datasource';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EncuestaModel } from '../model/encuesta-model';
import { EncuestaService } from '../service/encuesta.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { MarcaModel } from '../model/marca-model';
import {MarcaService} from '../../../marca/service/marca.service';

@Component({
  selector: 'app-encuesta-list',
  templateUrl: './encuesta-list.component.html',
  styleUrls: ['./encuesta-list.component.css']
})
export class EncuestaListComponent implements OnInit, AfterViewInit {
  titulo = 'Gestión de encuestas';
  MyDataSource: any;
  EncuestaCriteria: EncuestaCriteria = new EncuestaCriteria();
  Encuesta: EncuestaModel = new EncuestaModel();
  marcaList: MarcaModel[] = [];
  displayedColumns = [
      //'nombreencuesta',
      'numeroDocumento',
      'email',
      'comentarios',
      'activo',
      'actions'
  ];

  filterForm: FormGroup;

  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort;

  encuestaDatasource: EncuestaDatasource<EncuestaModel>;
  loading = true;
  constants = CONSTANTS_SHARED;
  disabledButton = false;

  constructor(
    private encuestaService: EncuestaService,
    private marcaService: MarcaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private tempDataService: TempDataService,
    private router: Router,
    private formBuilder: FormBuilder
    ) {}

  ngOnInit() {
      const grupoSerializado =  this.tempDataService.getDataNivel1();
      this.encuestaDatasource = new EncuestaDatasource(this.encuestaService);
      this.initForm();
      this.cargarTemas();
  }

  cargarTemas() {
    this.marcaService.findAll().subscribe( (data: MarcaModel[]) => {
      this.marcaList = data;
    });
  }

  initForm() {
   this.filterForm = this.formBuilder.group({
    'nombreencuesta': [null, null],
    'nombre': [null, null],
    'apellido': [null, null],
    'correo': [null, null]
    });

  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
      this.encuestaDatasource.loadingSubject$.subscribe( (_loading: boolean) => {
          this.loading = _loading;
      });

      this.paginator.page.pipe(tap(() => this.searchData())).subscribe();
      this.sort.sortChange.subscribe((dir: any) => {
          this.searchData();
      });
      this.encuestaDatasource.errorSubject$.subscribe( (resultError: any) => {
        if ( resultError.ok !== undefined && resultError.ok === false) {
          this.utilitiesService.actionErrorMessages(resultError, this.snackBar);
        }
      });
      this.searchData();
  }

  searchData(): void {
      this.EncuestaCriteria.setTableElements(this.paginator, this.sort);
      this.encuestaDatasource.sort = this.sort;
      this.encuestaDatasource.paginator = this.paginator;

      // this.asignarFiltrosACriterios();

      this.encuestaDatasource.search(this.EncuestaCriteria);
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newEncuesta = new EncuestaModel();
    const dataParam = {
      itemData: newEncuesta,
      marcaList: this.marcaList
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(EncuestaEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  delete(menu: EncuestaModel): void {
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
          this.encuestaService.delete(val).subscribe(
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
