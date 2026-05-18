import { PaginationQueryDTO } from "../dto/pagination-query.dto";
import { Meta } from "../interceptors/entities/meta.entity";

export function paginationByQuery(query: PaginationQueryDTO) {
    const { page, perPage } = query;
    return { skip: (page - 1) * perPage, take: perPage };
}

export interface GenMetaObjectData {
    total?: number;
    page: number;
    perPage: number;
    cached?: boolean;
}

export function genMetaObject(
    data: GenMetaObjectData & { total: number },
): Meta;
export function genMetaObject(
    data: Omit<GenMetaObjectData, "total">,
    total: number,
): Meta;
export function genMetaObject(data: GenMetaObjectData, _total?: number): Meta {
    const total = _total ?? data.total!;
    const page = data.page;
    const totalPages = Math.ceil(total / data.perPage);
    const hasNextPage = totalPages > page;
    const hasPreviousPage =
        page > totalPages ? page - totalPages === 1 : page > 1;

    return {
        cached: !!data.cached,
        hasNextPage,
        hasPreviousPage,
        page,
        perPage: data.perPage,
        total,
        totalPages,
    };
}
