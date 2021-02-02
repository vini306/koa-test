//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev

//mais infos
//https://github.com/ZijianHe/koa-router

// todas as configuraçoes devem ser passadas via environment variables
const PORT = process.env.PORT || 3000;

const Koa = require('koa');
const Router = require('koa-router');

const koa = new Koa();
const {router , allowedMethods} = require('./routes');



koa
  .use(router())
  .use(allowedMethods());

const server = koa.listen(PORT);

module.exports = server;