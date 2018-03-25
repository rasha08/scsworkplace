'use strict';

const Hapi = require('hapi');
const path = require('path');

const fb = require('./app/firebase/firebase');

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, 'public')
      }
    }
  }
});

server.connection({
  host: 'localhost',
  port: 8081,
  routes: {
    cors: {
      origin: ['*']
    }
  }
});

// Users API
// server.route(require('./api/users/routes/register'));
// server.route(require('./api/users/routes/login'));

// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    const databaseRef = fb.database.ref('/');


    setTimeout(() => {
      // console.dir( databaseRef);
      // fb.auth();
      databaseRef.on('value', snapshot => {
        console.log('HERE')
        console.log(snapshot.val())
      })
    }, 5000)

    console.log('Server running at:', server.info.uri);
};

start();