export interface Tool {
  name: string;
  execute(params: any): Promise<any>;
}
