import { BehaviorSubject, Observable } from "rxjs";
import { UserService } from "app/seguridad/services/user.service";
import { CollectionViewer } from "@angular/cdk/collections";
import { UsuarioCriteria } from "../model/usuario-criteria";

export class UsuarioDatasource  <UsuarioModel> {
  private usuariosSubject = new BehaviorSubject<UsuarioModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<any>({});
  private countSubject = new BehaviorSubject<number>(0);
  public counter$ = this.countSubject.asObservable();
  public loadingSubject$ = this.loadingSubject.asObservable();
  public errorSubject$ = this.errorSubject.asObservable();
  sort: any;
  paginator: any;
  public usuariosData: any;

  constructor(
    private userService: UserService) {}

  connect(collectionViewer: CollectionViewer): Observable<UsuarioModel[]> {
      return this.usuariosSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.usuariosSubject.complete();
      this.loadingSubject.complete();
      this.countSubject.complete();
  }

  search(usuarioCriteria: UsuarioCriteria): void {
      this.loadingSubject.next(true);
      this.userService.search(usuarioCriteria).subscribe((result: any) => {
          this.usuariosData = result.content;
          this.usuariosSubject.next(result.content);
          this.countSubject.next(result.totalElements);
          this.loadingSubject.next(false);
          this.errorSubject.next({ok: true});
      }, err => {
        this.usuariosData = [];
        this.usuariosSubject.next([]);
        this.countSubject.next(0);
        this.loadingSubject.next(false);
        this.errorSubject.next(err);
      });
  }
}

