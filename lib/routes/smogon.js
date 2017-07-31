import { send } from '../helpers/util';
import {
  downloadSmogonImages,
  getSmogonImageNames,
  getSmogonDump
} from '../models/smogon';


export default api => {

  api.get('/api/smogon/images', getSmogonImageNames, downloadSmogonImages, send);

  api.get('/api/smogon/dump', getSmogonDump, send);

};
