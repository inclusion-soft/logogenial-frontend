import { BehaviorSubject, Observable } from "rxjs";
import { CollectionViewer } from "@angular/cdk/collections";
import { MatSnackBar } from "@angular/material";
import { UtilitiesService } from "app/admin/shared/services/utilities.service";
import { error } from "@angular/compiler/src/util";
import { GrupoService } from './grupo.service';
import { GrupoCriteria } from '../model/grupo-criteria';
import { GrupoModel} from '../model/grupo-model';

export class GrupoDataSource <GrupoModel> {
  private grupoSubject = new BehaviorSubject<GrupoModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<any>({});
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();
  public errorSubject$ = this.errorSubject.asObservable();
  sort: any;
  paginator: any;
  public grupoData: any;

  constructor(
    private grupoService: GrupoService) {}

  connect(collectionViewer: CollectionViewer): Observable<GrupoModel[]> {
      return this.grupoSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.grupoSubject.complete();
      this.loadingSubject.complete();
      this.countSubject.complete();
  }

  search(grupoCriteria: GrupoCriteria): void {
      this.loadingSubject.next(true);
      this.grupoService.search(grupoCriteria).subscribe((result: any) => {
          this.grupoData = result.content;
          this.grupoSubject.next(result.content);
          this.countSubject.next(result.totalElements);
          this.loadingSubject.next(false);
          this.errorSubject.next({ok: true});
      }, err => {
        this.grupoData = [];
        this.grupoSubject.next([]);
        this.countSubject.next(0);
        this.loadingSubject.next(false);
        this.errorSubject.next(err);
      });
  }
}
