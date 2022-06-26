import { TermoClient } from './Client';

export interface BaseManagerInterface {
  client: TermoClient;
  name: string;
  initAfterClientReady: boolean;
  init: () => Promise<boolean>;
}

export class BaseManager implements BaseManagerInterface {
  public client: BaseManagerInterface['client']
  public name: BaseManagerInterface['name'];
  public initAfterClientReady: BaseManagerInterface['initAfterClientReady'];
  
  public constructor(client: TermoClient, name: string, initAfterClientReady: boolean = false) {
    this.client = client;
    this.name = name;
    this.initAfterClientReady = initAfterClientReady;
  }
  
  public async init(): Promise<boolean> {
    return true;
  }
}