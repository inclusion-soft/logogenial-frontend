import {GrupoNivelTemaModel} from '../../grupo-nivel-tema/model/grupo-nivel-tema-model';
export class LeccionModel  {
  id = 0;
  leyenda!: string;
  enumeracion!: number;
  puntos!: number;
  activo!: boolean;
  grupoNivelTema!: GrupoNivelTemaModel;
  constructor() {
    this.grupoNivelTema = new GrupoNivelTemaModel();
    this.activo = true;
  }
}
