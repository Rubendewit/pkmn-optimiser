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
  res.json({ message: 'Running mighty & fine!' });
});

// REGISTER OUR ROUTES -------------------------------
fs.readdir(routesDir, (err, files) => {
  files.forEach(file => {
    const installRoutes = require(path.join(routesDir, file));
    installRoutes.default(app);
  });

  app.listen(port, () => {
    console.log('Magic happens on port ' + port);
  });
});
