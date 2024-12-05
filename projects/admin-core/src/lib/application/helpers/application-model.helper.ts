import {
  AppContentModel, ApplicationModel, AppTreeLayerNodeModel, AppTreeLevelNodeModel, AppTreeNodeModel,
} from '@tailormap-admin/admin-api';
import { ChangePositionHelper, TreeHelper, TreeNodePosition } from '@tailormap-viewer/shared';
import { ExtendedGeoServiceLayerModel } from '../../catalog/models/extended-geo-service-layer.model';

export class ApplicationModelHelper {

  public static isLevelTreeNode(node: AppTreeNodeModel): node is AppTreeLevelNodeModel {
    return node.objectType === 'AppTreeLevelNode';
  }

  public static isLayerTreeNode(node: AppTreeNodeModel): node is AppTreeLayerNodeModel {
    return node.objectType === 'AppTreeLayerNode';
  }

  public static getApplicationContentRoot(application: ApplicationModel): AppContentModel {
    return application.contentRoot || { layerNodes: [], baseLayerNodes: [], terrainLayerNodes: [] };
  }

  public static newApplicationTreeLayerNode(
    layer: ExtendedGeoServiceLayerModel,
    applicationNodes: AppTreeNodeModel[],
  ): AppTreeLayerNodeModel {
    const existingLayers = applicationNodes.filter(node => {
      if (!ApplicationModelHelper.isLayerTreeNode(node)) {
        return false;
      }
      return node.serviceId === layer.serviceId && node.layerName === layer.name;
    });
    const existingLayerIds = new Set(existingLayers.map(node => node.id));
    const baseId = `lyr:${layer.serviceId}:${layer.name}`;
    let idx = 0;
    let id = baseId;
    while (existingLayerIds.has(id)) {
      id = `${baseId}_${++idx}`;
    }
    return {
      id,
      description: '',
      objectType: 'AppTreeLayerNode',
      layerName: layer.name,
      serviceId: layer.serviceId,
      visible: true,
    };
  }

  public static addNodesToApplicationTree(
    applicationModel: ApplicationModel,
    tree: AppTreeNodeModel[],
    params: {
      treeNodes: AppTreeNodeModel[];
      parentId?: string;
      position?: TreeNodePosition;
      sibling?: string;
    },
  ) {
    const updatedTree: AppTreeNodeModel[] = [ ...(tree || []), ...params.treeNodes ];
    const [ parent, parentIdx ] = ApplicationModelHelper.getParent(updatedTree, params.parentId);
    if (!parent) {
      return updatedTree;
    }
    const newNodeIds = params.treeNodes.map(node => node.id);
    let newChildren = [ ...(parent.childrenIds || []), ...newNodeIds ];
    if (params.sibling && params.position) {
      const sibling = params.sibling;
      const position = params.position;
      newNodeIds.forEach(newNodeId => {
        newChildren = ChangePositionHelper.updateOrderInList(newChildren, newNodeId, position, sibling);
      });
    }
    const parentNode: AppTreeLevelNodeModel = {
      ...parent,
      childrenIds: newChildren,
    };
    return [
      ...updatedTree.slice(0, parentIdx),
      parentNode,
      ...updatedTree.slice(parentIdx + 1),
    ];
  }

  public static updateApplicationOrder(
    application: ApplicationModel,
    tree: AppTreeNodeModel[],
    params: {
      nodeId: string;
      parentId?: string;
      position: TreeNodePosition;
      sibling?: string;
    },
  ): AppTreeNodeModel[] {
    const [ parent, parentIdx ] = ApplicationModelHelper.getParent(tree, params.parentId);
    if (!parent) {
      return tree;
    }
    const draggedNode = tree.find(n => n.id === params.nodeId);
    if (!draggedNode || params.sibling === params.nodeId || params.parentId === params.nodeId) {
      return tree;
    }
    const childIds = ApplicationModelHelper.isLevelTreeNode(draggedNode) ? ApplicationModelHelper.getChildNodeIds(tree, draggedNode) : [];
    if (childIds.includes(params.sibling || '') || childIds.includes(params.parentId || '')) {
      // don't drag level into itself or its children
      return tree;
    }
    const currentParentIdx = tree.findIndex(n => ApplicationModelHelper.isLevelTreeNode(n) && n.childrenIds?.includes(params.nodeId));
    return tree.map((node, idx): AppTreeNodeModel | AppTreeLevelNodeModel => {
      if (!ApplicationModelHelper.isLevelTreeNode(node)) {
        return node;
      }
      if (parentIdx === idx) {
        return {
          ...node,
          childrenIds: ChangePositionHelper.updateOrderInList(node.childrenIds ?? [], params.nodeId, params.position, params.sibling),
        };
      }
      if (currentParentIdx === idx) {
        return {
          ...node,
          childrenIds: node.childrenIds?.filter(id => id !== params.nodeId) ?? [],
        };
      }
      return node;
    });
  }

  public static getParent(tree: AppTreeNodeModel[], parentId?: string | null): [AppTreeLevelNodeModel | null, number] {
    if (!parentId) {
      return [ null, -1 ];
    }
    const parentIdx = tree.findIndex(node => node.id === parentId);
    if (parentIdx === -1) {
      return [ null, -1 ];
    }
    const parent = tree[parentIdx];
    if (!ApplicationModelHelper.isLevelTreeNode(parent)) {
      return [ null, -1 ];
    }
    return [ parent, parentIdx ];
  }

  private static getChildNodeIds(tree: AppTreeNodeModel[], draggedNode: AppTreeLevelNodeModel) {
    return ApplicationModelHelper.getChildNodes(tree, draggedNode).map(node => node.id);
  }

  public static getChildNodes(layerTreeNodes: AppTreeNodeModel[], child?: AppTreeNodeModel): AppTreeNodeModel[] {
    if (!child) {
      return [];
    }
    const children = ApplicationModelHelper.isLevelTreeNode(child) ? child.childrenIds || [] : [];
    const childIds = children.map(id => {
      return ApplicationModelHelper.getChildNodes(layerTreeNodes, TreeHelper.findNode(layerTreeNodes, id));
    });
    return (child ? [child] : []).concat(...childIds);
  }

}
