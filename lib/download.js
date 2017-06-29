import fs from 'fs';
import request from 'request';
import path from 'path';

export const download = (uri, filename, callback) => {
  request.head(uri, function(err, res, body){
    const pathname = path.join(__dirname, 'storage', 'images', filename);
    request(uri).pipe(fs.createWriteStream(pathname)).on('close', callback);
  });
};
