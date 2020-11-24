import { Component, OnInit, AfterViewInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { UsuarioCriteria } from '../model/usuario-criteria';
import { NivelModel } from 'app/admin/nivel/models/nivel-model';
import { UsuarioModel } from 'app/seguridad/models/usuario-model';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { CONSTANTS_SHARED } from 'app/admin/shared/constants-shared';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { TempDataService } from 'app/admin/shared/services/temp-data.service';
import { NivelService } from 'app/admin/nivel-list/service/nivel.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UsuarioEditComponent } from '../usuario-edit/usuario-edit.component';
import { UserService } from 'app/seguridad/services/user.service';
import { UsuarioDatasource } from '../service/usuario-datasource';
import { ArrayListPipe } from 'app/admin/pipe/array-list.pipe';

@Component({
  selector: 'app-usuario-admin',
  templateUrl: './usuario-admin.component.html',
  styleUrls: ['./usuario-admin.component.css'],
  providers: [ ArrayListPipe ]
})
export class UsuarioAdminComponent implements OnInit, AfterViewInit {
  titulo = 'Gestión de usuarios';
  MyDataSource: any;
  UsuarioCriteria: UsuarioCriteria = new UsuarioCriteria();
  grupoNivelList: NivelModel[] = [];
  Usuario: UsuarioModel = new UsuarioModel();
  displayedColumns = [
      'nombre',
      'apellido',
      'roles',
      'activo',
      'actions'
  ];
  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort;

  usuarioDatasource: UsuarioDatasource<UsuarioModel>;
  loading = true;
  constants = CONSTANTS_SHARED;
  disabledButton = false;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private tempDataService: TempDataService,
    private nivelService: NivelService,
    private router: Router
    ) {}

  ngOnInit() {
      const grupoSerializado =  this.tempDataService.getDataNivel1();
      this.usuarioDatasource = new UsuarioDatasource(this.userService);
      //this.cargarUsuario();
  }

  // cargarUsuario() {
  //   this.nivelService.findAll().subscribe( (data: NivelModel[]) => {
  //     this.grupoNivelList = data;
  //   });
  // }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = this.constants.itemPorPagina;
      this.usuarioDatasource.loadingSubject$.subscribe( (_loading: boolean) => {
          this.loading = _loading;
      });

      this.paginator.page.pipe(tap(() => this.searchData())).subscribe();
      this.sort.sortChange.subscribe((dir: any) => {
          this.searchData();
      });
      this.usuarioDatasource.errorSubject$.subscribe( (resultError: any) => {
        if ( resultError.ok !== undefined && resultError.ok === false) {
          this.utilitiesService.actionErrorMessages(resultError, this.snackBar);
        }
      });
      this.searchData();
  }

  searchData(): void {
      this.UsuarioCriteria.setTableElements(this.paginator, this.sort);
      this.usuarioDatasource.sort = this.sort;
      this.usuarioDatasource.paginator = this.paginator;
      this.usuarioDatasource.search(this.UsuarioCriteria);
  }

  create(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const newUsuario = new UsuarioModel();
    const dataParam = {
      grupoNivelList: this.grupoNivelList,
      itemData: newUsuario
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(UsuarioEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessCreateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  edit(usuario: UsuarioModel): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'edit-modalbox';
    dialogConfig.width = '70%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dataParam = {
      itemData: usuario
    };
    dialogConfig.data = dataParam;

    const dialogRef = this.dialog.open(UsuarioEditComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (val: any) => {
        if (val) {
          this.utilitiesService.formSuccessUpdateMessage(this.snackBar);
          this.searchData();
        }
      }
    );
  }

  grupoNivelTemas(grupoNivel: UsuarioModel): void {
    this.tempDataService.setDataNivel2( JSON.stringify(grupoNivel));
    this.router.navigate(['/grupo-nivel-tema']);
  }

}

// @Pipe({name: 'list-array'})
// export class ListArrayPipe implements PipeTransform {
//   transform (input: any[], key: string): any {
//       return input.map(value => value[key]);
//   }
// }
