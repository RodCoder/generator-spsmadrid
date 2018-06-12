export interface ISPTermObject {
    identity: string;
    isAvailableForTagging: boolean;
    name: string;
    guid: string;
    customSortOrder: string;
    terms: ISPTermObject[];
    localCustomProperties: any;
}