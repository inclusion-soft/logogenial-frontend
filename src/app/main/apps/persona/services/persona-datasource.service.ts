import { BehaviorSubject, Observable, of } from "rxjs";
import { CollectionViewer } from "@angular/cdk/collections";
import { catchError, finalize } from "rxjs/operators";
import { PersonaService } from "./persona.service";
import { TodoListResponse } from "../model/todo-list-response";
import { PersonaCriteria } from "../model/persona-criteria";

export class PersonaDatasource<Persona> {
    private personaSubject = new BehaviorSubject<Persona[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private countSubject = new BehaviorSubject<number>(0);
    public counter$ = this.countSubject.asObservable();
    public loadingSubject$ = this.loadingSubject.asObservable();
    sort: any;
    paginator: any;

    constructor(private personaService: PersonaService) {}

    connect(collectionViewer: CollectionViewer): Observable<Persona[]> {
        return this.personaSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.personaSubject.complete();
        this.loadingSubject.complete();
        this.countSubject.complete();
    }

    search(personaCriteria: PersonaCriteria): void {
        this.loadingSubject.next(true);
        this.personaService.search(personaCriteria).subscribe((result: any) => {
            this.personaSubject.next(result.content);
            this.countSubject.next(result.totalElements);
            this.loadingSubject.next(false);
        });
    }
}
