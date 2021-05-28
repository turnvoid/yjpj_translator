console.log('hello webpack')

const obj = {
  'a': '1',
  'b': '2'
}

class A {
  apply() {
    console.log('a');
  }
}

module.exports = A
