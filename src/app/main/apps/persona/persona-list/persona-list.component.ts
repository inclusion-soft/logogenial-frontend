import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// import { EcommerceProductsService } from '../../e-commerce/products/products.service';
import { Subject, fromEvent, Observable, merge, BehaviorSubject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/table';
import { FuseUtils } from '@fuse/utils';
import { ActivatedRoute } from '@angular/router';
import { Persona } from '../model/persona';

@Component({
  selector: 'app-persona-list',
  templateUrl: './persona-list.component.html',
  styleUrls: ['./persona-list.component.scss']
})
export class PersonaListComponent implements OnInit
{
    Persona: Persona;

    dataSource: LessonsDataSource;
    displayedColumns = ['id', 'nombres', 'apellidos', 'telefono', 'correo', 'direccion', 'active'];

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    @ViewChild(MatSort, { static: true }) sort: MatSort;

    @ViewChild('input', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute,
                private PersonaService: PersonaService) {

    }

    ngOnInit() {

        this.Persona = this.route.snapshot.data['Persona'];

        this.dataSource.loadLessons(this.Persona.id, '', 'asc', 0, 3);

    }

    ngAfterViewInit() {

        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        fromEvent(this.input.nativeElement,'keyup')
            .pipe(
                debounceTime(150),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;

                    this.loadLessonsPage();
                })
            )
            .subscribe();

        merge(this.sort.sortChange, this.paginator.page)
        .pipe(
            tap(() => this.loadLessonsPage())
        )
        .subscribe();

    }

    loadLessonsPage() {
        this.dataSource.loadLessons(
            this.Persona.id,
            this.input.nativeElement.value,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize);
    }
}
