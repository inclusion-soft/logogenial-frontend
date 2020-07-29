import { BehaviorSubject, Observable } from "rxjs";
import { TemaService } from "../services/tema.service";
import { CollectionViewer } from "@angular/cdk/collections";
import { TemaCriteria } from "./tema-criteria";

export class TemaDatasource <TemaModel> {
  private temaSubject = new BehaviorSubject<TemaModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<any>({});
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();
  public errorSubject$ = this.errorSubject.asObservable();
  sort: any;
  paginator: any;
  public temaData: any;

  constructor(
    private temaService: TemaService) {}

  connect(collectionViewer: CollectionViewer): Observable<TemaModel[]> {
      return this.temaSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.temaSubject.complete();
      this.loadingSubject.complete();
      this.countSubject.complete();
  }

  search(temaCriteria: TemaCriteria): void {
      this.loadingSubject.next(true);
      this.temaService.search(temaCriteria).subscribe((result: any) => {
          this.temaData = result.content;
          this.temaSubject.next(result.content);
          this.countSubject.next(result.totalElements);
          this.loadingSubject.next(false);
          this.errorSubject.next({ok: true});
      }, err => {
        this.temaData = [];
        this.temaSubject.next([]);
        this.countSubject.next(0);
        this.loadingSubject.next(false);
        this.errorSubject.next(err);
      });
  }
}
