export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedFooter {
  text: string;
  url?: string;
}

export interface EmbedAttachment {
  url: string;
}

export interface EmbedProvider {
  name?: string;
  url?: string;
}

export interface EmbedAuthor {
  name: string;
  icon_url?: string;
}

export interface EmbedInterface {
  title?: string;
  description?: string;
  color?: number;
  url?: string;
  timestamp?: string;
  footer?: EmbedFooter;
  image?: EmbedAttachment;
  thumbnail?: EmbedAttachment;
  video?: EmbedAttachment;
  provider?: EmbedProvider;
  author?: EmbedAuthor;
  fields?: Array<EmbedField>;
}

export class Embed {
  public embed: EmbedInterface;
  
  public constructor() {
    this.embed = {};
  }
  
  public setTitle(title: string): this {
    if(!title) throw Error('missing title');
    
    this.embed.title = title;
    return this;
  }
  
  public setDescription(desc: string): this {
    if(!desc) throw Error('missing description');
    
    this.embed.description = desc;
    return this;
  }
  
  public setColor(color: number): this {
    if(!color) throw Error('missing color');
    
    this.embed.color = color;
    return this;
  }
  
  public setUrl(url: string): this {
    if(!url) throw Error('missing url');
    
    this.embed.url = url;
    return this;
  }
  
  public setTimestamp(timestamp: string): this {
    if(!timestamp) throw Error('missing timestamp');
    
    this.embed.timestamp = timestamp;
    return this;
  }
  
  public setFooter(text: string, url?: string): this {
    if(!text) throw Error('missing text');
    
    this.embed.footer = {
      text
    };
    return this;
  }
  
  public setImage(url: string): this {
    if(!url) throw Error('missing url');
    
    this.embed.image = {
      url
    };
    return this;
  }
  
  public setThumbnail(url: string): this {
    if(!url) throw Error('missing url');
    
    this.embed.thumbnail = {
      url
    };
    return this;
  }
  
  public setVideo(url: string): this {
    if(!url) throw Error('missing url');
    
    this.embed.video = {
      url
    };
    return this;
  }
  
  public setProvider(name: string, url?: string): this {
    if(!name) throw Error('missing name');
    
    this.embed.provider = {
      name,
      url: url || ''
    };
    return this;
  }
  
  public setAuthor(name: string, url?: string): this {
    if(!name) throw Error('missing name');
    
    this.embed.author = {
      name,
      icon_url: url || ''
    };
    return this;
  }
  
  public addField(name: string, value: string, inline?: boolean): this {
    if(!name) throw Error('missing name');
    if(!value) throw Error('missing value');
    
    if(!this.embed.fields) {
      this.embed.fields = [];
    }
    
    this.embed.fields.push({
      name,
      value,
      inline: inline || false
    });
    return this;
  }
  
  public setFields(fields: Array<EmbedField>): this {
    if(!fields) throw Error('missing fields');
    
    if(!this.embed.fields) {
      this.embed.fields = [];
    }
    
    if(Array.isArray(fields)) {
      for(let field of fields) {
        if(!field.name) throw Error('missing name');
        if(!field.value) throw Error('missing value');
        
        this.embed.fields.push({
          name: field.name,
          value: field.value,
          inline: field.inline || false
        })
      }
    }
    
    return this;
  }
}