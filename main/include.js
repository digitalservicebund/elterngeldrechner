(function() {
  const params = new URL(document.location).searchParams;
  const toggle = params.get("original");
  if (toggle === "1") return;

  const el = document.createElement("div");
  el.innerText = "Testumgebung!";
  el.className = "ds-preview-warning";
  document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("body").appendChild(el);
    document.querySelectorAll(".header__container, .breadcrumb, .page-title, .contact-flap, .footer").forEach(el => el.classList.add("ds-disable"));
  });
}());
