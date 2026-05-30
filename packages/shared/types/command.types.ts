export interface Command {
  action: string;
  params?: Record<string, any>;
}
