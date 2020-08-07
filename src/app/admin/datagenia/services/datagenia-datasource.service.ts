import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatageniaService } from './datagenia.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { DatageniaCriteria } from '../models/datagenia-criteria';

@Injectable({
  providedIn: 'root'
})
export class DatageniaDatasourceService <DatageniaModel> {
  private temaSubject = new BehaviorSubject<DatageniaModel[]>([]);
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
    private temaService: DatageniaService) {}

  connect(collectionViewer: CollectionViewer): Observable<DatageniaModel[]> {
      return this.temaSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.temaSubject.complete();
      this.loadingSubject.complete();
      this.countSubject.complete();
  }

  search(temaCriteria: DatageniaCriteria): void {
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
