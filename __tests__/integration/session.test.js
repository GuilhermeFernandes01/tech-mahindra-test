const auth = require('../../src/middlewares/auth');

describe('Authentication', () => {
  it('should validate request based on headers', () => {
    try {
      auth.validateToken('Bearer');
    } catch (err) {
      expect(err.message).toEqual('Não autorizado');
    }
  });
});
