const http = require('http');
const fs = require('fs');

const hostname = 'localhost';
const port = '4000';

class Feat {
  constructor(opts) {
    const options = Object.assign(
      {},
      {
        hostname: 'localhost',
        port: '4000',
        routes: [],
      },
      opts
    );

    this.hostname = options.hostname;
    this.port = options.port;
    this.routes = options.routes;;
  }

  matchPath(request, savedPath) {
    return request.url.slice(1).split('/')
      .map((segment, i) => {
        if (savedPath[i] === undefined) {
          return false;
        } else if (savedPath[i].charAt(0) === ':') {
          if (!request.params) {
            request.params = {};
          }
          request.params[savedPath[i].slice(1)] = segment;
          return true;
        } else {
          return savedPath[i] === segment;
        }
      })
      .reduce((acc, curr) => acc && curr, true);
  }

  route({ path, handler, method }) {
    const httpMethod = method || 'get';
    const splitPath = (path.charAt(0) === '/' ? path.slice(1) : path).split('/');

    const newRoute = {
      path: splitPath,
      handler: handler,
      method: httpMethod.toUpperCase(),
    };
    this.routes.push(newRoute);
  }

  start(callback) {
    this.server = http.createServer((request, response) => {
      for (let i = 0; i < this.routes.length; i++) {
        const route = this.routes[i];
        console.log(request.method);
        console.log(JSON.stringify(route, null, 2));
        if (request.method === route.method && this.matchPath(request, route.path)) {
          this.routes[i].handler(request, response);
          return;
        }
      }

      response.writeHead(404, { 'Content-Type': 'text/html' });
      const pathsAsHtml = this.routes.map(route => `<li>/${route.path.join('/')}</li>`)
        .reduce((acc, curr) => acc.concat(curr));
      response.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>NOT FOUND</title>
        </head>
        <body>
          <h1>404 Not Found</h1>
          <p>Please check your path and try again.</p>
          <p>Available paths are:
            <ul>${pathsAsHtml}</ul>
          </p>
        </body>
        </html>
      `);
      response.end();
    });

    this.server.listen(this.port, this.hostname, () => {
      console.log(`Server running at http://${this.hostname}:${this.port}/`);
    });

    callback();
  }

  close(callback) {
    this.server.close();
    this.server = undefined;
  }
}

module.exports = { Feat };
