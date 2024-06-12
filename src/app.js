if (process.env.ENVIRONMENT !== 'yap-local') {
  // eslint-disable-next-line import/no-unresolved,no-unused-vars,global-require
  const tracer = require('dd-trace').init();
  tracer.use('http', {
    blocklist: ['/'],
  });
}

const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config');
const apiRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'pong' });
});

// use routes
app.use(apiRoutes);

// global error handler
app.all('*', (err, req, res, next) => {
  next('error');
});

const server = app.listen(config.APP_PORT, config.APP_HOST, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  // eslint-disable-next-line no-console
  console.info(
    `Server running on http://${config.APP_HOST}:${config.APP_PORT}`,
  );
});

// shut down server
const shutdown = () => {
  server.close((err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exitCode = 1;
    }
    process.exit();
  });
};

// This signal interrupts a process immediately.
// The default action of this signal is to terminate a process gracefully .
// It can be handled , ignored or caught.
// It can be sent from a terminal as input characters.
// This signal is generated when a user presses Ctrl+C.
process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.info(
    'Got SIGINT (aka ctrl-c in docker). Graceful shutdown ',
    new Date().toISOString(),
  );
  shutdown();
});

// This signal terminates a process immediately.
// This can also be handled ,ignored.
// This is also used for graceful termination of a process.
// The only difference is that It is generated by shell command kill by default.
process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.info(
    'Got SIGTERM (docker container stop). Graceful shutdown ',
    new Date().toISOString(),
  );
  shutdown();
});

module.exports = app;
