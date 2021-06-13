import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GrupoEstudianteCriteria } from 'app/admin/grupo-estudiante/model/grupo-estudiante-criteria';
import { NivelModel } from 'app/admin/nivel/models/nivel-model';
import { GrupoEstudianteModel } from 'app/admin/grupo-estudiante/model/grupo-estudiante-model';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { GrupoEstudianteDatasource } from 'app/admin/grupo-estudiante/service/grupo-estudiante-datasource';
import { GRUPO_ESTUDIANTE_CONSTANTS } from 'app/admin/grupo-estudiante/model/grupo-estudiante-constant';
import { GrupoModel } from 'app/admin/grupo/model/grupo-model';
import { GrupoEstudianteService } from 'app/admin/grupo-estudiante/service/grupo-estudiante.service';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { TempDataService } from 'app/admin/shared/services/temp-data.service';
import { NivelService } from 'app/admin/nivel-list/service/nivel.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { GrupoEstudianteEditComponent } from 'app/admin/grupo-estudiante/grupo-estudiante-edit/grupo-estudiante-edit.component';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import {ResultadosPreguntaService } from 'app/admin/dashboard/service/resultados-pregunta.service';

import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
declare var require: any;

const data = require('./data.json');

export interface Chartx {
	type: ChartType;
	data: Chartist.IChartistData;
	options?: any;
	responsiveOptions?: any;
	events?: ChartEvent;
}


@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit, AfterViewInit {
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

  chart: any;
  totalHits = 0;


  	// Barchart
	barChart1: Chartx = {
		type: 'Bar',
		data: data['Bar'],
		options: {
			seriesBarDistance: 15,
			high: 12,

			axisX: {
				showGrid: false,
				offset: 20
			},
			axisY: {
				showGrid: true,
				offset: 40
			},
			height: 360
		},

		responsiveOptions: [
			[
				'screen and (min-width: 640px)',
				{
					axisX: {
						labelInterpolationFnc: function(value: number,index: number): string {
							return index % 1 === 0 ? `${value}` : '';
						}
					}
				}
			]
		]
	};

	// This is for the donute chart
	donuteChart1: Chartx = {
		type: 'Pie',
		data: data['Pie'],
		options: {
			donut: true,
			height: 260,
			showLabel: false,
			donutWidth: 20
		}
	};

  constructor(
    private grupoNivelService: GrupoEstudianteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private tempDataService: TempDataService,
    private nivelService: NivelService,
    private resultadoPreguntaService: ResultadosPreguntaService,
    private router: Router
    ) {}

  ngOnInit() {
      const grupoSerializado =  this.tempDataService.getDataNivel1();
      this.grupo = JSON.parse(grupoSerializado);
      this.GrupoEstudianteCriteria.grupo = this.grupo;
      this.grupoEstudianteDatasource = new GrupoEstudianteDatasource(this.grupoNivelService);
      this.cargarGrupoEstudiante();
      //this.cargarHitsResultadosPorEstudiante();
  }

  // cargarHitsResultadosPorEstudiante() {
  //   this.resultadoPreguntaService.findAllByUsuarioId(6).subscribe(datos =>  {
  //     debugger;
  //     const datosPuntaje = [];
  //     datosPuntaje.push(datos[0].cantidad);
  //     if(datos.length > 1) {
  //       datosPuntaje.push(datos[1].cantidad);
  //     } else{
  //       datosPuntaje.push(0);
  //     }

  //     this.totalHits = datosPuntaje[0] + datosPuntaje[1];
  //     this.chart = new Chartx('canvas', {
  //       type: 'doughnut',
  //       data: {
  //         labels: ['Aciertos', 'Desaciertos'],
  //         datasets: [
  //           {
  //             data: datosPuntaje,
  //             backgroundColor: ['rgba(45, 211, 111, 1)', '#8e5ea2'],
  //             fill: false
  //           },
  //         ]
  //       },
  //       options: {
  //         legend: {
  //           display: true
  //         },
  //         tooltips: {
  //           enabled: true
  //         },
  //         animation: {
  //           animateRotate: true
  //         }
  //       }
  //     });
  //   }, err => {
  //     alert('error cargando datos');
  //   });
  // }

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

