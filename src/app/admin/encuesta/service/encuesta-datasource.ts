import { BehaviorSubject, Observable } from "rxjs";
import { CollectionViewer } from "@angular/cdk/collections";
import { EncuestaCriteria } from "../model/encuesta-criteria";
import { EncuestaService } from './encuesta.service';

export class EncuestaDatasource  <EncuestaModel> {
  private encuestasSubject = new BehaviorSubject<EncuestaModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<any>({});
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();
  public errorSubject$ = this.errorSubject.asObservable();
  sort: any;
  paginator: any;
  public encuestasData: any;

  constructor(
    private userService: EncuestaService) {}

  connect(collectionViewer: CollectionViewer): Observable<EncuestaModel[]> {
      return this.encuestasSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.encuestasSubject.complete();
      this.loadingSubject.complete();
      this.countSubject.complete();
  }

  search(encuestaCriteria: EncuestaCriteria): void {
      this.loadingSubject.next(true);
      this.userService.search(encuestaCriteria).subscribe((result: any) => {
          this.encuestasData = result.content;
          this.encuestasSubject.next(result.content);
          this.countSubject.next(result.totalElements);
          this.loadingSubject.next(false);
          this.errorSubject.next({ok: true});
      }, err => {
        this.encuestasData = [];
        this.encuestasSubject.next([]);
        this.countSubject.next(0);
        this.loadingSubject.next(false);
        this.errorSubject.next(err);
      });
  }
}
