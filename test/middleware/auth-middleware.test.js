const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../../middleware/is-auth');
const next = () => {};

describe('Auth middleware', () => {
  it('Should throw an error if no athorization header is present', () => {
    const req = {
      get: (headerName) => {
        return null;
      }
    };

    expect(authMiddleware.bind(this, req, {}, next)).to.throw(
      'Not authenticated.'
    );
  });

  it('Should throw an error if the authorization header is only one string', () => {
    const req = {
      get: (headerName) => {
        return 'someString';
      }
    };

    expect(authMiddleware.bind(this, req, {}, next)).to.throw();
  });

  it('Should yield a userId after decoding the token', () => {
    const req = {
      get: (headerName) => {
        return 'Bearer zxcvalidToken';
      }
    };

    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: '1' });

    authMiddleware(req, {}, next);
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', '1');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });

  it('Should throw an error if the token cannot be verified', () => {
    const req = {
      get: (headerName) => {
        return 'Bearer someString';
      }
    };

    expect(authMiddleware.bind(this, req, {}, next)).to.throw();
  });
});
