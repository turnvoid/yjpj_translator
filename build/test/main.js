let b = (
  () => {
    var o = {
      893: o => {
        console.log("hello webpack"),
          o.exports = class { apply () { console.log("a") } }
      }
    },
      r = {};
    !function e (s) {
      var l = r[s];
      if (void 0 !== l)
        return l.exports;
      var p = r[s] = { exports: {} };
      return o[s](p, p.exports, e),
        p.exports
    }(893)
  }
)();

console.log(b);
