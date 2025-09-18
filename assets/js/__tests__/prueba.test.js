// assets/js/__tests__/prueba.test.js
const sum = require('../sum');

test('suma 1 + 2 da 3', () => {
  expect(sum(1, 2)).toBe(3);
});
