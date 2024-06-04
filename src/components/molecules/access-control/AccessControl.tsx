import nsp from "@/globals/js/namespace";
import { Button } from "@/components/atoms";

export function AccessControl() {
  const handleScrollToTop = () => {
    const firstRechnerForm = document.getElementsByClassName(
      "egr-rechner-form",
    )[0] as HTMLElement;

    const firstRechnerFormOffset = firstRechnerForm.offsetTop - 20;

    window.scrollTo({
      top: firstRechnerFormOffset,
      behavior: "smooth",
    });
  };

  return (
    <section className={`${nsp("access-control")}`}>
      <div className={`${nsp("access-control__content")}`}>
        <p>
          Bevor Sie den Monatsplaner nutzen können, machen Sie bitte Angaben zu
          Ihrem Brutto-Einkommen während des Elterngeldbezugs
        </p>
        <Button onClick={handleScrollToTop} label="Jetzt berechnen" />
      </div>
    </section>
  );
}
