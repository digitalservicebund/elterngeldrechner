import { VFC } from "react";

interface Props {
  label: string;
}

export const NotificationPSBAutomaticallySelection: VFC<Props> = ({
  label,
}) => {
  return (
    <div>
      {`Auch Monat ${label} wurde automatisch ausgewählt, weil Sie Partnerschaftsbonus mindestens 2 Monate nehmen müssen.`}
    </div>
  );
};
