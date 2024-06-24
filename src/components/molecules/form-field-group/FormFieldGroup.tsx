import React, { AriaAttributes } from "react";
import nsp from "@/globals/js/namespace";
import { InfoDialog, Info } from "@/components/molecules/info-dialog";

interface FormFieldGroupProps extends AriaAttributes {
  readonly headline?: string;
  readonly description?: string;
  readonly info?: Info;
  readonly children: React.ReactNode;
}

export function FormFieldGroup({
  headline,
  description,
  info,
  children,
  ...aria
}: FormFieldGroupProps) {
  return (
    <section
      aria-label={headline}
      aria-roledescription={description}
      className={nsp("form-field-group")}
      {...aria}
    >
      {!!headline && <h3 className="mb-10">{headline}</h3>}
      {!!description && (
        <div className={nsp("form-field-group-description")}>
          <p className={nsp("form-field-group-description__text")}>
            {description}
          </p>
          {!!info && <InfoDialog info={info} />}
        </div>
      )}
      {children}
    </section>
  );
}
