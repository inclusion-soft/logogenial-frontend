import { Persona } from './persona';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export class PersonaCriteria extends Persona {
  setTableElements(paginator: MatPaginator, sort: MatSort) {
      throw new Error("Method not implemented.");
  }
    

  /** Filtro para identificar si es activo */
  public activo = true;
  /** Filtro de la pagina actual usado para paginador */
  public page = 0;
  /** Filtro de cantidad de registros por página */
  public size = 15;
  /** nombre de la columna por la cual se realizará el ordenamiento */
  public sortBy = 'apellidos';
  /** tipo de ordenamiento de la grilla */
  public sortOrder = 'asc';

  public sortOrderNumber = 0;

  /** Método encargado de crear uns instancia vacía del componente */
  constructor() {
      super();
      this.nombres = '';
      this.apellidos = '';
  }

  /** Método encargado de construir el json de consulta de información para el servicio */
  public getUrlParameters(): string {
    return 'nombres=' + this.nombres +
      '&apellidos=' + this.apellidos +
      '&activo=' + this.activo +
      '&page=' + (this.page) +
      '&size=' + this.size +
      '&sortBy=' + this.sortBy +
      '&sortOrder=' + this.sortOrder;
  }
}
