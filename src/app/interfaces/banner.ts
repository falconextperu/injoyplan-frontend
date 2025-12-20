interface Header {
    CODE: number;
    CODE_RESPONSE: string;
    MESSAGE: { msg: string }[];
}

export interface Banner {
    id: string;
    title: string;
    imageUrl: string;
    link?: string;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface IResponse {
    HEADER: Header;
    RESPONSE: Banner[];
}