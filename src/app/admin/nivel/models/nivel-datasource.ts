import { BehaviorSubject, Observable } from "rxjs";
import { NivelService } from "app/admin/nivel-list/service/nivel.service";
import { CollectionViewer } from "@angular/cdk/collections";
import { NivelCriteria } from "./nivel-criteria";
import { NivelModel } from "./nivel-model";

export class NivelDatasource <NivelModel> {
  private personaSubject = new BehaviorSubject<NivelModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();
  sort: any;
  paginator: any;

  constructor(private personaService: NivelService) {}

  connect(collectionViewer: CollectionViewer): Observable<NivelModel[]> {
      return this.personaSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.personaSubject.complete();
      this.loadingSubject.complete();
      this.countSubject.complete();
  }

  search(personaCriteria: NivelCriteria): void {
      this.loadingSubject.next(true);
      this.personaService.search(personaCriteria).subscribe((result: any) => {
          this.personaSubject.next(result.content);
          this.countSubject.next(result.totalElements);
          this.loadingSubject.next(false);
      });
  }
}
