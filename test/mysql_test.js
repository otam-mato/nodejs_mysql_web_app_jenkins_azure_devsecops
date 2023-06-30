const chai = require('chai');const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

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

  it('should return all entries in the database as JSON', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/entries')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        // Add additional assertions as needed to validate the response data
        done();
      });
  });
});
