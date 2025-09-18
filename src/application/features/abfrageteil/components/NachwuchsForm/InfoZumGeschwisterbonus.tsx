import { InfoText } from "@/application/components";

export function InfoZumGeschwisterbonus() {
  return (
    <InfoText
      question="Wann kann ich einen Geschwisterbonus erhalten?"
      answer={
        <ul className="list-inside list-disc">
          Den Geschwisterbonus bekommen Sie, wenn in Ihrem Haushalt
          <li>mindestens ein weiteres Kind unter 3 Jahren lebt oder</li>
          <li>mindestens 2 weitere Kinder unter 6 Jahren leben oder</li>
          <li>
            mindestens ein weiteres Kind mit Behinderung unter 14 Jahren lebt.
          </li>
        </ul>
      }
    />
  );
}
