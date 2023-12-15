const Hapi = require('@hapi/hapi'); //gunakan frameWork Hapi sesuai aturan tidak boleh menggunakan framework nodejs selain si Hapi
const routes = require('./route');
const init = async () => {
    const server = Hapi.server({
      port: 9000, // port berjalan di 9000 sesuai dengan kriteria pertama
      host: 'localhost',
      routes: {
        cors: {
          origin: ['*'],
        },
      },
    });
    //start-dev tidak menggunakan nodemon melainkan menggunakan node-dev 
    server.route(routes);
  
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
  };
  
  init();