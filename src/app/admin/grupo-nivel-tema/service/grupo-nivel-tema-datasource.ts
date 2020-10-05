import { BehaviorSubject, Observable } from "rxjs";
import { CollectionViewer } from "@angular/cdk/collections";
import { GrupoNivelTemaCriteria } from "../model/grupo-nivel-tema-criteria";
import { GrupoNivelTemaService } from "./grupo-nivel-tema.service";

export class GrupoNivelTemaDatasource <GrupoNivelTemaModel> {
  private nivelesSubject = new BehaviorSubject<GrupoNivelTemaModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<any>({});
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();
  public errorSubject$ = this.errorSubject.asObservable();
  sort: any;
  paginator: any;
  public nivelesData: any;

  constructor(
    private nivelesService: GrupoNivelTemaService) {}

  connect(collectionViewer: CollectionViewer): Observable<GrupoNivelTemaModel[]> {
      return this.nivelesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.nivelesSubject.complete();
      this.loadingSubject.complete();
      this.countSubject.complete();
  }

  search(nivelesCriteria: GrupoNivelTemaCriteria): void {
      this.loadingSubject.next(true);
      this.nivelesService.search(nivelesCriteria).subscribe((result: any) => {
          this.nivelesData = result.content;
          this.nivelesSubject.next(result.content);
          this.countSubject.next(result.totalElements);
          this.loadingSubject.next(false);
          this.errorSubject.next({ok: true});
      }, err => {
        this.nivelesData = [];
        this.nivelesSubject.next([]);
        this.countSubject.next(0);
        this.loadingSubject.next(false);
        this.errorSubject.next(err);
      });
  }
}
