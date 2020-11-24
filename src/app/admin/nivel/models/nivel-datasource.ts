import { BehaviorSubject, Observable } from "rxjs";
import { NivelService } from "app/admin/nivel-list/service/nivel.service";
import { CollectionViewer } from "@angular/cdk/collections";
import { NivelCriteria } from "./nivel-criteria";
import { NivelModel } from "./nivel-model";
import { MatSnackBar } from "@angular/material";
import { UtilitiesService } from "app/admin/shared/services/utilities.service";
import { error } from "@angular/compiler/src/util";

export class NivelDatasource <NivelModel> {
  private nivelSubject = new BehaviorSubject<NivelModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<any>({});
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();
  public errorSubject$ = this.errorSubject.asObservable();
  sort: any;
  paginator: any;
  public nivelData: any;

  constructor(
    private nivelService: NivelService) {}

  connect(collectionViewer: CollectionViewer): Observable<NivelModel[]> {
      return this.nivelSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.nivelSubject.complete();
      this.loadingSubject.complete();
      this.countSubject.complete();
  }

  search(nivelCriteria: NivelCriteria): void {
      this.loadingSubject.next(true);
      this.nivelService.search(nivelCriteria).subscribe((result: any) => {
          this.nivelData = result.content;
          this.nivelSubject.next(result.content);
          this.countSubject.next(result.totalElements);
          this.loadingSubject.next(false);
          this.errorSubject.next({ok: true});
      }, err => {
        this.nivelData = [];
        this.nivelSubject.next([]);
        this.countSubject.next(0);
        this.loadingSubject.next(false);
        this.errorSubject.next(err);
      });
  }
}
