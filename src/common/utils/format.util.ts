import { PaginationQueryDTO } from "../dto/pagination-query.dto";
import { Meta } from "../interceptors/entities/meta.entity";

/**
 * Formata os parâmetros de paginação a partir da query de consulta
 * @param query Query de consulta contendo os parâmetros de paginação
 * @returns Objeto com os parâmetros de paginação
 */
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

/**
 * Gera um objeto Meta para respostas paginadas
 * @param data Dados necessários para calcular os metadados, incluindo o total
 * @returns Objeto Meta com informações sobre a paginação
 */
export function genMetaObject(
    data: GenMetaObjectData & { total: number },
): Meta;
/**
 * Gera um objeto Meta para respostas paginadas
 * @param data Dados necessários para calcular os metadados, sem o total
 * @param total Total de itens
 * @returns Objeto Meta com informações sobre a paginação
 */
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
