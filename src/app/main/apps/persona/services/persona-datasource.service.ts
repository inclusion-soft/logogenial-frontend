import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import { PersonaService } from './persona.service';

@Injectable({
  providedIn: 'root'
})
export class PersonaDatasourceServiceDataSource<Persona> {

    private lessonsSubject = new BehaviorSubject<Persona[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private PersonaService: PersonaService) {

    }

    loadLessons(courseId:number,
                filter:string,
                sortDirection:string,
                pageIndex:number,
                pageSize:number) {

        this.loadingSubject.next(true);

        this.PersonaService.findAllCourses(courseId, filter, sortDirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(lessons => this.lessonsSubject.next(lessons));

    }

    connect(collectionViewer: CollectionViewer): Observable<Persona[]> {
        console.log("Connecting data source");
        return this.lessonsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.lessonsSubject.complete();
        this.loadingSubject.complete();
    }

}

