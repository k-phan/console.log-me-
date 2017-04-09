function toggle_menu (class_id) {
  var menu = document.getElementsByClassName(class_id)
  for (var i = 0; i < menu.length; i++) {
    if (window.getComputedStyle(menu[i]).display === 'none') {
      menu[i].style.display = 'block'
    } else {
      menu[i].style.display = 'none'
    }
  }
}
