import EventEmitter from 'eventemitter3';
import { TermoClient } from './Client';
import { Member, Guild } from 'eris';
import { CTXParser } from './CTXParser'

interface Options {
  filter?: any;
  max?: number;
  timeout?: number;
}

export class MessageComponentCollector extends EventEmitter {
  public filter?: any;
  public options: any;
  public client: TermoClient;
  public count: number;
  public ended: boolean;
  public callback: any;
  
  public constructor(client: TermoClient, options: Options) {
    super();
    if(!client) throw Error('missing client');
    if(!options) throw Error('missing options');
    
    this.options = options;
    this.client = client;
    this.filter = options.filter;
    
    this.ended = false
    this.count = 0;
    
    this.callback = (int: any) => {
      if(int.t === 'INTERACTION_CREATE') {
        if(int.d.type === 3 || int.d.type == 5) {
          if(!this.ended) {
            if(this.filter) {
              if(!this.filter(int.d?.message, int.d?.member?.user, int.d?.data?.custom_id)) return;
            };
            
            let component = new CTXParser(int.d, this.client);
            super.emit('collect', component);
            this.count++
            if(options.max && options.max <= this.count) {
              super.removeListener('rawWS', this.callback);
              super.emit('end', 'attempts');
              this.ended = true;
            }
          }
        }
      }
    }
    
    if(this.options.timeout) {
      setTimeout(() => {
        if(this.ended) return;
        super.removeListener('rawWS', this.callback);
        super.emit('end', 'time');
        this.ended = true
      }, this.options.timeout);
    }
    
    this.client.on('rawWS', this.callback);
  }
  
  public end(reason?: string) {
    super.emit('end', reason || 'ended');
    super.removeListener('rawWS', this.callback);
    this.ended = true;
  }
}