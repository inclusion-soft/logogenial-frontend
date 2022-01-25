import { Component, OnInit, AfterViewInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { EncuestaCriteria } from '../model/encuesta-criteria';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { CONSTANTS_SHARED } from 'app/admin/shared/constants-shared';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { TempDataService } from 'app/admin/shared/services/temp-data.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { EncuestaEditComponent } from '../encuesta-edit/encuesta-edit.component';
// import { EncuestaService } from 'app/seguridad/services/user.service';
import { EncuestaDatasource } from '../service/encuesta-datasource';
import { ArrayListPipe } from 'app/admin/pipe/array-list.pipe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EncuestaModel } from '../model/encuesta-model';
import { EncuestaService } from '../service/encuesta.service';

@Component({
  selector: 'app-encuesta-list',
  templateUrl: './encuesta-list.component.html',
  styleUrls: ['./encuesta-list.component.css'],
  providers: [ ArrayListPipe ]
})
export class EncuestaListComponent implements OnInit, AfterViewInit {
  titulo = 'Gestión de encuestas';
  MyDataSource: any;
  EncuestaCriteria: EncuestaCriteria = new EncuestaCriteria();
  Encuesta: EncuestaModel = new EncuestaModel();
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

  // asignarFiltrosACriterios(): void {
  //   if(this.filterForm.get('nombreencuesta')?.value != null){
  //     this.EncuestaCriteria.nombreencuesta = this.filterForm.get('nombreencuesta')?.value;
  //   }
  //   if(this.filterForm.get('correo')?.value != null){
  //     this.EncuestaCriteria.correo = this.filterForm.get('correo')?.value;
  //   }
  //   if(this.filterForm.get('nombre')?.value != null){
  //     this.EncuestaCriteria.nombre = this.filterForm.get('nombre')?.value;
  //   }
  //   if(this.filterForm.get('apellido')?.value != null){
  //     this.EncuestaCriteria.apellido = this.filterForm.get('apellido')?.value;
  //   }
  // }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newEncuesta = new EncuestaModel();
    const dataParam = {
      itemData: newEncuesta
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

  edit(encuesta: EncuestaModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dataParam = {
      itemData: encuesta
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(EncuestaEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

}
