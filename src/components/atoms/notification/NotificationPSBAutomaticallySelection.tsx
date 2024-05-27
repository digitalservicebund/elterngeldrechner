interface Props {
  readonly label: string;
}

export function NotificationPSBAutomaticallySelection({ label }: Props) {
  return (
    <div>
      {`Auch Monat ${label} wurde automatisch ausgewählt, weil Sie Partnerschaftsbonus mindestens 2 Monate nehmen müssen.`}
    </div>
  );
}
