(function() {
  document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("body").appendChild(el);
    document.querySelectorAll(".header__container, .breadcrumb, .page-title, .contact-flap, .footer").forEach(el => el.classList.add("ds-disable"));
  });
}());
