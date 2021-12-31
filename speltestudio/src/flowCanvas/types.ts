export interface IDraggable {
  content: string;
  id?: string;
  headerText?: string;
  footerText?: string;
}

export interface IDragMoveEvent {
  id: string;
  x: number;
  y: number;
}

export interface IFormField {
  name: string;
  label?: string;
  type: string;
  value: string | number | boolean;
  disabled?: boolean;
  connectable?: boolean;
}

export type IInputType = "text" | "password" | "email" | "number" | "checkbox";

export interface IColumnDefinition {
  id?: string;
  name: string;
  datatype: string;
  primaryKey: boolean;
  nullable: boolean;
  unique: boolean;
  materialised: boolean;
}

export interface ITableDefinition {
  id?: string;
  top?: number;
  left?: number;
  name: string;
  schema: string;
  database: string;
  columns: IColumnDefinition[];
  materialised: boolean;
}

export function isITableDefinition(arg: any): arg is ITableDefinition {
  return arg.name !== undefined;
}

export interface ITransformDefinition {
  id?: string;
  transform: string;
  filter: string;
}

export function isITransformDefinition(arg: any): arg is ITransformDefinition {
  return arg.transform !== undefined;
}

export interface INode extends ITableDefinition, ITransformDefinition {
  top?: number;
  left?: number;
  type: "table" | "transform";
}

export interface IEdge {
  source: string;
  target: string;
}

export interface IPosition2d {
  x: number;
  y: number;
}

export interface IFlowDefinition {
  id: string;
  name: string;
  zoom: number;
  pan: IPosition2d;
  nodes: INode[];
  edges: IEdge[];
}

export interface IAPIResource<T extends unknown> {
  create(data: T): Promise<Response>;
  read(id: string): Promise<Response>;
  readall(): Promise<Response>;
  update(id, data: T): Promise<Response>;
  delete(id: string): Promise<Response>;
  command(data: any): Promise<Response>;
}
