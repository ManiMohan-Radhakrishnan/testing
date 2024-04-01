import ToolTip from "../tooltip";
import { userBalanceDetailFormat } from "../../utils/common";

import "./style.scss";

const FormattedNumber = ({
  value = 0,
  prefix = "",
  suffix = "",
  blankPlaceholder = "--",
  placement = "top",
  icon = <></>,
  className = "",
  descriptionClassName = "",
  hasTooltip = false,
  hasDescription = false,
  description = "",
}) => {
  if (hasTooltip)
    return (
      <ToolTip
        className={className}
        icon={
          value > 0 ? (
            <h4 className="total_amount">
              <span>
                {`${prefix}${userBalanceDetailFormat(value)}${suffix}`}
                {icon}
              </span>
            </h4>
          ) : (
            <h4 className="total_amount">{blankPlaceholder}</h4>
          )
        }
        placement={placement}
        content={`${prefix}${value}${suffix}`}
      />
    );
  else if (hasDescription)
    return (
      <h4 className={`total_amount ${className}`.trim()}>
        <span>
          {`${prefix}${userBalanceDetailFormat(value)}${suffix}`}
          {icon}
        </span>
        <span className={`actual-value ${descriptionClassName}`}>
          {description ? description : `(${prefix}${value}${suffix})`}
        </span>
      </h4>
    );
  else
    return (
      <h4 className={`total_amount ${className}`.trim()}>
        <span>
          {`${prefix}${userBalanceDetailFormat(value)}${suffix}`}
          {icon}
        </span>
      </h4>
    );
};

export default FormattedNumber;
