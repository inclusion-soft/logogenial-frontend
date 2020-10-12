
import { CONSTANTS_SHARED } from '../../shared/constants-shared';
import {GRUPO_NIVELTEMA_CONSTANTS} from '../../grupo-nivel-tema/model/grupo-nivel-tema-constant';

export const LECCIONES_CONSTANTS = {
  tituloFormAdminLecciones: 'Gestión de Lecciones',
  enumeracion: 'Enumeracion',
  usocompartido: 'Uso compartido',
  aprobacion: 'Aprobación',
  seleccionarRespuesta: 'Seleccionar Respuesta',
  ...GRUPO_NIVELTEMA_CONSTANTS,
  ...CONSTANTS_SHARED,
};
