import React from "react";
import HomeIcon from "./HomeIcon";
import { theme } from "@/constants/theme";
import BackIcon from "./BackIcon";
import EmailIcon from "./EmailIcon";
import KeyIcon from "./KeyIcon";
import ProfileIcon from "./ProfileIcon";
const icons = {
  home: HomeIcon,
  back: BackIcon,
  email: EmailIcon,
  password: KeyIcon,
  profile: ProfileIcon,
};

const Icon = ({ name, ...props }) => {
  const IconComponent = icons[name];
  return (
    <IconComponent
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.5}
      color={theme.colors.textLight}
      {...props}
    />
  );
};

export default Icon;
