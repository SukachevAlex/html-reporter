export interface IOptions {
    enable?: boolean;
    path?: string;
    defaultView?: 'all' | 'failed';
    baseHost?: string;
    scaleImages?: boolean;
    lazyLoadOffset?: number;
}
