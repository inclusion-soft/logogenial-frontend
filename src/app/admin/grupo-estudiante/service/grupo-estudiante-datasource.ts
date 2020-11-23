import { BehaviorSubject, Observable } from "rxjs";
import { CollectionViewer } from "@angular/cdk/collections";
import { GrupoEstudianteService } from "./grupo-estudiante.service";
import { GrupoEstudianteCriteria } from "../model/grupo-estudiante-criteria";

export class GrupoEstudianteDatasource <GrupoEstudianteModel> {
  private nivelesSubject = new BehaviorSubject<GrupoEstudianteModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<any>({});
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();
  public errorSubject$ = this.errorSubject.asObservable();
  sort: any;
  paginator: any;
  public grupoEstudiantesData: any;

  constructor(
    private nivelesService: GrupoEstudianteService) {}

  connect(collectionViewer: CollectionViewer): Observable<GrupoEstudianteModel[]> {
      return this.nivelesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.nivelesSubject.complete();
      this.loadingSubject.complete();
      this.countSubject.complete();
  }

  search(nivelesCriteria: GrupoEstudianteCriteria): void {
      this.loadingSubject.next(true);
      this.nivelesService.search(nivelesCriteria).subscribe((result: any) => {
          this.grupoEstudiantesData = result.content;
          this.nivelesSubject.next(result.content);
          this.countSubject.next(result.totalElements);
          this.loadingSubject.next(false);
          this.errorSubject.next({ok: true});
      }, err => {
        this.grupoEstudiantesData = [];
        this.nivelesSubject.next([]);
        this.countSubject.next(0);
        this.loadingSubject.next(false);
        this.errorSubject.next(err);
      });
  }
}

