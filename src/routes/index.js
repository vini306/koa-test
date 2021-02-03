const Router = require('koa-router');
const PORT = process.env.PORT || 3000;
const { listUser, createUser, updateUser, deleteUser, userByName} =  require('../controller/UserController')
const models = require('../models')
const router = new Router();
const KoaBody = require('koa-body')
//routes for user
router
  .get('/users', listUser)
  .get('/user/:nome', userByName)
  .post('/user', KoaBody(), createUser )
  .put('/user/:id', KoaBody(), updateUser)
  .delete('/user/:id', deleteUser);

router.get('/', async (ctx, next) => {
  try {
    await models.sequelize.authenticate();
    ctx.status = 200;
    console.log('Connection has been established successfully.');
  } catch (error) {
    ctx.status = 500;
    console.error('Unable to connect to the database:', error);
  }
})

module.exports = {
  routes(){return router.routes()},
  allowedMethods () { return router.allowedMethods() }
};
