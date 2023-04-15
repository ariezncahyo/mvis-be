require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./models/index.js');
const routes = require('./routes/index.js');
const compression = require('compression');

const seederUser = require('./seeders/user.seeder');

const app = express();

const corsOption = {
  origin: true,
  credentials: true,
};

app.use(compression());
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const GALLERY_DIR = '/public/images';
app.use(GALLERY_DIR, express.static(path.join(__dirname, GALLERY_DIR)));

// db.sequelize
//   .sync({ force: process.env.NODE_ENV !== "production" ? true : false })
//   .then(() => {
//     if (process.env.NODE_ENV !== "production") {
//       (async () => {
//         try {
//           await seederUser.createUser();
//         } catch (err) {
//           console.log(err);
//         }
//       })();
//     }
//   });

app.get('/', (_, res) => {
  res.send({ message: 'Awesome' });
});

routes.auth(app);
routes.user(app);

const port = process.env.PORT || 9000;
const host = process.env.HOST || 'localhost';

app.listen(port, host, () => {
  console.log(`Server is running on ${host}:${port}`);
});
