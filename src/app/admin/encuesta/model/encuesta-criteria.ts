import { EncuestaModel } from "./encuesta-model";
import { MatPaginator, MatSort } from "@angular/material";

export class EncuestaCriteria extends EncuestaModel {
  setTableElements(paginator: MatPaginator, sort: MatSort) {
    this.page = paginator.pageIndex;
    this.size = paginator.pageSize;
    this.sortOrder = sort.direction;
    this.sortBy = sort.active;
  }


  /** Filtro para identificar si es activo */
  public activo = true;
  /** Filtro de la pagina actual usado para paginador */
  public page = 0;
  /** Filtro de cantidad de registros por página */
  public size = 10;
  /** nombre de la columna por la cual se realizará el ordenamiento */
  public sortBy = 'numeroDocumento';
  /** tipo de ordenamiento de la grilla */
  public sortOrder = 'asc';

  public sortOrderNumber = 0;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() {
      super();
      this.numeroDocumento = '';
      this.comentarios = '';
      this.email = '';
  }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
    return 'numeroDocumento=' + this.numeroDocumento +
      // '&activo=' + this.activo +
      '&page=' + (this.page) +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }
}
