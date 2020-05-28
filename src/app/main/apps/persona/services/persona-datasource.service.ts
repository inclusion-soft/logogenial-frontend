import { BehaviorSubject, Observable, of } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import { PersonaService } from './persona.service';
import {TodoListResponse} from '../model/todo-list-response';

export class PersonaDatasource<Persona>{
 
    private personaSubject = new BehaviorSubject<Persona[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private countSubject = new BehaviorSubject<number>(0);
    public counter$ = this.countSubject.asObservable();
 
    constructor(private personaService: PersonaService) { }
 
    connect(collectionViewer: CollectionViewer): Observable<Persona[]> {
        return this.personaSubject.asObservable();
    }
 
    disconnect(collectionViewer: CollectionViewer): void {
        this.personaSubject.complete();
        this.loadingSubject.complete();
        this.countSubject.complete();
    }
 
    loadTodos(pageNumber = 0, pageSize = 10) {
        this.loadingSubject.next(true);
        this.personaService.listTodos({ pageIndex: pageNumber, pageSize: pageSize })
            // .pipe(
            //     catchError(() => of([])),
            //     finalize(() => this.loadingSubject.next(false))
            // )
            .subscribe((result: any) => {
                debugger;
                this.personaSubject.next(result.content);
                this.countSubject.next(result.totalElements);
            }
            );
    }
 
}