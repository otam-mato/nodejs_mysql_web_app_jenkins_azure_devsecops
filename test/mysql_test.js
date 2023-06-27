const chai = require('chai');
const chaiHttp = require('chai-http');
const dbConfig = require("/var/lib/jenkins/workspace/nodejs pipeline/app/config/config.js");

const expect = chai.expect;
chai.use(chaiHttp);

describe('MySQL Container', function() {
  const mysqlHost = dbConfig.APP_DB_HOST; // Update with the host where MySQL is running
  const mysqlPort = dbConfig.APP_DB_PORT; // Update with the port on which MySQL is listening
  const mysqlUser = dbConfig.APP_DB_USER; // Update with the MySQL user
  const mysqlPassword = dbConfig.APP_DB_PASSWORD; // Update with the MySQL password
  const mysqlDatabase = dbConfig.APP_DB_NAME; // Update with the MySQL database name

  it('should be able to query the database', function(done) {
    const query = 'SELECT 1 + 1 AS result';

    chai.request(`http://${mysqlHost}:${mysqlPort}`)
      .get(`/query?user=${mysqlUser}&password=${mysqlPassword}&database=${mysqlDatabase}&query=${encodeURIComponent(query)}`)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.result).to.equal(2);
        done();
      });
  });
});

