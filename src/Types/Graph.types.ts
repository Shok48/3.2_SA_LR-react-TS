/**
 * Представляет ребро в структуре графа
 * @interface Edge
 * @property {number} source - ID исходной вершины
 * @property {number} target - ID целевой вершины
 * @property {number} [weight] - Опциональное значение веса для взвешенных графов
 */
interface Edge {
    readonly source: number;
    readonly target: number;
    readonly weight?: number;
}

/**
 * Представляет структуру графа
 * @interface Graph
 * @property {number[]} nodes - Массив идентификаторов вершин графа
 * @property {Edge[]} edges - Массив ребер, соединяющих вершины графа
 */
interface Graph {
    nodes: number[],
    edges: Edge[]
}

export type { Edge, Graph };