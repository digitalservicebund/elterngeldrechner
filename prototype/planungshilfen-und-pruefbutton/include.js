(function() {
  document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".header__container, .breadcrumb, .page-title, .contact-flap, .footer").forEach(el => el.classList.add("ds-disable"));
    var links = document.querySelectorAll("a[href^=https]");
    for (var i = 0; i < links.length; i++) {
      links[i].style.pointerEvents = "none";
    }
  });
}());
