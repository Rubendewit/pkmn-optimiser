/* eslint-disable no-console */
import fs from 'fs';
import request from 'request';
import path from 'path';

export const download = (uri, filename, callback) => {
  request.head(uri, (err, res) => {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    const pathname = path.join(__dirname, '..', 'static', 'images', filename);
    request(uri).pipe(fs.createWriteStream(pathname)).on('close', callback);
  });
};
