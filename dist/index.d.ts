export type NodeType = 'input' | 'output' | 'inOut' | 'folder';
export interface TreeNode {
    id: string;
    label: string;
    level: number;
    type: NodeType;
    icon?: string;
    children?: TreeNode[];
    parentId?: string;
    [key: string]: any;
}
export interface Connection {
    source: string;
    target: string;
    id?: string;
    [key: string]: any;
}
export interface TreeConfig {
    id: string;
    data: TreeNode[];
    width?: number;
    height?: number;
}
export interface MappingTreeFlowOptions {
    bezier?: number;
    enableLink?: boolean;
    enableTxtBgColor?: boolean;
    enableDraggable?: boolean;
    onConnectionsChange?: (connections: Connection[]) => void;
    onConnectionChange?: (connection: Connection, type: 'add' | 'remove') => void;
    onUpdateConnection?: (connection: Connection) => void;
    minTreeDistance?: number;
}
declare class MappingTreeFlow {
    private trees;
    private linkList;
    private container;
    private connections;
    private selectedNode;
    private enableLink;
    private bezier;
    private enableTxtBgColor;
    private enableDraggable;
    private minTreeDistance;
    private onConnectionsChange?;
    private onConnectionChange?;
    private onUpdateConnection?;
    private currentConnection;
    private treeContainers;
    constructor(containerId: string, trees: TreeConfig[], linkList: Connection[], options?: MappingTreeFlowOptions);
    private init;
    /**
     * 使树容器可拖拽
     */
    private makeTreeContainerDraggable;
    private getParentNode;
    private renderTreeNode;
    private handleNodeClick;
    private isNodeVisible;
    private findNearestVisibleAncestor;
    private addScrollListenersWithThrottle;
    private throttle;
    private getNodeVisibilityPosition;
    private findFirstVisibleNode;
    private handleResize;
    /**
     * 调整父容器大小以适应所有树容器
     * 在拖拽完成后调用，确保容器和SVG能够覆盖所有树的位置
     */
    private adjustContainerSize;
    private drawConnections;
    private initializeTrees;
    redraw(): void;
    updateData(trees: TreeConfig[], linkList: Connection[]): void;
    getConnections(): Connection[];
    removeConnection(connection: Connection): boolean;
    /**
     * 更新指定连接的数据
     * @param updatedConnection 更新后的连接对象，必须包含id以标识要更新的连接
     */
    updateConnection(updatedConnection: Connection): void;
    private showDeleteMenu;
    private removeDeleteMenu;
    private handleDocumentClick;
}
export default MappingTreeFlow;
declare global {
    interface Window {
        MappingTreeFlow: typeof MappingTreeFlow;
    }
}
