function fakePromise(value) {
  return {
    then: function(callback) {return callback(value);},
  }
}

function fakeHttpPromise(value) {
  return {
    then: function(callback) {return callback({data: value});},
    success: function(callback) {return callback(value);}
  }
}
