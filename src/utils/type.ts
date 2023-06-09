export interface UserInfo {
    id: number;
    userName: string;
    nickName?: string;
    avatar?: string;
}

export interface Tag {
    id: number;
    tagName: string;
    color?: string;
    parentId?: number;
    children?: Array<Tag>
}

export type TagList = Array<Tag>

export interface Link {
    id: number;

    title: string;

    url: string;

    tagIds?: string;

    description?: string;

    thumb?: string;

    likeDegree: number;

    hasRead: boolean; // 是否已读

    userId: number;
}

export interface Pagination {
    pageNo: number;
    pageSize: number;
    total?: number;
}

export type LinkList = Array<Link>;

export enum TAG_FILTER_TYPE {
    union = 1,
    intersection = 2,
}

export enum SORT_TYPE {
    timeDesc,
    timeAsc,
    starDesc,
    starAsc
}