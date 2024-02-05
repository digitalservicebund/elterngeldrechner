import React from "react";
import { AriaAttributes, Children, FC, useState } from "react";
import nsp from "../../../globals/js/namespace";
import { P } from "../../atoms";
import { InfoDialog, Info } from "../info-dialog";

interface FormFieldGroupProps extends AriaAttributes {
  headline?: string;
  description?: string;
  info?: Info;
}

export const FormFieldGroup: FC<FormFieldGroupProps> = ({
  headline,
  description,
  info,
  children,
  ...aria
}) => {
  const [markedAsRequired, setMarkedAsRequired] = useState<boolean | null>(
    null,
  );

  // search for required input fields in children and nested children (one level of nesting)
  Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.props["required"] && !markedAsRequired) {
        setMarkedAsRequired(true);
      } else if (
        child.props.children &&
        Array.isArray(child.props.children) &&
        !markedAsRequired
      ) {
        child.props.children.forEach((nestedChild: any) => {
          if (
            nestedChild.props &&
            nestedChild.props["required"] &&
            !markedAsRequired
          ) {
            setMarkedAsRequired(true);
          }
        });
      }
    }
  });

  return (
    <section
      aria-label={headline}
      aria-roledescription={description}
      className={nsp("form-field-group")}
      {...aria}
    >
      {headline && (
        <h3>
          {headline}
          {headline && markedAsRequired ? <span> *</span> : null}
        </h3>
      )}
      {description && (
        <div className={nsp("form-field-group-description")}>
          <P className={nsp("form-field-group-description__text")}>
            {description}
          </P>
          {info && <InfoDialog info={info} />}
        </div>
      )}
      {children}
    </section>
  );
};
