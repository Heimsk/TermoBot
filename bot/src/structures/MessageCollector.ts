import EventEmitter from 'eventemitter3';
import { TermoClient } from './Client';
import { Message } from 'eris';
import { CTXParser } from './CTXParser'

interface Options {
  filter?: any;
  channel_id: string;
  max?: number;
  timeout?: number;
}

export class MessageCollector extends EventEmitter {
  public filter?: any;
  public options: any;
  public channel_id: string;
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
    this.channel_id = options.channel_id;
    
    this.ended = false
    this.count = 0;
    
    this.callback = (message: Message) => {
      if(this.channel_id == message.channel.id && !this.ended) {
        if(this.filter && !this.filter(message.channel, message.author)) return;
        super.emit('collect', message);
        this.count++
        if(options.max && options.max <= this.count) {
          super.removeListener('rawWS', this.callback);
          super.emit('end', 'attempts');
          this.ended = true;
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
    
    this.client.on('messageCreate', this.callback);
  }
  
  public end(reason?: string) {
    super.emit('end', reason || 'ended');
    super.removeListener('rawWS', this.callback);
    this.ended = true;
  }
}