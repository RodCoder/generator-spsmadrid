import * as React from 'react';
import * as moment from 'moment';
import { IPnPControlsProps, IPnpControlsState } from './IPnPControlsProps';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/components/Spinner';
import {
  DocumentCard,
  DocumentCardPreview,
  DocumentCardTitle,
  DocumentCardActivity,
  IDocumentCardProps
} from 'office-ui-fabric-react/lib/components/DocumentCard';
import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { IDocument } from '../../../models/IDocument';
import { List } from 'office-ui-fabric-react/lib/List';

export default class PnPControls extends React.Component<IPnPControlsProps, IPnpControlsState> {
  /**
   * Constructor
   * @param props
   */
  constructor(props: IPnPControlsProps) {
    super(props);

    this.state = {
      items: [],
      loading: false,
      showPlaceholder: (this.props.list === null || this.props.list === "")
    };
  }

  /**
   * componentDidMount lifecycle hook
   */
  public componentDidMount() {
    if (this.props.list !== null && this.props.list !== "") {
      this._getListItems();
    }
  }

  /**
   * componentDidUpdate lifecycle hook
   * @param nextProps
   * @param nextState
   */
  public componentDidUpdate(prevProps: IPnPControlsProps, prevState: IPnpControlsState) {
    if (this.props.list !== prevProps.list) {
      if (this.props.list !== null && this.props.list !== "") {
        this._getListItems();
      } else {
        this.setState({
          showPlaceholder: true
        });
      }
    }
  }

  /**
   * Retrieves items for the specified list
   * @param listId
   */
  private async _getListItems() {
    this.setState({
      loading: true
    });

    let listItems = await this.props.spService.getDocuments(this.props.list.toString(), this.props.numberOfItems);

    this.setState({
      items: listItems ? listItems : [],
      loading: false,
      showPlaceholder: false
    });
  }

  /*
   * Opens the web part property pane
  */
  private _configureWebPart() {
    this.props.context.propertyPane.open();
  }


  /**
   * React render method
   */
  public render(): React.ReactElement<IPnPControlsProps> {
    // Check if placeholder needs to be shown
    if (this.state.showPlaceholder) {
      return (
        <Placeholder
          iconName="Edit"
          iconText="List view web part configuration"
          description="Please configure the web part before you can show the list view."
          buttonLabel="Configure"
          onConfigure={this._configureWebPart.bind(this)} />
      );
    }

    return (
      <div>
        <WebPartTitle displayMode={this.props.displayMode}
          title={this.props.title}
          updateProperty={this.props.updateProperty} />
        {
          this.state.loading ?
            (
              <Spinner size={SpinnerSize.large} label="Retrieving results ..." />
            ) : (
              this.state.items.length === 0 ?
                (
                  <Placeholder
                    iconName="InfoSolid"
                    iconText="No items found"
                    description="The list or library you selected does not contain items." />
                ) : (
                  <List
                    items={this.state.items}
                    onRenderCell={this._onRenderCell} />
                )
            )
        }
      </div>
    );
  }

  private _onRenderCell(item: IDocument, index: number): JSX.Element {
    return (
      <DocumentCard onClickHref={item.url} key={item.id}>
        <DocumentCardPreview
          previewImages={[
            {
              previewImageSrc: item.previewImageUrl,
              iconSrc: item.extension,
              width: 318,
              height: 196,
              accentColor: '#ce4b1f'
            }
          ]}
        />
        <DocumentCardTitle title={item.title} />
      </DocumentCard>
    );
  }
}

