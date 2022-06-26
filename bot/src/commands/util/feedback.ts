import { MessageComponentCollector } from '../../structures/MessageComponentCollector';
import { Components, SelectMenu } from '../../structures/Components';
import { Modal, ModalTextInput } from '../../structures/Modal'
import { BaseCommand } from '../../structures/BaseCommand';
import { TermoClient } from '../../structures/Client';
import { CTXParser } from '../../structures/CTXParser';
import { Embed } from '../../structures/Embed';

export default class FeedbackCommand extends BaseCommand {
  public constructor(client: TermoClient) {
    super(client, {
      name: 'feedback',
      description: 'Envie um feedback para ajudar no desenvolvimento de nosso bot!'
    });
  }
  
  public async execute(ctx: CTXParser): Promise<boolean> {
    await ctx.reply({ type: '5' });
    
    let embed = new Embed()
    .setAuthor(ctx.author?.username || '', ctx.author?.dynamicAvatarURL())
    .setDescription('Olá, envie-nos um feedback para ajudar no desenvolvimento e crescimento do Bot, nós ficaremos muito felizes com a sua ajuda, abaixo selecione o tipo de feedback que você deseja enviar.')
    .setFooter(`TermoBot`)
    .setColor(this.client.config.colors.embed_color)
    .setThumbnail(this.client.user.dynamicAvatarURL('jpg', 4096));
    
    let CMPS = new Components(new SelectMenu('type', [{
      label: 'Avaliação',
      description: 'Envie uma avaliação sobre o bot',
      value: '1',
      emoji: {
        name: '♥️'
      }
    }, {
      label: 'Sugestão',
      description: 'Envie uma sugestão para o bot.',
      value: '2',
      emoji: {
        name: '💡'
      }
    }, {
      label: 'Denunciar bug',
      description: 'Envie as informações de um bug para que ele possa ser corrigido o mais rápido possível.',
      value: '3',
      emoji: {
        name: '🐛'
      }
    }], { placeholder: 'Selecione um tipo de feedback' }));
    
    let msg = await ctx.reply({ type: '4' }, { edit: true, embeds: [embed.embed], components: [CMPS.toJson] });
    
    let col = new MessageComponentCollector(this.client, {
      timeout: 1000 * 60 * 5,
      filter: (message: any, user: any, id: any) => message.id == msg.id && user?.id === ctx.author?.id && id === 'type'
    });
    
    let col2: MessageComponentCollector;
    
    col.on('collect', async (select: any) => {
      try {
        if(col2) col2.end();
        
        let value = select.data?.values?.[0];
        let title = value == 1 ? 'Enviar avaliação' : value == 2 ? 'Enviar sugestão' : 'Denunciar Bug';
        let components = [new Components(new ModalTextInput('first', (value == 1 ? 1 : 2), (value == 1 ? 'Envie uma nota de 0 a 5' : value == 2 ? 'Descreva a sua sugestão de forma detalhada' : 'Descreva o bug de forma detalhada'), { placeholder: (value == 1 ? '5' : value == 2 ? 'Adicionar um comando que faça isso e isso...' : 'Eu achei um bug que quando você executa o comando...'), required: true, min_length: (value == 1 ? 1 : value == 2 ? 10 : 10), max_length: (value == 1 ? 1 : value == 2 ? 1000 :4000) })).toJson]
        
        if(value == 1) {
          components.push(new Components(new ModalTextInput('second', 2, 'Envie uma avaliação sobre o bot', { placeholder: 'O bot é muito bom...', required: true, min_length: 10, max_length: 1000 })).toJson);
        } else if(value == 3) {
          components.push(new Components(new ModalTextInput('second', 1, 'Envie o link de um print/video do bug', { placeholder: 'https://prnt.sc/flTssHvSqvGK', required: true, max_length: 200 })).toJson);
        }
        
        let modal_res = new Modal(title, (value == '1' ? 'feedback' : value == 2 ? 'suggestion' : 'bug'), ...components);
        await select.sendModal(modal_res);
        
        col2 = new MessageComponentCollector(this.client, {
          timeout: 1000 * 60 * 5,
          filter: (message: any, user: any, id: any) => message.id == msg.id && user.id == ctx.author?.id && (id == 'feedback' || id == 'suggestion' || id == 'bug'),
          max: 1
        });
        
        col2.on('collect', async (modal: any) => {
          try {
            await modal.reply({ type: '6 '});
            
            let data = modal.data;
            if(data) {
              if(data.custom_id == 'feedback') {
                let rating = data.components.find((n: any) => n.components.find((n: any) => n.custom_id == 'first'))?.components?.[0].value;
                if(isNaN(rating)) {
                  return await modal.reply({ type: 4, content: `O campo nota obrigatoriamente precisa ser um número, valor recebido: **${rating}**` }, { followup: true, ephemeral: true });
                }
                
                col.end();
                CMPS.editComponent(['type'], { disabled: true });
                await ctx.reply({ type: '4' }, { edit: true, components: [CMPS.toJson] });
                
                if(rating > 5) {
                  rating = 5;
                }
           
                let comment = data.components.find((n: any) => n.components.find((n: any) => n.custom_id == 'second'))?.components?.[0].value;
                
                if(!rating || !comment) {
                  throw Error('Missing rating or content');
                }
                
                let guild = this.client.guilds.get(this.client.config.SafeEnv.$BASE_GUILD_ID)
                if(guild) {
                  let channel = guild.channels.get(this.client.config.channels.rating) as any;
                  if(channel) {
                    let text = rating >= 4 ? `Muito obrigado por me avaliar ♥️ vi que você me deu a nota **${rating}/5**, muito obrigado pelo carinho ✨` : `Muito obrigado por me avaliar ♥️ vi que você me deu a nota **${rating}/5** que tal mandar uma sugestão também para que eu fique melhor para todos os usuários! ✨`
                    
                    let embed = new Embed()
                    .setAuthor(modal.author?.username || 'Desconhecido', modal.author?.dynamicAvatarURL())
                    .setColor(this.client.config.colors.embed_color)
                    .setDescription(`**${modal.author?.username}** acabou de enviar um avaliação! Muito obrigado ♥️`)
                    .addField(`Nota: ${rating}/5`, comment)
                    .setFooter(`Utilize o comando /feedback para enviar uma avaliação também!`);
                    
                    let msg_a = await channel.createMessage(embed);
                    await modal.reply({ type: 4, content: text }, { followup: true, ephemeral: true });
                    msg_a.addReaction('♥️').catch(() => {});
                  } else {
                    throw Error('Unknown Feedback Channel.');
                  }
                } else {
                  throw Error('Unknown Guild.');
                }
              } else if(data.custom_id == 'suggestion') {
                col.end();
                CMPS.editComponent(['type'], { disabled: true });
                await ctx.reply({ type: '4' }, { edit: true, components: [CMPS.toJson] });
                
                let sug = data.components[0]?.components[0]?.value;
                
                if(!sug) {
                  return await this.sendErrorMsg(modal, `Missing suggestion content`);
                }
                
                let guild = this.client.guilds.get(this.client.config.SafeEnv.$BASE_GUILD_ID);
                if(guild) {
                  let channel = guild.channels.get(this.client.config.channels.suggestions) as any;
                  
                  if(channel) {
                    let embed = new Embed()
                    .setAuthor(modal.author?.username || 'Desconhecido', modal.author?.dynamicAvatarURL())
                    .setColor(this.client.config.colors.embed_color)
                    .setDescription(`**${modal.author?.username}** acabou de enviar uma sugestão!`)
                    .addField('Acões', '🟢 ~> Apoiar\n🔴 ~> Rejeitar\n:white_check_mark: ~> Aprovado pelo desenvolvedor\n:x: ~> Reprovado pelo desenvolvedor')
                    .addField(`Sugestão: `, sug)
                    .setFooter(`Utilize o comando /feedback para enviar uma sugestão também!`);
                    
                    let s_msg = await channel.createMessage(embed);
                    await modal.reply({ type: 4, content: `Olá, muito obrigado por enviar sua sugestão 💎, nós iremos trabalhar para deixar o nosso bot melhor para todos os usuários! ✨` }, { followup: true, ephemeral: true });
                    s_msg.addReaction('🟢').catch(() => {});
                    s_msg.addReaction('🔴').catch(() => {});
                  } else {
                    throw Error('Unknown Suggestion Channel.');
                  }
                } else {
                  throw Error('Unknown Guild');
                }
              } if (data.custom_id == 'bug') {
                let content = data.components.find((n: any) => n.components.find((n: any) => n.custom_id == 'first'))?.components?.[0]?.value;
                let link = data.components.find((n: any) => n.components.find((n: any) => n.custom_id == 'second'))?.components?.[0]?.value;
                
                if(!content || !link) {
                  throw Error('Missing content or link');
                }
                
                var UrlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i');
                
                if(!UrlPattern.test(link)) {
                  return await ctx.reply({ type: '4', content: `O link que você enviou não é válido você precisa mandar um link neste formato: https://site.dominio/imagem.formato` }, { followup: true, ephemeral: true })
                }
                
                col.end();
                CMPS.editComponent(['type'], { disabled: true });
                await ctx.reply({ type: '4' }, { edit: true, components: [CMPS.toJson] });
                
                let guild = this.client.guilds.get(this.client.config.SafeEnv.$BASE_GUILD_ID)
                if(guild) {
                  let channel = guild.channels.get(this.client.config.channels.bugs) as any;
                  if(channel) {
                    let embed = new Embed()
                    .setAuthor(modal.author?.username || 'Desconhecido', modal.author?.dynamicAvatarURL())
                    .setColor(this.client.config.colors.embed_color)
                    .setDescription(`( **${modal.author?.username}** / **${modal.author?.id}** ) acabou de enviar uma denúncia de bug.`)
                    .addField(`Descrição do bug`, content)
                    .setThumbnail(this.client.config.images.error)
                    .setFooter(`Link da imagem: ${link}`)
                    .setImage(link as string || '');
                    
                    let msg_a = await channel.createMessage(embed);
                    await modal.reply({ type: 4, content: `Obrigado pela sua denúncia de bug 🐛, nós iremos analisar e trabalhar bastante para corrigir este erro o mais rápido possível! caso queira algum suporte com pessoas reais entre em nosso servidor de suporte usando o comando **/servidor**.` }, { followup: true, ephemeral: true });
                  } else {
                    throw Error('Unknown Feedback Channel.');
                  }
                } else {
                  throw Error('Unknown Guild.');
                }
              }
            }
          } catch(_) {
            return await this.sendErrorMsg(modal, _, undefined, { followup: true });
          };
        })
      } catch(_) {
        return await this.sendErrorMsg(select, _, undefined, { followup: true })
      };
    });
    return true;
  }
}