"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_1 = require("../../structures/BaseCommand");
const Embed_1 = require("../../structures/Embed");
class HelpCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: 'ajuda',
            description: 'Use esse comando para aprender a jogar Termo!'
        });
    }
    async execute(ctx) {
        try {
            let embed = new Embed_1.Embed()
                .setAuthor(ctx.author?.username || '', ctx.author?.dynamicAvatarURL() || '')
                .setColor(this.client.config.colors.embed_color)
                .setThumbnail('https://media.discordapp.net/attachments/869691044432850954/988963303642501170/tutorial.png')
                .setDescription('Deseja ajuda ou não sabe como jogar Termo? leia os tópicos abaixo!')
                .addField('Comandos principais:', '`/ping` ~> Mostra a latência do ***Bot***.\n`/jogar` ~> Inicia uma partida de **Termo**.\n`/feedback` ~> Envia um feedback para o desenvolvedor.\n`/ajuda` ~> Mostra esse guia.')
                .addField('Como jogar Termo', `O seu objetivo no **Termo** é acertar a palavra escolhida aleatoriamente pelo ***Bot***, quando uma partida for iniciada basta apertar no botão verde "**Responder**" e em seguida enviar sua resposta no canal respectivo, todas as letras da palavra que você enviar terão uma cor, cada cor representa algo, a cor **verde** representa que a letra está na posição **correta**, a cor **amarela** representa que a palavra escolhida pelo ***Bot*** possuí esta letra porém está em uma posição **incorreta**, por ultimo a cor **preta**, a palavra escolhida pelo ***Bot*** **não possuí** esta letra.\n\n[Adicione o Termo em seu servidor](https://discord.com/oauth2/authorize?client_id=989285607949889617&permissions=137506417664&scope=applications.commands%20bot)\n[Entre no servidor oficial](${this.client.config.server_link})`);
            await ctx.reply({ type: '4' }, { embeds: [embed.embed] });
        }
        catch (_) {
            await this.sendErrorMsg(ctx, _);
        }
        return true;
    }
}
exports.default = HelpCommand;
