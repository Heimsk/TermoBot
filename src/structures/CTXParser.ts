import { Guild, Member, User, Role, Collection, Channel, Message } from 'eris';
import { ModalInterface } from './Modal/Modal';
import { TermoClient } from './Client';
import { BaseCommand } from './BaseCommand';
import FormData from 'form-data';
import Axios from 'axios';

interface ModMember extends Member {
  rolesc?: Collection<Role>
}

export interface ResponseAttachments {
  id: 0,
  filename: string;
  description?: string;
}

export interface ResponseFiles {
  file: Buffer;
  filename: string;
}

export interface ResponseData {
  content?: string,
  type?: string;
}

export interface ResponseOptions {
  files?: Array<ResponseFiles>;
  embeds?: Array<any>;
  attachments?: Array<ResponseAttachments>;
  components?: Array<any>
  headers?: any;
  edit?: boolean;
  ephemeral?: boolean;
  followup?: boolean;
}

export class CTXParser {
  public rawINT: any;
  public token: string;
  public id?: string;
  public client: TermoClient;
  public commandName?: string;
  public mentions: {
    users: Collection<User>;
    members: Collection<ModMember>;
  }
  public command?: BaseCommand;
  public options?: Array<{
    name: string;
    value: any;
    type: number;
  }>
  public guild?: Guild;
  public member?: ModMember;
  public author?: User;
  public channel?: Channel;
  public data?: any;
  
  public constructor(int: any, client: TermoClient) {
    if(!int) throw Error('missing interaction object');
    if(!client) throw Error('missing client');
    
    this.rawINT = int;
    this.client = client;
    this.token = int.token;
    this.id = int.id;
    this.commandName = int.data.name;
    this.command = this.commandName ? this.client.commands.get(this.commandName) : undefined;
    this.mentions = {
      users: new Collection(User),
      members: new Collection(Member)
    }
    this.options = int.data?.options
    this.data = int.data;
    
    if(int.guild_id) {
      let guild = this.client.guilds.get(int.guild_id);
      if(guild) this.guild = guild
    }
    
    if(int.data?.resolved) {
      if(int.data?.resolved.users) {
        for(let iuser of Object.values(int.data?.resolved.users) as any) {
          let user = new User(iuser, this.client);
          this.mentions.users.set(user.id, user);
        }
      }
      
      if(int.data?.resolved.members) {
        for(let imember of Object.entries(int.data?.resolved.members) as any) {
          imember[1].user = {
            id: imember[0]
          };
          
          let member = new Member(imember[1], this.guild, this.client) as ModMember;
          member.rolesc = new Collection(Role);
          for(let roleid of member.roles) {
            let role = this.guild?.roles.get(roleid);
            if(role) {
              member.rolesc.set(roleid, role)
            }
          }
          this.mentions.members.set(member.user.id, member);
        }
      }
    }
    
    if(int.member) {
      if(this.guild) this.member = new Member(int.member, this.guild, this.client);
      
      if(this.guild && this.member && this.member.roles && this.member.roles.length > 0) {
        let rolesid = this.member.roles;
        this.member.rolesc = new Collection(Role);
        
        for(let roleid of rolesid) {
          let role = this.guild.roles.get(roleid);
          
          if(role) {
            this.member.rolesc.set(roleid, role);
          }
        }
      }
      
      if(this.member && !this.member.rolesc) {
        this.member.rolesc = new Collection(Role);
      }
    }
    
    this.author = this.client.users.get(int.member.user.id);
    if(this.guild) this.channel = this.guild.channels.get(int.channel_id);
  }
  
  public async reply(res: ResponseData, options: ResponseOptions = {}): Promise<any> {
    let form: any = null;
    let obj: any = {}
    
    
    let embeds: Array<any> = [];
    let attachments: Array<any> = [];
    let components: Array<any> = [];
    
    if(options.embeds && options.embeds.length > 0) {
      embeds = options.embeds;
    }
    
    if(options.attachments) {
      attachments = options.attachments;
    }
    
    if(options.components) {
      components = options.components;
    }
    
    if(options.files && options.files.length > 0) {
      form = new FormData();
      
      form.append('payload_json', JSON.stringify({
        content: res.content,
        type: res.type || 4,
        embeds,
        attachments,
        components
      }));
    
      for(let i = 0; i < options.files.length; i++) {
        form.append(`files[${i}]`, options.files[i].file, options.files[i].filename);
      }
    }
    
    if((res.content || embeds.length > 0 || attachments.length > 0) && !options.edit && !options.followup) {
      obj.data = {};
    }
    
    if(components.length > 0) {
      if(options.edit || options.followup) {
        obj.components = components;
      } else {
        obj.data.components = components;
      }
    }
    
    if(options.ephemeral) {
      if(options.edit || options.followup) {
        obj.flags = 64;
      } else {
        obj.data.flags = 64;
      }
    }
    
    if(embeds.length > 0) {
      if(options.edit || options.followup) {
        obj.embeds = embeds;
      } else {
        obj.data.embeds = embeds;
      }
    }
    
    if(attachments.length > 0) {
      if(options.edit || options.followup) {
        obj.attachments = attachments;
      } else {
        obj.data.attachments = attachments;
      }
    }
    
    if(res.content) {
      if(options.edit || options.followup) {
        obj.content = res.content;
      } else {
        obj.data.content = res.content;
      }
    }
    
    obj.type = res.type || 4;
    
    let formHeaders = form?.getHeaders?.() || {};
    let resp;
    
    if(options.followup) {
      resp = await Axios.post(`https://discord.com/api/v10/webhooks/${this.client.user.id}/${this.token}`, form || obj, {
  		  headers: {
  		    Authorization: `Bot ${process.env.TOKEN}`,
  		    formHeaders
  		  }
  		})
    } else if(options.edit) {
      resp = await Axios.patch(`https://discord.com/api/v10/webhooks/${this.client.user.id}/${this.token}/messages/@original`, form || obj, {
  		  headers: {
  		    Authorization: `Bot ${process.env.TOKEN}`,
  		    formHeaders
  		  }
  		})
    } else {
      resp = await Axios.post(`https://discord.com/api/v10/interactions/${this.id}/${this.token}/callback`, form || obj, {
        headers: {
          Authorization: `Bot ${process.env.TOKEN}`,
          formHeaders
        }
      })
    }
    
    if(resp) {
      if(resp.data.channel_id) {
        try {
          return new Message(resp.data, this.client);
        } catch {
          return;
        }
      }
    }
  }
  
  public async sendModal(modal: ModalInterface): Promise<any> {
    if(!modal) throw Error('missing modal');
    
    let body = {
      type: 9,
      data: modal
    };

    let res = await Axios.post(`https://discord.com/api/v10/interactions/${this.id}/${this.token}/callback`, body, {
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`,
      }
    });
    
    
    if(res) {
      return res.data;
    }
  }
  
  public async delete(msgid: string): Promise<any> {
    return await Axios.delete(`https://discord.com/api/v10/webhooks/${this.client.user.id}/${this.token}/messages/${msgid}`, {
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`
      }
    });
  }
}