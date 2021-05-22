function showResponsiveNav() {
  var nav = document.getElementById("res-nav");
  if (nav.className == "mobile-nav-menu") {
    nav.className += " hidden";
  } else {
    nav.className = "mobile-nav-menu";
  }
}
