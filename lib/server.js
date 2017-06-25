/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();

const port = process.env.PORT || 8080;
const router = express.Router();
const routesDir = path.join(__dirname, 'routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);

router.get('/', (req, res) => {
  res.json({ message: 'Got my running shoes on!' });
});

fs.readdir(routesDir, (err, files) => {
  files.forEach(file => {
    const installRoutes = require(path.join(routesDir, file));
    installRoutes.default(app);
  });

  app.listen(port, () => {
    console.log('Catching \'mons on port ' + port);
  });
});