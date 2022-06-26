import { TermoClient } from './Client';
import { CTXParser } from './CTXParser';
import { Embed } from './Embed';

export type ChannelTypes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15
export type BaseCommandOptionsTypes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type BaseCommandTypes = 1 | 2 | 3 | 4 | 5;

interface ErrorOptions {
  edit?: boolean;
  followup?: boolean;
}

export interface BaseCommandInfos {
  name: string;
  description?: string;
  type?: BaseCommandTypes;
}

export interface BaseCommandOptionsChoices {
  name: string;
  value: string | number;
}

export interface BaseCommandOptions {
  name: string;
  description: string;
  type: BaseCommandOptionsTypes;
  required?: boolean;
  choices?: Array<BaseCommandOptionsChoices>;
  min_value?: number;
  max_value?: number;
  channel_types?: ChannelTypes;
}

export interface BaseCommandRequirements {
  default_member_permissions: string;
}

export interface BaseCommandInterface {
  id: string;
  client: TermoClient;
  infos: BaseCommandInfos;
  options?: Array<BaseCommandOptions>;
  requirements?: BaseCommandRequirements;
  execute: (ctx: CTXParser) => Promise<boolean>
}

export class BaseCommand implements BaseCommandInterface {
  public client: TermoClient;
  public infos: BaseCommandInterface['infos'];
  public options?: BaseCommandInterface['options'];
  public requirements?: BaseCommandInterface['requirements'];
  public id: string;
  
  public constructor(client: TermoClient, infos: BaseCommandInterface['infos'], options?: BaseCommandInterface['options'], requirements?: BaseCommandInterface['requirements']) {
    if(!client) throw Error('Missing client');
    if(!infos) throw Error('Missing command infos');
    
    this.client = client;
    this.infos = infos;
    
    if(options) this.options = options;
    if(requirements) this.requirements = requirements;
    
    this.id = String(Math.floor(Math.random() * 999999999));
  }
  
  public async execute(ctx: CTXParser): Promise<boolean> {
    await ctx.reply({ type: '4', content: 'Comando não implementado, por favor aguarde o desenvolvimento do bot.' }, { ephemeral: true });
    return true;
  }
  
  public async sendErrorMsg(ctx: CTXParser, error: any, msg?: string, options: ErrorOptions = {}): Promise<any> {
    if(!ctx) {
      throw Error('missing ctx!');
    }
    
    let _error = error;
    
    if(_error instanceof Error) {
      if(error?.stack?.length > 1000) {
        let e = error.stack.split('');
        e.splice(1000, e.length - 1000);
        _error = e.join('');
      }
    }
    
    let embed = new Embed()
    .setAuthor(ctx.author?.username || this.client.user.username, ctx.author?.dynamicAvatarURL() || this.client.user.dynamicAvatarURL())
    .setDescription(msg && msg.length > 0 ? msg : `Houve um erro ao processar seu comando, tente novamente, se o erro persistir, utilize o comando **/feedback** e envie uma denúncia de bug com o seguinte código: \n\n**Código de erro:** \`\`\`\n$COMMAND_NAME$ = ${this.infos?.name}\n\n${_error}\`\`\``)
    .setColor(this.client.config.colors.red)
    .setThumbnail(this.client.config.images.error)
    
    return ctx.reply({ type: '4' }, { embeds: [embed.embed], ephemeral: true, edit: options?.edit ? true : false, followup: options?.followup ? true : options.edit ? false : true }).catch(() => {});
  }
}