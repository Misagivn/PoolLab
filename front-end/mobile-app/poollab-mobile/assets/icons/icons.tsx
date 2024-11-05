import { View, Text } from "react-native";
import React from "react";
import FacebookIcon from "./fbIcon";
import GoogleIcon from "./googleIcon";
import BackIcon from "./backIcon";
import NotificationIcon from "./notificationIcon";
import EmailIcon from "./emailIcon";
import LockPasswordIcon from "./passwordIcon";
import UserIcon from "./userIcon";
import AddIcon from "./plusIcon";
import { theme } from "@/constants/theme";
import ArrowRight from "./arrowRight";
import InformationIcon from "./informationIcon";
import PhoneIcon from "./phoneIcon";
import LocationIcon from "./locationIcon";
import FromAtoZIcon from "./AtoZIcon";
import AreaIcon from "./pinPointAreaIcon";
const icons = {
  fbIcon: FacebookIcon,
  ggIcon: GoogleIcon,
  backIcon: BackIcon,
  notiIcon: NotificationIcon,
  emailIcon: EmailIcon,
  passwordIcon: LockPasswordIcon,
  userIcon: UserIcon,
  addIcon: AddIcon,
  arrowRight: ArrowRight,
  infoIcon: InformationIcon,
  phoneIcon: PhoneIcon,
  locationIcon: LocationIcon,
  fromAtoZIcon: FromAtoZIcon,
  areaIcon: AreaIcon,
};

const Icon = ({ name, ...props }) => {
  const IconComponent = icons[name];
  return (
    <IconComponent
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.5}
      color={props.color || theme.colors.background}
      {...props}
    />
  );
};

export default Icon;
