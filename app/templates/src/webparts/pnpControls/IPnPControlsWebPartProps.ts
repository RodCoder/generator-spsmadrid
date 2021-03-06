import { ICheckedTerms } from "@pnp/spfx-property-controls/lib/PropertyFieldTermPicker";

export interface IPnPControlsWebPartProps {
  lists: string | string[]; // Stores the list ID(s)
  title: string;
  numberOfItems: number;
}
