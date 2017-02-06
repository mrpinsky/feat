const fs = require('fs');

const Feat = require('./feat').Feat;

const f = new Feat();
f.route({
  path: '/',
  handler: (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(fs.readFileSync('./src/home.html'));
  }
});

f.route({
  path: '/api',
  handler: (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>API</title>
      </head>
      <body>
        <h1>API</h1>
        <p>API stuff will go here</p>
      </body>
      </html>
    `);
  }
})

f.route({
  path: '/api/:id',
  handler: (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>API</title>
      </head>
      <body>
        <h1>API</h1>
        <p>${JSON.stringify(request.params, null, 2)}</p>
      </body>
      </html>
    `);
  }
});

f.route({
  path: '/api/:id',
  handler: (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(`DELETED: ${request.params.id}`);
  },
  method: 'DELETE',
})

f.start(() => {
  console.log('rollin');
});
