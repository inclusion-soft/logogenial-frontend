
import { BehaviorSubject, Observable } from "rxjs";
import { CollectionViewer } from "@angular/cdk/collections";
import { GrupoNivelService } from "./grupo-nivel.service";
import { GrupoNivelCriteria } from "../model/grupo-nivel-criteria";

export class GrupoNivelDatasource <GrupoNivelModel> {
  private nivelesSubject = new BehaviorSubject<GrupoNivelModel[]>([]);
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
    private nivelesService: GrupoNivelService) {}

  connect(collectionViewer: CollectionViewer): Observable<GrupoNivelModel[]> {
      return this.nivelesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.nivelesSubject.complete();
      this.loadingSubject.complete();
      this.countSubject.complete();
  }

  search(nivelesCriteria: GrupoNivelCriteria): void {
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
