//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev

//mais infos
//https://github.com/ZijianHe/koa-router

// todas as configuraçoes devem ser passadas via environment variables
const PORT = process.env.NODE_ENV == 'test' ? 3999 : process.env.PORT || 3000;

const Koa = require('koa');
const Router = require('koa-router');
const { koaSwagger } = require('koa2-swagger-ui');
const path  = require('path');
const yamljs = require('yamljs');
const koa = new Koa();
const {routes , allowedMethods} = require('./routes');

const spec = yamljs.load(path.resolve(__dirname, '..' , 'swagger.yaml'));

koa
  .use(routes())
  .use(allowedMethods())
  .use(koaSwagger({
    routePrefix: '/swagger',
    swaggerOptions: {spec}
  }));

const server = koa.listen(PORT);

module.exports = server;
