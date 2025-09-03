import './index.scss';

// 导入图标资源
import inputIcon from './assets/images/input.svg';
import outputIcon from './assets/images/output.svg';
import inOutIcon from './assets/images/inOut.svg';

// 定义节点类型枚举
export type NodeType = 'input' | 'output' | 'inOut' | 'folder';

// 定义树节点接口
export interface TreeNode {
  id: string;
  label: string;
  level: number;
  type: NodeType;
  icon?: string;
  children?: TreeNode[];
  parentId?: string;
  [key: string]: any; // 允许添加其他自定义属性
}

// 定义连接接口
export interface Connection {
  source: string;
  target: string;
  id?: string;
  [key: string]: any; // 允许添加其他自定义属性
}

// 定义树配置接口
export interface TreeConfig {
  id: string;
  data: TreeNode[];
  width?: number;
  height?: number;
}

// 定义选项接口
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

class MappingTreeFlow {
  private trees: TreeConfig[];
  private linkList: Connection[];
  private container: HTMLElement;
  private connections: Connection[] = [];
  private selectedNode: string | null = null;
  private enableLink: boolean;
  private bezier: number;
  private enableTxtBgColor: boolean;
  private enableDraggable: boolean;
  private minTreeDistance: number;
  private onConnectionsChange?: (connections: Connection[]) => void;
  private onConnectionChange?: (connection: Connection, type: 'add' | 'remove') => void;
  private onUpdateConnection?: (connection: Connection) => void;
  private currentConnection: Connection | null = null;
  private treeContainers: HTMLElement[] = [];
  
  constructor(
    containerId: string,
    trees: TreeConfig[],
    linkList: Connection[],
    options: MappingTreeFlowOptions = {}
  ) {
    this.enableLink = options.enableLink !== undefined ? options.enableLink : true;
    this.enableTxtBgColor = options.enableTxtBgColor !== undefined ? options.enableTxtBgColor : false;
    this.bezier = options.bezier !== undefined ? options.bezier : 70;
    this.enableDraggable = options.enableDraggable !== false;
    // 设置树之间的最小距离，默认为100px
    this.minTreeDistance = options.minTreeDistance !== undefined ? options.minTreeDistance : 100;
    this.onConnectionsChange = options.onConnectionsChange;
    this.onConnectionChange = options.onConnectionChange;
    this.onUpdateConnection = options.onUpdateConnection;
    
    // 确保初始数据是数组
    this.trees = Array.isArray(trees) ? trees : [];
    this.linkList = Array.isArray(linkList) ? linkList : [];

    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    container.style.display = this.enableDraggable ? 'block' : 'flex';
    if (!this.enableDraggable) {
      container.style.justifyContent = 'space-around';
    }
    container.style.padding = '6px 10px';
    container.style.position = 'relative'; // 确保SVG层能正确定位
    this.container = container;

    this.init();
  }

  private init(): void {
    // 确保容器有明确的尺寸
    if (!this.container.style.height) {
      this.container.style.minHeight = '500px';
    }
    
    // 创建外层容器和SVG连接层
    this.container.innerHTML = `<svg id="connection-layer" width="100%" height="100%"></svg>`;
    
    // 设置SVG层初始样式
    const svg = document.getElementById("connection-layer") as SVGSVGElement | null;
    if (svg) {
      svg.style.position = 'absolute';
      svg.style.top = '0';
      svg.style.left = '0';
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.pointerEvents = 'none';
      svg.style.zIndex = '10';
    }
    
    // 添加窗口大小变化的事件监听器，确保SVG层能正确调整尺寸
    window.addEventListener('resize', this.handleResize.bind(this));
    // 添加容器大小变化的事件监听
    const resizeObserver = new ResizeObserver(this.handleResize.bind(this));
    resizeObserver.observe(this.container);

    // 创建树容器
    this.trees.forEach((tree, index) => {
      const treeContainer = document.createElement("div");
      treeContainer.className = "tree-container";
      treeContainer.id = tree.id;
      
      // 设置容器大小
      if (tree.width) {
        treeContainer.style.width = `${tree.width}px`;
      } else if (this.container.dataset.treewidth) {
        treeContainer.style.width = `${this.container.dataset.treewidth}`;
      }
      
      if (tree.height) {
        treeContainer.style.height = `${tree.height}px`;
      } else if (this.container.dataset.treeheight) {
        treeContainer.style.height = `${this.container.dataset.treeheight}`;
      }
      
      // 基础样式设置
      treeContainer.style.position = this.enableDraggable ? 'absolute' : 'relative';
      treeContainer.style.userSelect = 'none';
      
      // 为树间距设置位置
      if (this.enableDraggable) {
        const containerWidth = tree.width || parseInt(this.container.dataset.treewidth || '0');
        // 计算初始偏移量，考虑容器宽度和间距
        const initialOffset = containerWidth * index + index * this.minTreeDistance;
        treeContainer.style.left = `${initialOffset}px`;
        treeContainer.style.top = '20px';
      } else {
        // 设置非拖拽模式下的树间距
        if (index < this.trees.length - 1) {
          treeContainer.style.marginRight = `${this.minTreeDistance / 2}px`;
        }
      }
      
      const header = document.createElement('div');
      header.className = 'tree-container-header';
      header.style.padding = '8px 12px';
      header.style.background = '#f5f7fa';
      header.style.borderBottom = '1px solid #e6e6e6';
      header.style.textAlign = 'center';
      header.style.fontWeight = 'bold';
      header.style.borderRadius = '4px 4px 0 0';
      header.textContent = tree.id.charAt(0).toUpperCase() + tree.id.slice(1);
      
      // 根据拖拽配置设置样式
      if (this.enableDraggable) {
        treeContainer.style.cursor = 'grab';
        header.style.cursor = 'grab';
      }
      
      treeContainer.appendChild(header);
      this.container.appendChild(treeContainer);
      this.treeContainers.push(treeContainer);
      
      if (this.enableDraggable) {
        this.makeTreeContainerDraggable(treeContainer);
      }
    });

    this.initializeTrees();
    window.addEventListener("resize", () => this.drawConnections());
  }
  
