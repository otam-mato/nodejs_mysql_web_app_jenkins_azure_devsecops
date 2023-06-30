const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

describe('App', function() {
  it('should be running on port 3000', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
});
