import { UsuarioModel } from 'app/seguridad/models/usuario-model';

export class GrupoModel {
    id = 0;
    nombre!: string;
    anio!: number;
    activo!: boolean;
    usuario!: UsuarioModel;
    public constructor() {
      this.activo = true;
    }
  }
