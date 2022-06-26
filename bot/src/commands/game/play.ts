import { BaseCommand } from '../../structures/BaseCommand';
import { TermoClient } from '../../structures/Client';
import { CTXParser } from '../../structures/CTXParser';
import { promises as fs } from 'fs';
import { Canvas, loadImage } from 'canvas-constructor/napi-rs';
import { MessageComponentCollector }  from '../../structures/MessageComponentCollector'
import { Components, Button } from '../../structures/Components'
import { MessageCollector } from '../../structures/MessageCollector';
import { Embed } from '../../structures/Embed';

export default class TermoCommand extends BaseCommand {
  public constructor(client: TermoClient) {
    super(client, {
      name: 'jogar',
      description: 'Jogue Termo no Discord!'
    }, [{
      type: 3,
      name: 'modo',
      description: 'Selecione o modo de jogo',
      required: true,
      choices: [{
        name: '4 letras',
        value: '4'
      }, {
        name: '5 letras',
        value: '5'
      }]
    }]);
  }
  
  public async execute(ctx: CTXParser): Promise<boolean> {
    try {
      await ctx.reply({ type: '5' });
      
      let game = this.client.games.find((n: any) => n.userid == ctx.author?.id);
      
      if(game) {
        let guild = this.client.guilds.get(game.guildid || '');
        let text = game.guildid != ctx.guild?.id ? `Você já tem uma partida ativa no servidor **${guild?.name}**.` : `Você ja tem uma partida ativa neste servidor.`;
        await ctx.reply({ type: '4', content: text }, { edit: true, ephemeral: true });
        return false;
      } else {
        this.client.games.push({ userid: ctx.author?.id || '', guildid: ctx.guild?.id || '' })
      }
      
      let mode = ctx.options?.find((n: any) => n.name === 'modo')?.value || '5';
      let Words = await fs.readFile(`${process.cwd()}/src/words/pt-br/${mode}_letras.txt`);
      let AllWords = await fs.readFile(`${process.cwd()}/src/words/pt-br/dicio.txt`);
      let file = await fs.readFile(`${process.cwd()}/src/images/tablets/tablet_${mode}_letters.png`);
      
      if(file) {
        let allwords = AllWords ? AllWords.toString().split('\n') : [];
        let Word = Words.toString().split('\n');
        let word = Word[Math.floor(Math.random() * Word.length)];
        let CMPS = new Components(new Button('Responder', 3, { custom_id: 'answer' }), new Button('Desistir', 4, { custom_id: 'giveup' }), new Button('Jogue Termo no seu próprio servidor!', 5, { url: `https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=137506417664&scope=applications.commands%20bot` }))
        let ended = false;
        let words: Array<string> = [];
        let status = ''
        let tries = 0;
        
        let tablet = await this.generateTablet(file, mode, word);
        let embed = new Embed()
        .setTitle('Termo')
        .setDescription(`Modo de jogo: **${mode} letras**`)
        .setImage('attachment://tablet.png')
        .setColor(this.client.config.colors.embed_color)
        .setFooter('TermoBot | Bot Fan Made, jogo original: termo.ooo');
        
        let msg = await ctx.reply({}, { edit: true, embeds: [embed.embed], attachments: [{
          id: 0,
          filename: 'tablet.png'
        }], files: [{
          file: tablet,
          filename: 'tablet.png'
        }], components: [CMPS.toJson] });
        
        let collector = new MessageComponentCollector(this.client, {
          timeout: 1000 * 60 * 14,
          filter: (message: any, author: any) => message.id ==  msg.id && author.id === ctx.author?.id
        });
        
        
        collector.on('collect', async (cmp: CTXParser) => {
          try {
            if(ended) return;
            if(cmp) {
              if(cmp.data?.custom_id === 'answer') {
                if(cmp.author?.id === ctx.author?.id) {
                  CMPS.editComponent('answer', { disabled: true });
                  await cmp.reply({ type: '4', content: 'Envie sua resposta neste canal.' }, { ephemeral: true });
                  await ctx.reply({ type: '4' }, { edit: true, components: [CMPS.toJson] });
                  
                  let msgc = new MessageCollector(this.client, {
                    channel_id: ctx.channel?.id || '',
                    timeout: 1000 * 60,
                    filter: (channel: any, author: any) => author.id == ctx.author?.id,
                    max: 1
                  });
                  
                  msgc.on('collect', async (msg: any) => {
                    try {
                      let content = msg.content.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
                      if(!ended) {
                        await msg.delete();
                        if(msg.content.length != Number(mode) || /^[a-z]+$/gi.test(content) == false) {
                          msgc.end('wrong');
                          await ctx.reply({ type: '4', content: `Você precisa responder uma palavra em português que contenha ${mode} letras`}, { ephemeral: true, followup: true });
                        } else {
                          if(!allwords.find((n: string) => n === content)) {
                            msgc.end('wrong')
                            return ctx.reply({ type: '4', content: `Essa palavra não existe, mande uma palavra em português que contenha ${mode} letras` }, { ephemeral: true, followup: true });
                          }
                          
                          words.push(content);
                          let tabletg = await this.generateTablet(file, mode, word, words);
                          
                          if(msg.content == word) {
                            status = 'win';
                            ended = true;
                            collector.end();
                          } else if(tries >= 5) {
                            status = 'lost';
                            ended = true;
                            collector.end();
                          }
                          
                          if(!ended) {
                            tries++
                            CMPS.editComponent(['answer'], { disabled: false });
                            await ctx.reply({ type: '4' }, { edit: true, embeds: [embed.embed], components: [CMPS.toJson], attachments: [{
                              id: 0,
                              filename: 'tablet.png',
                            }], files: [{
                              file: tabletg,
                              filename: 'tablet.png'
                            }]});
                          }
                        }
                      }
                    } catch(_) {
                      return await this.sendErrorMsg(cmp, _);
                    }
                  });
                  
                  msgc.on('end', async (error) => {
                    if(ended) return;
                    if(error != 'time' && error != 'wrong') return;
                    
                    CMPS.editComponent(['answer'], { disabled: false });
                    await ctx.reply({ type: '4' }, { edit: true, components: [CMPS.toJson] });
                  })
                }
              } else if(cmp.data?.custom_id === 'giveup') {
                status = 'lost';
                status = 'giveup';
                collector.end();
              }
            }
          } catch(_) {
            return await this.sendErrorMsg(cmp, _);
          }
        });
        
        collector.on('end', async () => {
          try {
            let final_embed = new Embed()
            //@ts-ignore
            .setAuthor(ctx.author?.username || '', ctx.author?.dynamicAvatarURL());
            
            CMPS.editComponent(['answer', 'giveup'], { disabled: true });
            
            let final_tablet;
            
            if(status !== 'giveup') {
              final_tablet = await this.generateTablet(file, mode, word, words);
            }
            
            if(status === 'lost' || status == 'giveup') {
              embed.setColor(this.client.config.colors.red)
              .setDescription(`Modo de jogo: **${mode} letras**\n\n<@${ctx.author?.id}> não acertou, a palavra era: **${word}**`);
              
              if(status == 'giveup') embed.setImage(`attachment://tablet.png`);
              
              await ctx.reply({ type: '4' }, { edit: true, embeds: [embed.embed], components: [CMPS.toJson], attachments: (status != 'giveup' ? [{
                id: 0,
                filename: 'tablet.png'
              }] : undefined), files: (status != 'giveup' ? [{
                file: final_tablet,
                filename: 'tablet.png'
              }] : undefined) });
              
              final_embed.setColor(this.client.config.colors.red)
              .setDescription(`Que pena, você não acertou, a palavra era: **${word}**`)
              
              await ctx.reply({ type: '4' }, { followup: true, embeds: [final_embed.embed] })
            } else if(status === 'win') {
              embed.setColor(this.client.config.colors.green)
              .setDescription(`Modo de jogo: **${mode} letras**\n\n<@${ctx.author?.id}> acertou! a palavra era: **${word}**`);
              await ctx.reply({ type: '4' }, { edit: true, embeds: [embed.embed], components: [CMPS.toJson], attachments: [{
                id: 0,
                filename: 'tablet.png'
              }], files: [{
                file: final_tablet,
                filename: 'tablet.png'
              }] });
              
              final_embed.setColor(this.client.config.colors.green)
              .setDescription(`Parabens, você acertou! a palavra era: **${word}**`);
              
              await ctx.reply({ type: '4' }, { followup: true, embeds: [final_embed.embed] });
            }
            
            let gamei = this.client.games.findIndex((n: any) => n.userid == ctx.author?.id);
            if(gamei != -1) {
              this.client.games.splice(gamei, 1);
            }
            ended = true;
          } catch(_) {
            return await this.sendErrorMsg(ctx, _);
          }
        });
    	}
    } catch(_) {
      await this.sendErrorMsg(ctx, _)
    }
    return true;
  }
  
