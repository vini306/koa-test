const models = require('../models')
const Joi = require('joi');


//Define user validation parameter for requests
const userSchema = Joi.object().keys({
  nome: Joi.string().trim().required(),
  idade: Joi.number().min(18).required(),
  email: Joi.string().trim().email().required()
});

const updateUserSchema = Joi.object().keys({
  nome: Joi.string().trim(),
  idade: Joi.number().required(),
  email: Joi.string().trim().email()
});
//Service for retrive all user
module.exports.listUser = async function listUser(ctx,next){
  const limit = ctx.query.size || 10;
  const offset = ( ctx.query.pages * ctx.query.size) || 0;
  //return all users
  const { count: total, rows} = await models.User.findAndCountAll({
    offset,
    limit,
    attributes:
      { exclude: ['updatedAt','createdAt'] }
    },
  );
  ctx.body =  { rows, total}
  await next();
}

//Service for create user
module.exports.createUser = async function createUser(ctx,next){
  //Validation body parameter
  var params = userSchema.validate(ctx.request.body);

  if(params.error){
    //if not valid, return a bad request with error
    ctx.status = 400;
    ctx.body = params.error.details.map(det => ({message: det.message}));
    await next();
    return;
  }
  //create user
  await models.User.create(ctx.request.body);
  ctx.status = 201;
  await next();
}

//Service for update user
module.exports.updateUser = async function updateUser(ctx, next){
  var params = updateUserSchema.validate(ctx.request.body);
  if(params.error){
    ctx.status = 400;
    ctx.body = params.error.details.map(det => ({error: det.message}));
    await next();
    return;
  }
  if(!ctx.request.body){
    ctx.status = 400;
    ctx.body = { error: "Empty body request" }
    await next();
    return;
  }
  const user = await models.User.findOne({
    where: {
      id: ctx.params.id
    }
  });
  if(!user){
    ctx.status = 404;
    ctx.body = { error: "User not found"};
  }
  await models.User.update(ctx.request.body,{
    where: {
      id: ctx.params.id
    },
    returning: true
  });
  ctx.body = await models.User.findOne({
    where: {
      id: ctx.params.id
    },
    attributes: {
      exclude: ['updatedAt' , 'createdAt']
    }
  });
  await next();
}

//Service for delete user
module.exports.deleteUser = async function deleteUser(ctx, next){
  //Verify if exists user
  const user = await models.User.findOne({
    where: {
      nome: ctx.params.nome
    },
    attributes: {
      exclude: [ 'createdAt' , 'updatedAt']
    }
  })
  if(!user){
    //if not exixts return not accepted
    ctx.status = 406;
    ctx.body = { error: 'User not found'}
    await next();
    return;
  }
  //if exists delete him
  await user.destroy();
  ctx.status = 200;
  ctx.body = user;
  await next();
}

//This function get a user by name
module.exports.userByName = async function userByName(ctx, next) {
  const user = await models.User.findOne({
    where: {
      nome: ctx.params.nome
    },
    attributes: {
      exclude: [  'createdAt' , 'updatedAt' ]
    }
  });
  if(!user){
    ctx.status = 404;
    ctx.body = { message : "User not found" };
    await next();
    return;
  }
  ctx.body = user;
  await next();
}
