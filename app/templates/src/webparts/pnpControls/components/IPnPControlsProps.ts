import { ICheckedTerms } from '@pnp/spfx-property-controls/lib/PropertyFieldTermPicker';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { DisplayMode } from '@microsoft/sp-core-library';
import { IDocument } from '../../../models/IDocument';
import { SPService } from '../../../services/spservice';

export interface IPnPControlsProps {
  context: WebPartContext;
  spService: SPService;
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
  list: string | string[];
  numberOfItems: number;
}

export interface IPnpControlsState {
  items?: IDocument[];
  loading?: boolean;
  showPlaceholder?: boolean;
}
