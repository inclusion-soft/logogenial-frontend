import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { tap } from 'rxjs/operators';
import {NivelModel} from '../nivel/models/nivel-model';
import { NivelDatasource} from '../nivel/models/nivel-datasource';
import { NivelService } from './service/nivel.service';
import { NivelCriteria } from '../nivel/models/nivel-criteria';
import {CONSTANTS_SHARED} from '../shared/constants-shared';

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
  ];
  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false })
  sort: MatSort = new MatSort;

  nivelDatasource!: NivelDatasource<NivelModel>;
  loading = true;
  constants = CONSTANTS_SHARED;
  constructor(private nivelService: NivelService) {}

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
      this.searchData();
  }

  searchData(): void {
      this.NivelCriteria.setTableElements(this.paginator, this.sort);
      this.nivelDatasource.sort = this.sort;
      this.nivelDatasource.paginator = this.paginator;
      this.nivelDatasource.search(this.NivelCriteria);
  }
}
