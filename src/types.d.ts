declare module 'virtual:__federation__' {
  export function __federation_method_setRemote(name: string, options: any): void;
  export function __federation_method_getRemote(name: string, component: string): Promise<any>;
}
