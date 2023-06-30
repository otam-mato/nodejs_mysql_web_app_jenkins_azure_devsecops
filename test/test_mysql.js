const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

describe('App', function() {
  it('should return all entries in the database as JSON', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/entries')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array'); // Ensure the response is an array
        expect(res.body.length).to.be.greaterThan(0); // Ensure the response array is not empty
        
        const supplier = res.body[0]; // Assuming the response contains an array of supplier objects
        expect(supplier).to.have.property('id');
        expect(supplier).to.have.property('name');
        expect(supplier.id).to.be.a('number');
        expect(supplier.name).to.be.a('string');
        done();
      });
   });

  it('should return the response is an array', function(done) {
    chai
      .request('http://localhost:3000')
      .get('/entries')
      .end(function(err, res) {
        expect(res.body).to.be.an('array'); // Ensure the response is an array
        done();
      });
   });
});
