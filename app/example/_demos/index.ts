import { AccordionDemo } from "./accordion-demo";
import { AlertDemo } from "./alert-demo";
import { AspectRatioDemo } from "./aspect-ratio-demo";
import { AvatarDemo } from "./avatar-demo";
import { BadgeDemo } from "./badge-demo";
import { ButtonDemo } from "./button-demo";
import { CalendarDemo } from "./calendar-demo";
import { CardDemo } from "./card-demo";
import { CheckboxDemo } from "./checkbox-demo";
import { DialogDemo } from "./dialog-demo";
import { DropdownMenuDemo } from "./dropdown-menu-demo";
import { HoverCardDemo } from "./hover-card-demo";
import { InputDemo } from "./input-demo";
import { SelectDemo } from "./select-demo";
import { SliderDemo } from "./slider-demo";
import { SwitchDemo } from "./switch-demo";
import { TableDemo } from "./table-demo";
import { TabsDemo } from "./tabs-demo";

// 在這裡依據 slug 將每個 Demo 註冊綁定
export const DemoRegistry: Record<string, React.ElementType> = {
  "aspect-ratio": AspectRatioDemo,
  button: ButtonDemo,
  badge: BadgeDemo,
  card: CardDemo,
  avatar: AvatarDemo,
  input: InputDemo,
  checkbox: CheckboxDemo,
  table: TableDemo,
  calendar: CalendarDemo,
  accordion: AccordionDemo,
  alert: AlertDemo,
  switch: SwitchDemo,
  slider: SliderDemo,
  tabs: TabsDemo,
  "hover-card": HoverCardDemo,
  select: SelectDemo,
  "dropdown-menu": DropdownMenuDemo,
  dialog: DialogDemo,
  // 未註冊的元件，會自動顯示「Demo 開發中...」
};
