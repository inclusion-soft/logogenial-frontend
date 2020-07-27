import { BehaviorSubject, Observable } from "rxjs";
import { NivelService } from "app/admin/nivel-list/service/nivel.service";
import { CollectionViewer } from "@angular/cdk/collections";
import { NivelCriteria } from "./nivel-criteria";
import { NivelModel } from "./nivel-model";

export class NivelDatasource <NivelModel> {
  private nivelSubject = new BehaviorSubject<NivelModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();
  sort: any;
  paginator: any;
  public nivelData: any;

  constructor(private nivelService: NivelService) {}

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
      });
  }
}
