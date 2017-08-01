import { send } from '../helpers/util';
import {
  downloadSmogonImages,
  getSmogonImageNames,
  getSmogonData,
  storeSmogonData
} from '../models/smogon';


export default api => {

  api.get('/api/smogon/images', getSmogonImageNames, downloadSmogonImages, send);

  api.get('/api/smogon/data', getSmogonData, storeSmogonData, send);

};
