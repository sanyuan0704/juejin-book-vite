(function () {
  let data = 'moduleA'

  function method () {
    console.log(data+ 'excute')
  }

  window.moduleA = {
    method: method
  }
})()