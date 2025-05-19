// utils/convertToTreeData.ts
import { ICategory } from "@/types";

// Bổ sung kiểu dữ liệu cho node trong TreeSelect
export interface TreeNode {
  title: string;
  value: string;
  key: string;
  children?: TreeNode[];
}

export function buildCategoryTree(categories: ICategory[]): TreeNode[] {
  const idMap = new Map<string, ICategory & { children: ICategory[] }>();
  const tree: (ICategory & { children: ICategory[] })[] = [];

  categories.forEach(cat => {
    idMap.set(cat._id, { ...cat, children: [] });
  });

  categories.forEach(cat => {
    const node = idMap.get(cat._id)!;
    if (cat.parentId && idMap.has(cat.parentId)) {
      idMap.get(cat.parentId)!.children.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree.map(mapToAntdTreeNode);
}

function mapToAntdTreeNode(category: ICategory & { children?: ICategory[] }): TreeNode {
  return {
    title: category.name,
    value: category._id,
    key: category._id,
    children: category.children?.map(mapToAntdTreeNode),
  };
}
