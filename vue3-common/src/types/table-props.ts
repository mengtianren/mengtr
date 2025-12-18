
export interface IProps<T = any,P = any> {
    columns: P[]
    data: T
    initParam?: any
    rowKey?: string
    scroll?: { x?: number ; y?: number  }
    bordered?: boolean
    init?: boolean
}

