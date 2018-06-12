import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";
import { Utils } from "../utils/utils";
import { IDocument } from "../models/IDocument";
import { IUserProperties } from "../models/IUserProperties";

export interface SPServiceConfiguration {
    spContext: WebPartContext;
}

export class SPService {
    public spContext: WebPartContext;

    constructor(config: SPServiceConfiguration) {
        this.spContext = config.spContext;

        sp.setup({
            spfxContext: this.spContext
        });
    }

    // =========
    // DOCUMENTS
    // =========
    public async getDocuments(listId: string, numberOfItems: number): Promise<IDocument[]> {
        try {
            const listItems: IDocument[] = [];
            var items = await sp.web.lists.getById(listId).items.expand("File").top(numberOfItems).get();

            // Build Documents array
            await Promise.all(items.map(async (item) => {
                if (item.File) {
                    let userProperties = await Utils.getUserDetails(item.AuthorId, this.spContext.pageContext.web.absoluteUrl, this.spContext.spHttpClient);

                    // Assign user properties
                    let userDetails: IUserProperties = {
                        id: userProperties.Id,
                        email: userProperties.Email,
                        title: userProperties.Title,
                        photoUrl: Utils.getUserPhotoUrl(userProperties.Email, this.spContext.pageContext.web.absoluteUrl)
                    };

                    // Format date
                    const date: Date = new Date(item.Created);
                    const dateString: string = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();


                    // Push result
                    listItems.push({
                        id: item.ID,
                        title: item.File.Name,
                        url: item.ServerRedirectedEmbedUri,
                        previewImageUrl: Utils.getPreviewImageUrl(this.spContext.pageContext.web.absoluteUrl, item.File.ServerRelativeUrl),
                        extension: Utils.getExtensionUrl(item.File.Name),
                        created: dateString,
                        creatorId: userDetails.id,
                        creatorName: userDetails.title,
                        creatorPhotoUrl: userDetails.photoUrl,
                        linkToDocument: item.ServerRedirectedEmbedUrl,
                    });
                }
            }));

            console.log(listItems);
            return listItems;
        } catch (err) {
            console.log(err.message);
        }
    }
}