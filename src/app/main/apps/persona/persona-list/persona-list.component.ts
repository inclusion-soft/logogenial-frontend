import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, fromEvent, Observable, merge, BehaviorSubject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/table';
import { FuseUtils } from '@fuse/utils';
import { ActivatedRoute } from '@angular/router';
import { Persona } from '../model/persona';
import { PersonaService } from '../services/persona.service';
import { PersonaDatasource } from '../services/persona-datasource.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-persona-list',
  templateUrl: './persona-list.component.html',
  styleUrls: ['./persona-list.component.scss'],
  animations   : fuseAnimations
})
export class PersonaListComponent implements OnInit
{
    Persona: Persona;
    displayedColumns = ['id', 'nombres', 'apellidos', 'telefono', 'correo', 'direccion', 'active'];
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    personaDatasource: PersonaDatasource<Persona>;
  
    constructor(private personaService: PersonaService) { }
  
    ngOnInit() {
      this.personaDatasource = new PersonaDatasource(this.personaService);
      this.personaDatasource.loadTodos();
    }
  
    ngAfterViewInit() {
      this.personaDatasource.counter$
        .pipe(
          tap((count) => {
            this.paginator.length = count;
          })
        )
        .subscribe();
  
      this.paginator.page
        .pipe(
          tap(() => this.loadTodos())
        )
        .subscribe();
    }
  
    loadTodos() {
      this.personaDatasource.loadTodos(this.paginator.pageIndex, this.paginator.pageSize);
    }
  
  
  }