  private async generateTablet(tabletFile: Buffer, mode: string, word: string, keys: Array<string> = ['']): Promise<any> {
    let img = await loadImage(tabletFile);
    let canvas = new Canvas(812, 985).printImage(img, 0, 0, 812, 985);
    
    for(let y = 0; y < keys.length; y++) {
      let splited = word.split('')
      let res_splited = keys[y].split('');
      let order = [];
      for(let i = 0; i < res_splited.length; i++) {
        if(splited[i].length > 0 && res_splited[i].length > 0 && splited[i] === res_splited[i]) {
          order.push({ letter: res_splited[i], bg: 'correct', i: i });
          res_splited[i] = '';
          splited[i] = '';
        }
      }
      
      for(let i = 0; i < res_splited.length; i++) {
        let reg = new RegExp(`${res_splited[i]}`, 'gi');
        if(reg.test(splited.join(''))) {
          if(res_splited[i].length > 0) {
            order.push({ letter: res_splited[i], bg: 'almost', i: i });
            
            let index = splited.findIndex(n => n === res_splited[i]);
            if(index != -1) {
              splited[index] = '';
            }
            
            res_splited[i] = '';
          }
        }
      }
      
      for(let i = 0; i < res_splited.length; i++) {
        if(splited[i] != res_splited[i]) {
          if(res_splited[i].length > 0) {
            order.push({ letter: res_splited[i], bg: 'incorrect', i: i });
            res_splited[i] = '';
            splited[i] = '';
          }
        }
      }
      
      order.sort((a, b) => a.i - b.i);
      for(let i = 0; i <= Number(mode); i++) {
        let l_pos_x: number = 0;
    		if(mode === '5') l_pos_x = i == 0 ? 50 : i == 1 ? 210 : i == 2 ? 370 : i == 3 ? 530 : i == 4 ? 690 : 50
        else l_pos_x = i == 0 ? 68 : i == 1 ? 270 : i == 2 ? 470 : i == 3 ? 670 : 3000;
  
        let b_pos_x: number = 0;
        if(mode === '5') b_pos_x = i == 0 ? 6 : i == 1 ? 167 : i == 2 ? 327 : i == 3 ? 487 : i == 4 ? 647 : 50
        else b_pos_x = i == 0 ? 8 : i == 1 ? 210 : i == 2 ? 411 : i == 3 ? 611 : 3000;
        
        let l_pos_y = y == 0 ? 50 : y == 1 ? 210 : y == 2 ? 370 : y == 3 ? 530 : y == 4 ? 690 : 850;
        let b_pos_y = y == 0 ? 10 : y == 1 ? 170 : y == 2 ? 330 : y == 3 ? 490 : y == 4 ? 650 : 810;
        let l = order[i]?.letter;
        let b = order[i]?.bg;
        
        if(l && b) {
          let Bg = await fs.readFile(`${process.cwd()}/src/images/bgs/${b}.png`);
          let bg = await loadImage(Bg);
      		canvas.printImage(bg, b_pos_x, b_pos_y, (mode == '4' ? 192 : 156), 156);
      		
          let Letter = await fs.readFile(`${process.cwd()}/src/images/letters/letter_${l}.png`)
          let letter = await loadImage(Letter);
    		  canvas.printImage(letter, l_pos_x, l_pos_y, 73, 73);
        }
      }
    }
  	
  	return canvas.pngAsync();
  }
}