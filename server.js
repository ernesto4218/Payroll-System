import express from 'express';
import path, { format } from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import adminRouter from './routes/admin.js';
import expressjslayout from 'express-ejs-layouts'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import {VERIFY_AUTH} from './db/services.js';
import { generateAuthToken, hashPassword, formatDate } from './routes/helpers.js';
import db from './db/db.js'

dotenv.config();

const app = express();
const port = process.env.PORT;

// __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: '50mb' })); // allow up to 50MB payload
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
app.use(cookieParser());

// EJS setup
app.use(expressjslayout);
app.set('layout', './layouts/full-width');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/login', (req, res) => {
  const data = {
    title: "Login"
  }
  res.render('global/login', data);
});


app.get('/logout', (req, res) => {
  res.clearCookie('auth_token'); // remove the cookie
  res.redirect('/login');
});

app.get('/', (req, res) => {
  res.clearCookie('auth_token'); // remove the cookie
  res.redirect('/login');
});

app.use('/api', apiRouter);
app.use('/admin', verifyAuth, adminRouter);


async function verifyAuth(req, res, next) {
  // Paths to exclude from auth middleware
  const excludedPaths = ['/admin/login', '/admin/login/', '/createacc', '/api/login', '/api/login/', '/login', '/tmida/login', '/bcsrs/login', 'capturedincident', '/capturedincident/', '/capturedincident', '/captured_incident', '/residents/', '/resident', '/resident/login'];
  console.log(req.path);
  // Check if current path is excluded (and optionally method)
  if (excludedPaths.includes(req.path)) {
    return next();
  }

  const token = req.cookies?.auth_token;

  if (!token) {
    // For API calls, better send 401 JSON error, not redirect
    if (req.method === 'POST' || req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    console.log('no token');
    return res.redirect('/login');
  }

  const verify = await VERIFY_AUTH(token);

  if (!verify || !verify.id) {
    if (req.method === 'POST' || req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(401).json({ message: 'Invalid authentication' });
    }
    return res.redirect('/login');
  }

  req.user_id = verify.id;
  req.role = verify.role;
  req.name = verify.full_name;

  console.log("Verified ID: ", req.user_id);
  console.log("Verified role: ", req.role);
  console.log("Verified name: ", req.name);

  next();
}

// cdn
app.use('/cdn/', express.static(path.join(__dirname, 'node_modules/')));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
