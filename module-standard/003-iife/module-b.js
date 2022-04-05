(function () {
  let data = 'moduleB'

  function method () {
    console.log(data+ 'excute')
  }

  window.moduleB = {
    method: method
  }
})()