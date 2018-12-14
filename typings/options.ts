export interface IOptions {
    enabled?: boolean;
    browserId?: string;
    program?: any;
    baseHost?: string;
    forBrowser?(path: string): { getAbsoluteUrl(path: string): string };
}
