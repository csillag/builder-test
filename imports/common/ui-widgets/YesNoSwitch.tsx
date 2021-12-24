import * as React from "react";

interface YesNoSwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

/**
 * This is a simple yes-no switch, semantically similar to a checkbox, just looks better
 */
export const YesNoSwitch = (props: YesNoSwitchProps) => (
  <span title={"Click to switch"} onClick={() => props.onChange(!props.value)}>
    <img src={props.value ? "/img/yes.jpeg" : "/img/no.png"} height={32} />
  </span>
);
