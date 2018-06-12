import { ISPTermObject } from '../models/ISPTermObject';
import { SPHttpClient } from "@microsoft/sp-http";

export class Utils {

    public static getExtensionUrl(fileName: string): string {
        let extension = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
        const iconUrl: string = `https://spoprod-a.akamaihd.net/files/odsp-next-prod_ship-2016-08-15_20160815.002/odsp-media/images/filetypes/32/${extension}.png`;
        return iconUrl;
    }

    public static getPreviewImageUrl(webUrl: string, path: string): string {
        if (path) {
            return `${webUrl}/_layouts/15/getpreview.ashx?path=${path}`;
        }
        else {
            return '';
        }
    }

    public static getUserPhotoUrl(userEmail: string, siteUrl: string, size: string = 'S'): string {
        return `${siteUrl}/_layouts/15/userphoto.aspx?size=${size}&accountname=${userEmail}`;
    }

    public static getDelveUrl(userEmail: string){
        return `https://eur.delve.office.com/?p=${userEmail}`;
    }

    public static trim(s: string): string {
        if (s && s.length > 0) {
            return s.replace(/^\s+|\s+$/gm, '');
        }
        else {
            return s;
        }
    }

    public static getTermsString(terms: ISPTermObject[]): string {
        let termString = '';
        terms.map((term) => {
            termString += `${term.name}|${term.guid};`;
        });
        return termString;
    }

    public static async getUserDetails(userId: string, webAbsoluteUrl: string, spHttpClient: SPHttpClient): Promise<any> {
        try {
            let restApi = `${webAbsoluteUrl}/_api/web/getuserbyid(${userId})`;
            let serviceResponse = await spHttpClient.get(restApi, SPHttpClient.configurations.v1);
            let serviceJSONResponse = await serviceResponse.json();

            return serviceJSONResponse;
        } catch (err) {
            console.log(err.message);
        }
    }
}