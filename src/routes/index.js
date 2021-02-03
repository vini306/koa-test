const Router = require('koa-router');
const PORT = process.env.PORT || 3000;
const { listUser, createUser, updateUser, deleteUser} =  require('../controller/UserController')
const models = require('../models')
const router = new Router();
const KoaBody = require('koa-body')
//routes for user
router
  .get('/users', listUser)
  .post('/user', KoaBody(), createUser )
  .put('/user/:id', KoaBody(), updateUser)
  .delete('/user/:id', deleteUser);



module.exports = {
  routes(){return router.routes()},
  allowedMethods () { return router.allowedMethods() }
};
