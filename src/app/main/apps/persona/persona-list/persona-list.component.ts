import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, fromEvent, Observable, merge, BehaviorSubject } from 'rxjs';
import {
    takeUntil,
    debounceTime,
    distinctUntilChanged,
    map,
    tap,
} from 'rxjs/operators';
import { Persona } from '../model/persona';
import { PersonaService } from '../services/persona.service';
import { PersonaDatasource } from '../services/persona-datasource.service';
import { fuseAnimations } from '@fuse/animations';
import { PersonaCriteria } from '../model/persona-criteria';

@Component({
    selector: 'app-persona-list',
    templateUrl: './persona-list.component.html',
    styleUrls: ['./persona-list.component.scss'],
    animations: fuseAnimations,
})
export class PersonaListComponent implements OnInit {
    MyDataSource: any;
    personaCriteria: PersonaCriteria = new PersonaCriteria();
    Persona: Persona;
    displayedColumns = [
        'id',
        'nombres',
        'apellidos',
        'telefono',
        'correo',
        'direccion',
        'active',
    ];
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    personaDatasource: PersonaDatasource<Persona>;
    loading = true;

    constructor(private personaService: PersonaService) {}

    ngOnInit() {
        this.personaDatasource = new PersonaDatasource(this.personaService);
    }

    ngAfterViewInit(): void {
        this.personaDatasource.counter$
            .pipe(
                tap((count) => {
                    this.paginator.length = count;
                })
            )
            .subscribe();
        this.personaDatasource.loadingSubject$.subscribe( (_loading: boolean) => {
            this.loading = _loading;
        })

        this.paginator.page.pipe(tap(() => this.searchData())).subscribe();
        this.sort.sortChange.subscribe((dir) => {
            this.searchData();
        });
        this.searchData();
    }

    searchData(): void {
        this.personaCriteria.setTableElements(this.paginator, this.sort);
        this.personaDatasource.sort = this.sort;
        this.personaDatasource.paginator = this.paginator;
        this.personaCriteria.page = this.paginator.pageIndex;
        this.personaCriteria.size = this.paginator.pageSize;
        this.personaCriteria.sortOrder = this.sort.direction;
        this.personaCriteria.sortBy = this.sort.active;
        this.personaDatasource.search(this.personaCriteria);
    }
}
