(function ($) {
  let data = 'need-dep'

  function method () {
    $('#root').text(data)
  }

  window.moduleB = {
    method: method
  }
})(jQuery) // 声明依赖