import CaretDown from "@/app/_components/icons/caret-down.svg";
import World from "@/app/_components/icons/world.svg";

interface IconProps {
  name: ICON_NAMES;
}

export enum ICON_NAMES {
  CARET_DOWN = "caret-down",
  WORLD = "world",
}

const Icon = ({ name }: IconProps) => {
  switch (name) {
    case ICON_NAMES.CARET_DOWN:
      return <CaretDown />;
    case ICON_NAMES.WORLD:
      return <World />;
    default:
      return null;
  }
};

export default Icon;