  /**
   * 使树容器可拖拽
   */
  private makeTreeContainerDraggable(container: HTMLElement): void {
    // console.log('正在处理拖拽功能的容器:', container.id);
    container.style.position = 'absolute';
    container.style.zIndex = '1';
    container.style.transform = 'translateZ(0)'; // 启用GPU加速
    container.style.transition = 'none'; // 禁用过渡效果
    
    let isDragging = false;
    let wasDragging = false; // 标记是否进行了拖拽操作
    let offsetX: number = 0;
    let offsetY: number = 0;
    
    // 将wasDragging标记存储在容器上，以便handleNodeClick方法可以访问
    (container as any).wasDragging = wasDragging;
    
    // 鼠标按下事件处理函数
    const startDrag = (e: MouseEvent): void => {
      // 只在鼠标左键按下时触发拖拽
      if (e.button !== 0) return;
      
      console.log('开始拖拽:', container.id);
      isDragging = true;
      wasDragging = false;
      (container as any).wasDragging = wasDragging;
      
      // 计算鼠标相对于容器的偏移量
      const containerRect = container.getBoundingClientRect();
      offsetX = e.clientX - containerRect.left;
      offsetY = e.clientY - containerRect.top;
      console.log('计算偏移量:', offsetX, offsetY);
      
      // 添加拖拽类
      container.classList.add('dragging');
      
      // 提高容器层级，确保拖拽时在最上层
      container.style.zIndex = '100';
      
      // 阻止默认行为和文本选择
      e.preventDefault();
    };
    
    // 鼠标移动事件处理函数
    const onDrag = (e: MouseEvent): void => {
      if (!isDragging) return;
      
      wasDragging = true; // 标记已经进行了拖拽
      (container as any).wasDragging = wasDragging;
      
      // 直接设置容器位置（不考虑父容器，简化逻辑）
      const parentRect = this.container.getBoundingClientRect();
      container.style.left = `${e.clientX - offsetX - parentRect.left}px`;
      container.style.top = `${e.clientY - offsetY - parentRect.top}px`;
      
      console.log('拖动中:', e.clientX - offsetX, e.clientY - offsetY);
      
      // 重新绘制连接线
      this.drawConnections();
    };
    
    // 鼠标释放事件处理函数
    const stopDrag = (e: MouseEvent): void => {
      if (!isDragging) return;
      
      console.log('停止拖拽:', container.id);
      isDragging = false;
      
      // 移除拖拽类
      container.classList.remove('dragging');
      
      // 恢复容器层级
      container.style.zIndex = '1';
      
      // 调整父容器大小以适应所有树容器
      this.adjustContainerSize();
      
      // 重新绘制所有连接线，确保最终位置正确
      this.drawConnections();
      
      // 短暂延迟后重置wasDragging标记，防止拖拽后立即触发点击事件
      setTimeout(() => {
        wasDragging = false;
        (container as any).wasDragging = wasDragging;
      }, 100);
    };
    
    // 直接在容器上绑定所有事件，不使用标题栏选择器
    console.log('绑定拖拽事件到容器...');
    container.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    
    // 防止文本被选中
    container.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    });
    
    console.log('拖拽事件绑定完成');
    
    // 确保拖拽功能在组件销毁时被清理
    const cleanup = () => {
      container.removeEventListener('mousedown', startDrag);
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
      container.removeEventListener('selectstart', () => false);
    };
    
    // 存储清理函数供后续使用
    (container as any)._dragCleanup = cleanup;
  }

  private getParentNode(nodeId: string): DOMRect {
    const nodeElement = document.querySelector(`[data-id="${nodeId}"]`) as HTMLElement;
    const nodeRect = nodeElement.getBoundingClientRect();
    if (nodeRect.top !== 0) {
      return nodeRect;
    } else {
      return this.getParentNode(nodeElement.parentElement!.parentElement!.dataset.id!);
    }
  }

  private renderTreeNode(node: TreeNode, container: HTMLElement): void {
    const nodeElement = document.createElement("div");
    let nodeClasses = `tree-node level-${node.level}`;
    // 如果有子节点，添加has-children类
    if (node.children && node.children.length > 0) {
      nodeClasses += " has-children";
    }
    // 如果是一级节点，添加level-1-node类
    if (node.level === 1) {
      nodeClasses += " level-1-node";
    }
    nodeElement.className = nodeClasses;
    nodeElement.dataset.id = node.id;
    nodeElement.dataset.level = node.level.toString();
    // 存储父节点ID
    if (node.parentId) {
      nodeElement.dataset.parentId = node.parentId;
    }

    const flexContainer = document.createElement("div");
    flexContainer.className = `tree-node-row level-${node.level}`;
    nodeElement.appendChild(flexContainer);

    // 切换按钮
    if (node.children && node.children.length > 0) {
      const toggleElement = document.createElement("span");
      toggleElement.className = "tree-toggle minus";
      toggleElement.addEventListener("click", (e) => {
        e.stopPropagation();
        const childrenElement = nodeElement.querySelector(".tree-children") as HTMLElement;
        childrenElement.classList.toggle("active");
        const toggleActive =  childrenElement.classList.contains("active")
        if (!toggleActive) {
          toggleElement.classList.remove('minus')
          toggleElement.classList.add('plus')
        } else {
          toggleElement.classList.remove('plus')
          toggleElement.classList.add('minus')
        }
        this.drawConnections(); // 节点展开/折叠时重新绘制连接线
      });
      flexContainer.appendChild(toggleElement);
    } else {
      // 没有子节点的占位符
      const placeholder = document.createElement("span");
      placeholder.className = "no-toggle";
      placeholder.style.width = "3px";
      placeholder.style.display = "inline-block";
      placeholder.style.marginRight = "5px";
      flexContainer.classList.add("not-children");
      flexContainer.appendChild(placeholder);
    }

    // 根据节点类型设置图标
    let iconPath = '';
    switch (node.type) {
      case 'input':
        iconPath = inputIcon;
        break;
      case 'output':
        iconPath = outputIcon;
        break;
      case 'inOut':
        iconPath = inOutIcon;
        break;
      default:
        iconPath = node.icon || '';
    }

    if (iconPath) {
      const iconElement = document.createElement("img");
      iconElement.src = iconPath;
      iconElement.className= "tree-icon";
      flexContainer.appendChild(iconElement);
    }

    // 节点标签
    const labelElement = document.createElement("span");
    labelElement.className = "tree-label";
    if (this.enableTxtBgColor) {
      labelElement.className += " tree-bg-color";
      labelElement.style.padding = '2px 10px';
    } else {
      labelElement.className += " default";
    }
    
    labelElement.textContent = node.label;
    labelElement.addEventListener("click", () => {
      this.handleNodeClick(node.id);
    });
    flexContainer.appendChild(labelElement);

    // 子节点容器
    if (node.children && node.children.length > 0) {
      const childrenElement = document.createElement("div");
      childrenElement.className = "tree-children active";
      nodeElement.appendChild(childrenElement);

      // 渲染子节点
      node.children.forEach((child) => {
        // 设置子节点的父ID
        child.parentId = node.id;
        this.renderTreeNode(child, childrenElement);
      });
    }

    container.appendChild(nodeElement);
  }

  private handleNodeClick(nodeId: string): void {
    // 检查点击的节点所属的容器是否刚刚被拖拽过
    const nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
    const treeContainer = nodeElement?.closest('.tree-container');
    
    // 如果是拖拽后触发的点击事件，直接返回
    if (treeContainer && (treeContainer as any).wasDragging) {
      return;
    }
    // 清除之前选中节点的样式
    if (this.selectedNode) {
      const prevSelected = document.querySelector(
        `[data-id="${this.selectedNode}"] .tree-label`
      ) as HTMLElement | null;
      if (prevSelected) prevSelected.classList.remove("selected");
    }

    // 如果选中了不同的节点，创建连接
    if (this.selectedNode && this.selectedNode !== nodeId) {
      // 检查节点是否来自不同的树容器
      const sourceContainer = document.querySelector(`[data-id="${this.selectedNode}"]`)
        ?.closest(".tree-container") as HTMLElement | null;
      const targetContainer = document.querySelector(`[data-id="${nodeId}"]`)
        ?.closest(".tree-container") as HTMLElement | null;

      if (this.enableLink && sourceContainer && targetContainer && sourceContainer.id !== targetContainer.id) {
        const source = this.selectedNode;
        const target = nodeId;
        const id = `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newConnection = { source, target, id };
        this.connections.push(newConnection);
        this.drawConnections();
        // 调用保存连线的钩子函数
        if (this.onConnectionsChange) {
          this.onConnectionsChange([...this.connections]);
        }
        // 调用单个连线变化的钩子函数
        if (this.onConnectionChange) {
          this.onConnectionChange(newConnection, 'add');
        }
        this.selectedNode = null;
        return;
      } else if (!this.enableLink) {
        this.selectedNode = nodeId;
        const selectedElement = document.querySelector(
          `[data-id="${nodeId}"] .tree-label`
        ) as HTMLElement | null;
        if (selectedElement) {
          selectedElement.classList.add("selected");
        }
        return;
      }
    }

    // 如果点击的是已经选中的节点，则移除选中状态
    if (this.selectedNode === nodeId) {
      const selectedElement = document.querySelector(
        `[data-id="${nodeId}"] .tree-label`
      ) as HTMLElement | null;
      if (selectedElement) {
        selectedElement.classList.remove("selected");
      }
      this.selectedNode = null;
      return;
    }

    // 设置新的选中节点
    this.selectedNode = nodeId;
    const selectedElement = document.querySelector(
      `[data-id="${nodeId}"] .tree-label`
    ) as HTMLElement | null;
    if (selectedElement) {
      selectedElement.classList.add("selected");
    }
  }

  private isNodeVisible(nodeId: string): boolean {
    const nodeElement = document.querySelector(`[data-id="${nodeId}"]`) as HTMLElement | null;
    if (!nodeElement) return false;

    // 检查所有祖先节点是否展开
    let parent = nodeElement.parentElement;
    while (parent && parent.classList.contains("tree-children")) {
      if (!parent.classList.contains("active")) {
        return false;
      }
      parent = parent.parentElement && parent.parentElement.parentElement ? parent.parentElement.parentElement : null;
    }

    // 检查节点是否在可视区域内（部分可见即可）
    const treeContainer = nodeElement.closest(".tree-container") as HTMLElement | null;
    if (!treeContainer) return false;
    const nodeRect = nodeElement.getBoundingClientRect();
    const containerRect = treeContainer.getBoundingClientRect();

    return (
      nodeRect.bottom > containerRect.top && nodeRect.top < containerRect.bottom
    );
  }

  private findNearestVisibleAncestor(nodeId: string): string | null {
    const nodeElement = document.querySelector(`[data-id="${nodeId}"]`) as HTMLElement | null;
    if (!nodeElement) return null;

    // 先检查当前节点是否可见
    if (this.isNodeVisible(nodeId)) {
      return nodeId;
    }

    // 查找可见的祖先节点
    let parentId = nodeElement.dataset.parentId;
    while (parentId) {
      if (this.isNodeVisible(parentId)) {
        return parentId;
      }
      const parentElement = document.querySelector(`[data-id="${parentId}"]`) as HTMLElement | null;
      if (!parentElement) break;
      parentId = parentElement.dataset.parentId;
    }

    // 如果没有可见的祖先节点，查找同层级的可见节点
    const level = nodeElement.dataset.level;
    const sameLevelNodes = Array.from(
      document.querySelectorAll(`.tree-node[data-level="${level}"]`) as NodeListOf<HTMLElement>
    );
    const nodeRect = nodeElement.getBoundingClientRect();

    // 筛选出在可视区域内的同层级节点
    const visibleSameLevelNodes = sameLevelNodes.filter((node) => {
      return this.isNodeVisible(node.dataset.id!);
    });

    if (visibleSameLevelNodes.length === 0) {
      // 如果同层级没有可见节点，查找更高级别的节点
      const grandparentElement = nodeElement.parentElement ? nodeElement.parentElement.closest(".tree-node") as HTMLElement | null : null;
      if (grandparentElement) {
        return this.findNearestVisibleAncestor(grandparentElement.dataset.id!);
      }
      return null;
    }

    // 找到距离当前节点最近的可见节点
    visibleSameLevelNodes.sort((a, b) => {
      const aRect = a.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();
      return (
        Math.abs(aRect.top - nodeRect.top) - Math.abs(bRect.top - nodeRect.top)
      );
    });

    // 确保连接线连接到可视范围的边缘节点
    const closestNode = visibleSameLevelNodes[0];
    const closestNodeId = closestNode.dataset.id!;

    return closestNodeId;
  }

  private addScrollListenersWithThrottle(): void {
    const treeContainers = document.querySelectorAll(".tree-container") as NodeListOf<HTMLElement>;
    treeContainers.forEach((container) => {
      // 使用节流函数优化滚动性能
      container.addEventListener("scroll", this.throttle(() => this.drawConnections(), 10));
    });
  }

  private throttle(func: () => void, delay: number): () => void {
    let lastCall = 0;
    return () => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func();
      }
    };
  }

  private getNodeVisibilityPosition(nodeId: string): "top" | "bottom" | "visible" | "unknown" {
    // 使用data-id属性获取节点
    const node = document.querySelector(`[data-id="${nodeId}"]`);
    const nodeElement = node ? node.querySelector(".tree-label") as HTMLElement | null : null;
    if (!nodeElement) {
      return "unknown";
    }

    const treeContainer = nodeElement.closest(".tree-container") as HTMLElement | null;
    if (!treeContainer) {
      return "unknown";
    }

    // 使用getBoundingClientRect获取准确位置
    const nodeRect = nodeElement.getBoundingClientRect();
    const containerRect = treeContainer.getBoundingClientRect();

    // 如果nodeRect.top === 0 则向递归查找上级top不为0的node节点
    let tmpNodeRect: DOMRect | null = null;
    if (nodeRect.top === 0) {
      tmpNodeRect = this.getParentNode(nodeId);
    }

    if (nodeRect.top === 0 && tmpNodeRect) {
      // 节点在容器顶部不可见（包括完全不可见和部分不可见）
      if (tmpNodeRect.top < containerRect.top) {
        return "top";
      }
      // 节点在容器底部不可见（包括完全不可见和部分不可见）
      else if (tmpNodeRect.bottom > containerRect.bottom) {
        return "bottom";
      }
      // 节点可见
      else {
        return "visible";
      }
    } else {
      // 节点在容器顶部不可见（包括完全不可见和部分不可见）
      if (nodeRect.top < containerRect.top) {
        return "top";
      }
      // 节点在容器底部不可见（包括完全不可见和部分不可见）
      else if (nodeRect.bottom > containerRect.bottom) {
        return "bottom";
      }
      // 节点可见
      else {
        return "visible";
      }
    }
  }

  private findFirstVisibleNode(): HTMLElement | null {
    // 获取所有节点
    const allNodes = document.querySelectorAll(".tree-node") as NodeListOf<HTMLElement>;

    // 遍历所有节点，返回第一个可见的节点
    for (const node of Array.from(allNodes)) {
      const nodeId = node.dataset.id!;
      if (this.isNodeVisible(nodeId)) {
        return node;
      }
    }

    // 如果没有找到可见节点，返回null
    return null;
  }

  // 处理窗口和容器大小变化
  private handleResize(): void {
    const svg = document.getElementById("connection-layer") as SVGSVGElement | null;
    if (svg) {
      // 使用相对单位确保SVG能随容器自适应
      svg.style.width = '100%';
      svg.style.height = '100%';
      // 同时设置SVG属性，确保内部坐标系正确
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
    }
    // 重新绘制连接线
    this.drawConnections();
  }
  
  /**
   * 调整父容器大小以适应所有树容器
   * 在拖拽完成后调用，确保容器和SVG能够覆盖所有树的位置
   */
  private adjustContainerSize(): void {
    if (!this.enableDraggable || !this.container) return;
    
    // 获取所有树容器
    const treeContainers = this.treeContainers;
    if (treeContainers.length === 0) return;
    
    let maxRight = 0;
    let maxBottom = 0;
    
    // 计算所有容器的最大右边界和下边界
    treeContainers.forEach(container => {
      const rect = container.getBoundingClientRect();
      const parentRect = this.container!.getBoundingClientRect();
      
      // 计算容器相对于父容器的位置
      const left = parseInt(container.style.left || '0');
      const top = parseInt(container.style.top || '0');
      const width = rect.width;
      const height = rect.height;
      
      // 更新最大右边界和下边界
      maxRight = Math.max(maxRight, left + width);
      maxBottom = Math.max(maxBottom, top + height);
    });
    
    // 获取父容器当前计算出的尺寸
    const parentStyle = window.getComputedStyle(this.container);
    const parentWidth = parseInt(parentStyle.width);
    const parentHeight = parseInt(parentStyle.height);
    const minHeight = parseInt(parentStyle.minHeight || '0');
    
    // 只有当最大边界超过父容器当前尺寸时才调整
    if (maxRight > parentWidth) {
      this.container.style.width = `${maxRight + 50}px`; // 增加50px的边距
    }
    
    // 确保高度至少为最小高度
    const targetHeight = Math.max(maxBottom + 50, minHeight);
    if (targetHeight > parentHeight) {
      this.container.style.minHeight = `${targetHeight}px`;
    }
    
    console.log('调整容器大小:', { maxRight, maxBottom, newWidth: this.container.style.width, newMinHeight: this.container.style.minHeight });
  }

  private drawConnections(): void {
    const svg = document.getElementById("connection-layer") as SVGSVGElement | null;
    if (!svg) return;
    svg.innerHTML = ""; // 清除现有连接
    
    // 确保SVG尺寸设置一致
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '10';
    
    const svgRect = svg.getBoundingClientRect();

    this.removeDeleteMenu();

    this.connections.forEach((conn) => {
      // 找到源节点和目标节点
      const sourceElement = document.querySelector(
        `[data-id="${conn.source}"] .tree-label`
      ) as HTMLElement | null;
      const targetElement = document.querySelector(
        `[data-id="${conn.target}"] .tree-label`
      ) as HTMLElement | null;

      if (sourceElement && targetElement) {
        const sourceTreeContainer = sourceElement.closest(".tree-container") as HTMLElement | null;
        if (!sourceTreeContainer) return;
        const targetTreeContainer = targetElement.closest(".tree-container") as HTMLElement | null;
        if (!targetTreeContainer) return;

        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const sourceContainerRect = sourceTreeContainer.getBoundingClientRect();
        const targetContainerRect = targetTreeContainer.getBoundingClientRect();

        // 获取容器位置索引
        const sourceIndex = this.treeContainers.findIndex(container => container.id === sourceTreeContainer!.id);
        const targetIndex = this.treeContainers.findIndex(container => container.id === targetTreeContainer!.id);
        
        // 确定连接方向
        const isLeftToRight = sourceIndex < targetIndex;

        const sourceVisibilityPos = this.getNodeVisibilityPosition(conn.source);
        const targetVisibilityPos = this.getNodeVisibilityPosition(conn.target);

        // 计算连接线的起点和终点
        let startX: number, startY: number, endX: number, endY: number;

        // 处理源节点连接点
        if (!this.isNodeVisible(conn.source)) {
          // 源节点不可见，检查是因为父节点闭合还是在容器外不可见
          const sourceElement = document.querySelector(
            `[data-id="${conn.source}"]`
          ) as HTMLElement;
          let nearestSourceClosedParent: string | null = null;

          // 查找最近的闭合但可见的父节点
          let sourceParent = sourceElement.parentElement;
          while (
            sourceParent &&
            sourceParent.classList.contains("tree-children")
          ) {
            if (!sourceParent.classList.contains("active")) {
              // 找到闭合的父节点，检查该父节点是否可见
              const parentNode = sourceParent.parentElement as HTMLElement;
              const parentId = parentNode.dataset.id!;
              if (this.isNodeVisible(parentId)) {
                nearestSourceClosedParent = parentId;
                break;
              }
            }
            sourceParent = sourceParent.parentElement && sourceParent.parentElement.parentElement ? sourceParent.parentElement.parentElement : null;
          }

          if (nearestSourceClosedParent) {
            // 有闭合但可见的父节点，连接到该父节点
            const parentElement = document.querySelector(
              `[data-id="${nearestSourceClosedParent}"] .tree-label`
            ) as HTMLElement;
            const parentRect = parentElement.getBoundingClientRect();

            // 根据容器顺序决定连接点位置
            startX = isLeftToRight
              ? sourceContainerRect.right + 5 - svgRect.left
              : sourceContainerRect.left - 5 - svgRect.left;
            startY = parentRect.top + parentRect.height / 2 - svgRect.top;
          } else {
            // 节点在容器外不可见，连接到容器边缘
            // 根据容器顺序决定连接点位置
            startX = isLeftToRight
              ? sourceContainerRect.right + 5 - svgRect.left
              : sourceContainerRect.left - 5 - svgRect.left;

            if (sourceVisibilityPos === "top") {
              // 节点在顶部不可见，连接到容器顶部固定位置
              startY = sourceContainerRect.top - svgRect.top;
            } else if (sourceVisibilityPos === "bottom") {
              // 节点在底部不可见，连接到容器底部边缘
              startY = sourceContainerRect.bottom - svgRect.top;
            } else {
              // 计算垂直位置 - 尝试找到最近的可视祖先节点的Y坐标
              const nearestSourceAncestor = this.findNearestVisibleAncestor(conn.source);
              if (nearestSourceAncestor) {
                const ancestorRect = document
                  .querySelector(
                    `[data-id="${nearestSourceAncestor}"] .tree-label`
                  )!
                  .getBoundingClientRect();
                startY = ancestorRect.top + ancestorRect.height / 2 - svgRect.top;
              } else {
                // 如果没有可视祖先节点，使用容器中心
                startY = sourceContainerRect.top + sourceContainerRect.height / 2 - svgRect.top;
              }
            }
          }
        } else {
          // 源节点可见，连接点位于容器外部
          const sourceContainerRect = sourceTreeContainer.getBoundingClientRect();

          // 根据容器顺序决定连接点位置
          startX = isLeftToRight
            ? sourceContainerRect.right + 5 - svgRect.left
            : sourceContainerRect.left - 5 - svgRect.left;

          // Y坐标为节点垂直中心
          startY = sourceRect.top + sourceRect.height / 2 - svgRect.top;
        }

        // 已经在前面的计算中考虑了SVG坐标转换，不需要再次转换

        // 查找最近的闭合但可见的父节点
        let nearestSourceClosedParent: string | null = null;
        if (!this.isNodeVisible(conn.source)) {
          const sourceElement = document.querySelector(`[data-id="${conn.source}"]`) as HTMLElement;
          let sourceParent = sourceElement.parentElement;
          while (sourceParent && sourceParent.classList.contains("tree-children")) {
            if (!sourceParent.classList.contains("active")) {
              const parentNode = sourceParent.parentElement as HTMLElement;
              const parentId = parentNode.dataset.id!;
              if (this.isNodeVisible(parentId)) {
                nearestSourceClosedParent = parentId;
                break;
              }
            }
            sourceParent = sourceParent.parentElement && sourceParent.parentElement.parentElement ? sourceParent.parentElement.parentElement : null;
          }
        }

        // 特殊处理：如果节点在顶部或底部不可见且没有闭合父节点，固定Y坐标
        if (sourceVisibilityPos === "top" && !nearestSourceClosedParent) {
          startY = sourceTreeContainer.getBoundingClientRect().top - svgRect.top;
        } else if (sourceVisibilityPos === "bottom" && !nearestSourceClosedParent) {
          // 保持原有逻辑
        }

        // 处理目标节点连接点
        let nearestTargetClosedParent: string | null = null;

        if (this.isNodeVisible(conn.target)) {
          // 根据容器顺序决定连接点位置
          endX = isLeftToRight
            ? targetContainerRect.left - 3 - svgRect.left
            : targetContainerRect.right + 10 - svgRect.left;

          // Y坐标为节点垂直中心
          endY = targetRect.top + targetRect.height / 2 - svgRect.top;
        } else {
          // 目标节点不可见，检查是因为父节点闭合还是在容器外不可见
          const targetElement = document.querySelector(
            `[data-id="${conn.target}"]`
          ) as HTMLElement;

          // 查找最近的闭合但可见的父节点
          let targetParent = targetElement.parentElement;
          while (
            targetParent &&
            targetParent.classList.contains("tree-children")
          ) {
            if (!targetParent.classList.contains("active")) {
              // 找到闭合的父节点，检查该父节点是否可见
              const parentNode = targetParent.parentElement as HTMLElement;
              const parentId = parentNode.dataset.id!;
              if (this.isNodeVisible(parentId)) {
                nearestTargetClosedParent = parentId;
                break;
              }
            }
            targetParent = targetParent.parentElement && targetParent.parentElement.parentElement ? targetParent.parentElement.parentElement : null;
          }

          if (nearestTargetClosedParent) {
            // 有闭合但可见的父节点，连接到该父节点
            const parentElement = document.querySelector(
              `[data-id="${nearestTargetClosedParent}"] .tree-label`
            ) as HTMLElement;
            const parentRect = parentElement.getBoundingClientRect();

            // 根据容器顺序决定连接点位置
            endX = isLeftToRight
              ? targetContainerRect.left - 5 - svgRect.left
              : targetContainerRect.right + 5 - svgRect.left;
            endY = parentRect.top + parentRect.height / 2 - svgRect.top;
          } else {
            // 节点在容器外不可见，连接到容器边缘
            // 根据容器顺序决定连接点位置
            endX = isLeftToRight
              ? targetContainerRect.left - 3 - svgRect.left
              : targetContainerRect.right + 10 - svgRect.left;

            if (targetVisibilityPos === "top") {
              // 节点在顶部不可见，连接到容器顶部固定位置
              endY = targetContainerRect.top - svgRect.top;
            } else if (targetVisibilityPos === "bottom") {
              // 节点在底部不可见，连接到容器底部边缘
              endY = targetContainerRect.bottom - svgRect.top;
            } else {
              // 计算垂直位置 - 尝试找到最近的可视祖先节点的Y坐标
              const nearestTargetAncestor = this.findNearestVisibleAncestor(conn.target);
              if (nearestTargetAncestor) {
                const ancestorRect = document
                  .querySelector(
                    `[data-id="${nearestTargetAncestor}"] .tree-label`
                  )!
                  .getBoundingClientRect();
                endY = ancestorRect.top + ancestorRect.height / 2 - svgRect.top;
              } else {
                // 如果没有可视祖先节点，使用容器中心
                endY = targetContainerRect.top + targetContainerRect.height / 2 - svgRect.top;
              }
            }
          }
        }

        // 特殊处理：如果节点在顶部或底部不可见且没有闭合父节点，固定Y坐标
        if (targetVisibilityPos === "top" && !nearestTargetClosedParent) {
          endY = targetTreeContainer.getBoundingClientRect().top - svgRect.top;
        } else if (
          targetVisibilityPos === "bottom" &&
          !nearestTargetClosedParent
        ) {
          endY = targetTreeContainer.getBoundingClientRect().bottom - svgRect.top;
        }

        // 创建路径
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        let d: string;
        const controlOffset = this.bezier;

        if (isLeftToRight) {
          d = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;
          path.setAttribute("marker-end", "url(#arrowhead-end)");
        } else {
          d = `M ${startX} ${startY} C ${startX - controlOffset} ${startY}, ${endX + controlOffset} ${endY}, ${endX} ${endY}`;
          path.setAttribute("marker-end", "url(#arrowhead-start)");
        }

        path.setAttribute("d", d);
        // 根据连接方向设置不同颜色
        if (isLeftToRight) {
          path.setAttribute("stroke", "#4096ff"); // 蓝色表示从左到右
        } else {
          path.setAttribute("stroke", "#ff7a45"); // 橙色表示从右到左
        }
        
        // 根据节点是否可见以及不可见位置设置线条样式
        const isSourceVisible = this.isNodeVisible(conn.source);
        const isTargetVisible = this.isNodeVisible(conn.target);

        // 检查源节点是否在顶部不可见
        const isSourceTopInvisible = sourceVisibilityPos === "top";

        // 检查目标节点是否在顶部不可见
        const isTargetTopInvisible = targetVisibilityPos === "top";

        path.setAttribute("stroke-width", "1.5");
        path.setAttribute("fill", "none");

        // 设置线条样式 - 当任意节点超出顶部可视范围时，连线都设置为虚线
        if (isSourceTopInvisible || isTargetTopInvisible) {
          // 节点在顶部不可见，使用长虚线
          path.setAttribute("stroke-dasharray", "5,5");
        } else if (!isSourceVisible || !isTargetVisible) {
          // 其他不可见情况，使用短虚线
          path.setAttribute("stroke-dasharray", "5,5");
        } else {
          // 节点可见，使用实线
          path.removeAttribute("stroke-dasharray");
        }

        // 添加鼠标悬浮事件，实现高亮效果
        const originalStrokeWidth = path.getAttribute("stroke-width");
        
        path.style.pointerEvents = 'auto';
        
        path.setAttribute('vector-effect', 'non-scaling-stroke');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        
        // 鼠标悬浮时只加粗连线
        path.addEventListener('mouseenter', () => {
          path.setAttribute('stroke-width', '2');
          path.style.cursor = 'pointer';
          path.setAttribute('stroke-opacity', '2');
        });
        
        // 鼠标离开时恢复原始线宽
        path.addEventListener('mouseleave', () => {
          path.setAttribute('stroke-width', originalStrokeWidth || '1.5');
          path.style.cursor = 'default';
          path.setAttribute('stroke-opacity', '1');
        });

        // 添加右键点击事件，显示删除菜单
        path.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          
          this.currentConnection = conn;
          
          // 显示删除菜单
          this.showDeleteMenu(e.clientX, e.clientY);
        });

        svg.appendChild(path);
      }
    });

    // 添加箭头标记
    if (this.connections.length > 0 && !document.getElementById("arrowhead-end")) {
      const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs"
      );

      // 右向箭头（用于从左到右的连接）
      const markerEnd = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "marker"
      );
      markerEnd.setAttribute("id", "arrowhead-end");
      markerEnd.setAttribute("markerWidth", "10");
      markerEnd.setAttribute("markerHeight", "7");
      markerEnd.setAttribute("refX", "9");
      markerEnd.setAttribute("refY", "3.5");
      markerEnd.setAttribute("orient", "auto");
      markerEnd.setAttribute("markerUnits", "userSpaceOnUse");

      const polygonEnd = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      polygonEnd.setAttribute("points", "0 0, 10 3.5, 0 7");
      polygonEnd.setAttribute("fill", "#4096ff");

      markerEnd.appendChild(polygonEnd);

      // 左向箭头（用于从右到左的连接）
      const markerStart = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "marker"
      );
      markerStart.setAttribute("id", "arrowhead-start");
      markerStart.setAttribute("markerWidth", "10");
      markerStart.setAttribute("markerHeight", "7");
      markerStart.setAttribute("refX", "1");
      markerStart.setAttribute("refY", "3.5");
      markerStart.setAttribute("orient", "auto");
      markerStart.setAttribute("markerUnits", "userSpaceOnUse");

      const polygonStart = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      polygonStart.setAttribute("points", "0 0, 10 3.5, 0 7");
      polygonStart.setAttribute("fill", "#ff7a45");

      markerStart.appendChild(polygonStart);

      defs.appendChild(markerEnd);
      defs.appendChild(markerStart);
      svg.appendChild(defs);
    }
  }

  // 初始化树
  private initializeTrees(): void {
    // 清空所有树容器
    this.treeContainers.forEach(container => {
      container.innerHTML = '';
    });

    // 渲染每棵树
    this.trees.forEach(tree => {
      const container = document.getElementById(tree.id) as HTMLElement | null;
      if (!container) return;
      
      // 确保treeData是数组
      const safeTreeData = Array.isArray(tree.data) ? tree.data : [];
      
      // 渲染树节点
      safeTreeData.forEach((node) => {
        this.renderTreeNode(node, container!);
      });
    });

    // 添加滚动事件监听
    this.addScrollListenersWithThrottle();

    // 添加默认连接线
    this.connections = [...this.linkList];
    this.drawConnections(); // 绘制默认连接线
    // 调用保存连线的钩子函数
    if (this.onConnectionsChange) {
      this.onConnectionsChange([...this.connections]);
    }
  }

  public redraw(): void {
    this.drawConnections();
  }

  public updateData(trees: TreeConfig[], linkList: Connection[]): void {
    // 确保输入数据是数组
    this.trees = Array.isArray(trees) ? trees : [];
    this.linkList = Array.isArray(linkList) ? linkList : [];
    this.connections = [...this.linkList];
    this.initializeTrees();
    // 调用保存连线的钩子函数
    if (this.onConnectionsChange) {
      this.onConnectionsChange([...this.connections]);
    }
  }

  // 获取当前所有连接线
  public getConnections(): Connection[] {
    return [...this.connections];
  }
  
  // 删除单个连接线
  public removeConnection(connection: Connection): boolean {
    const index = this.connections.findIndex(
      conn => (conn.id && conn.id === connection.id) || 
             (conn.source === connection.source && conn.target === connection.target)
    );
    
    if (index !== -1) {
      const removedConnection = this.connections[index];
      this.connections.splice(index, 1);
      this.drawConnections();
      
      // 调用单个连线变化的钩子函数
      if (this.onConnectionChange) {
        this.onConnectionChange(removedConnection, 'remove');
      }
      
      // 调用所有连线变化的钩子函数
      if (this.onConnectionsChange) {
        this.onConnectionsChange([...this.connections]);
      }
      
      return true;
    }
    
    return false;
  }

  /**
   * 更新指定连接的数据
   * @param updatedConnection 更新后的连接对象，必须包含id以标识要更新的连接
   */
  public updateConnection(updatedConnection: Connection): void {
    if (!updatedConnection.id) {
      console.warn('Cannot update connection without id');
      return;
    }

    // 查找要更新的连接
    const index = this.connections.findIndex(conn => conn.id === updatedConnection.id);

    if (index !== -1) {
      // 保留原始的source和target，只更新其他属性
      const originalConnection = this.connections[index];
      this.connections[index] = {
        ...originalConnection,
        ...updatedConnection
      };

      // 重新绘制连接
      this.drawConnections();
      
      // 调用更新连接的钩子函数
      if (this.onUpdateConnection) {
        this.onUpdateConnection(this.connections[index]);
      }
      
      // 同时触发整体连接列表变化的钩子函数
      if (this.onConnectionsChange) {
        this.onConnectionsChange([...this.connections]);
      }
    }
  }

  // 显示删除菜单
  private showDeleteMenu(x: number, y: number): void {
    // 先移除已有的删除菜单
    this.removeDeleteMenu();

    // 创建删除菜单
    const deleteMenu = document.createElement('div');
    deleteMenu.id = 'connection-delete-menu';
    deleteMenu.style.position = 'fixed';
    deleteMenu.style.left = `${x + 10}px`; // 定位在点击位置右侧10px
    deleteMenu.style.top = `${y}px`;
    deleteMenu.style.backgroundColor = 'white';
    deleteMenu.style.border = '1px solid #ddd';
    deleteMenu.style.borderRadius = '4px';
    deleteMenu.style.padding = '4px 0';
    deleteMenu.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    deleteMenu.style.zIndex = '1000';
    deleteMenu.style.fontSize = '12px';

    // 创建删除按钮
    const deleteButton = document.createElement('button');
    deleteButton.innerText = '删除连线';
    deleteButton.style.border = 'none';
    deleteButton.style.backgroundColor = 'transparent';
    deleteButton.style.padding = '6px 12px';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.textAlign = 'left';
    deleteButton.style.color = '#666';

    // 按钮悬停效果
    deleteButton.addEventListener('mouseenter', () => {
      deleteButton.style.backgroundColor = '#f5f5f5';
      deleteButton.style.color = '#333';
    });

    deleteButton.addEventListener('mouseleave', () => {
      deleteButton.style.backgroundColor = 'transparent';
      deleteButton.style.color = '#666';
    });

    // 按钮点击事件
    deleteButton.addEventListener('click', () => {
      if (this.currentConnection) {
        this.removeConnection(this.currentConnection);
      }
      this.removeDeleteMenu();
    });

    deleteMenu.appendChild(deleteButton);
    document.body.appendChild(deleteMenu);

    document.addEventListener('click', this.handleDocumentClick);
  }

  // 移除删除菜单
  private removeDeleteMenu(): void {
    const deleteMenu = document.getElementById('connection-delete-menu');
    if (deleteMenu) {
      document.body.removeChild(deleteMenu);
    }
    document.removeEventListener('click', this.handleDocumentClick);
  }

  private handleDocumentClick = (e: MouseEvent): void => {
    const deleteMenu = document.getElementById('connection-delete-menu');
    const svgLayer = document.getElementById('connection-layer');
    
    if (deleteMenu && e.target !== deleteMenu && !deleteMenu.contains(e.target as Node) && 
        !(svgLayer && svgLayer.contains(e.target as Node) && (e.target as Element).tagName === 'path')) {
      this.removeDeleteMenu();
    }
  };}

// 导出MappingTreeFlow类
export default MappingTreeFlow;

// 声明全局变量
declare global {
  interface Window {
    MappingTreeFlow: typeof MappingTreeFlow;
  }
}

// 将MappingTreeFlow挂载到window上
if (typeof window !== 'undefined') {
  window.MappingTreeFlow = MappingTreeFlow;
}