const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);
const { describe, it } = require('mocha');

describe('MySQL Container', function() {
  it('should be able to connect to the database', function(done) {
    chai.request('http://localhost:3000')
      .get('/')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should have the "COFFEE" database', function(done) {
    chai.request('http://localhost:3000')
      .get('/suppliers')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
});
