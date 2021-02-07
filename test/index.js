//sample test
//Para rodar os testes, use: npm test
//PS: Os testes não estão completos e alguns podem comnter erros.

// veja mais infos em:
//https://mochajs.org/
//https://www.chaijs.com/
//https://www.chaijs.com/plugins/chai-json-schema/
//https://developer.mozilla.org/pt-PT/docs/Web/HTTP/Status (http codes)

const app =  require('../src/index.js');

const assert = require('assert');
const chai = require('chai')
const chaiHttp = require('chai-http');
const chaiJson = require('chai-json-schema');
const models = require('../src/models');
chai.use(chaiHttp);
chai.use(chaiJson);

const expect = chai.expect;

const path = require('path');
const fs = require('fs');
//Define o minimo de campos que o usuário deve ter. Geralmente deve ser colocado em um arquivo separado
const userSchema = {
    title: "Schema do Usuario, define como é o usuario, linha 24 do teste",
    type: "object",
    required: ['nome', 'email', 'idade'],
    properties: {
        nome: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        idade: {
            type: 'number',
            minimum: 18
        }
    }
}

//Inicio dos testes


//este teste é simplesmente pra enteder a usar o mocha/chai
describe('Um simples conjunto de testes', function () {
    it('deveria retornar -1 quando o valor não esta presente', function () {
        assert.equal([1, 2, 3].indexOf(4), -1);
    });
});

//testes da aplicação
describe('Testes da aplicaçao',  () => {
    it('o servidor esta online', function (done) {
        chai.request(app)
        .get('/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });

    it('deveria ser uma lista vazia de usuarios', function (done) {
        chai.request(app)
        .get('/users')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.rows).to.eql([]);
          done();
        });
    });

    it('deveria criar o usuario raupp', function (done) {
        chai.request(app)
        .post('/user')
        .send({nome: "raupp", email: "jose.raupp@devoz.com.br", idade: 35})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            done();
        });
    });

    it('deveria criar o usuario bruno', function (done) {
      chai.request(app)
      .post('/user')
      .send({nome: "bruno", email: "bruno@devoz.com.br", idade: 20})
      .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
      });
    });

    it('deveria criar o usuario daniel', function (done) {
      chai.request(app)
      .post('/user')
      .send({nome: "daniel", email: "daniel@devoz.com.br", idade: 44})
      .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
    });
    });

    it('deveria criar o usuario vinicius', function (done) {
      chai.request(app)
      .post('/user')
      .send({nome: "vinicius", email: "vinicius@devoz.com.br", idade: 24})
      .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
      });
    });

    it('deveria criar o usuario maria', function (done) {
      chai.request(app)
      .post('/user')
      .send({nome: "maria", email: "maria@devoz.com.br", idade: 18})
      .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
      });
    });

    it('deveria criar o usuario matheus', function (done) {
      chai.request(app)
      .post('/user')
      .send({nome: "matheus", email: "matheus@devoz.com.br", idade: 27})
      .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
      });
    });

    it('não deveria criar o usuario marcela', function (done) {
      chai.request(app)
      .post('/user')
      .send({nome: "marcela", email: "marcela@devoz.com.br", idade: 15})
      .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          done();
      });
    });

    it('não deveria criar o usuario carlos', function (done) {
      chai.request(app)
      .post('/user')
      .send({nome: "carlos", email: "carlos@devoz.com.br", idade: 12})
      .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          done();
      });
    });
    //...adicionar pelo menos mais 5 usuarios. se adicionar usuario menor de idade, deve dar erro. Ps: não criar o usuario naoExiste

    it('o usuario naoExiste não existe no sistema', function (done) {
        chai.request(app)
        .get('/user/naoExiste')
        .end(function (err, res) {
            expect(err).to.be.null; //possivelmente forma errada de verificar a mensagem de erro
            expect(res).to.have.status(404);
            expect(res.body.message).to.be.equal("User not found");
            done();
        });
    });

    it('o usuario raupp existe e é valido', function (done) {
        chai.request(app)
        .get('/user/raupp')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.jsonSchema(userSchema);
            done();
        });
    });

    it('deveria excluir o usuario raupp', function (done) {
        chai.request(app)
        .delete('/user/raupp')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.jsonSchema(userSchema);
            done();
        });
    });

    it('deveria atualizar maria', function (done) {
      chai.request(app)
      .put('/user/5')
      .send({ nome:  "Maria", email: "maria@maria.com.br"})
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).have.includes({ nome:  "Maria", email: "maria@maria.com.br"})
        done();
      })
    });

    it('o usuario raupp não deve existir mais no sistema', function (done) {
      chai.request(app)
      .get('/user/raupp')
      .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body.message).to.be.equal("User not found");
          done();
      });
    });

    it('deveria ser uma lista com pelo menos 5 usuarios', function (done) {
        chai.request(app)
        .get('/users')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.total).to.be.at.least(5);
          done();
        });
    });

    it('deleta o banco', async function (done) {
        dropDatabase();
        done();
    })


})


async function dropDatabase(){
  await models.sequelize.close();
  fs.unlink(path.resolve(__dirname, 'database.sqlite3'), function (err){
    console.log(err)
  })
}
