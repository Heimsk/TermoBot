"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
const Embed_1 = require("./Embed");
class BaseCommand {
    constructor(client, infos, options, requirements) {
        if (!client)
            throw Error('Missing client');
        if (!infos)
            throw Error('Missing command infos');
        this.client = client;
        this.infos = infos;
        if (options)
            this.options = options;
        if (requirements)
            this.requirements = requirements;
        this.id = String(Math.floor(Math.random() * 999999999));
    }
    async execute(ctx) {
        await ctx.reply({ type: '4', content: 'Comando não implementado, por favor aguarde o desenvolvimento do bot.' }, { ephemeral: true });
        return true;
    }
    async sendErrorMsg(ctx, error, msg, options = {}) {
        if (!ctx) {
            throw Error('missing ctx!');
        }
        let _error = error;
        if (_error instanceof Error) {
            if (error?.stack?.length > 1000) {
                let e = error.stack.split('');
                e.splice(1000, e.length - 1000);
                _error = e.join('');
            }
        }
        let embed = new Embed_1.Embed()
            .setAuthor(ctx.author?.username || this.client.user.username, ctx.author?.dynamicAvatarURL() || this.client.user.dynamicAvatarURL())
            .setDescription(msg && msg.length > 0 ? msg : `Houve um erro ao processar seu comando, tente novamente, se o erro persistir, utilize o comando **/feedback** e envie uma denúncia de bug com o seguinte código: \n\n**Código de erro:** \`\`\`\n$COMMAND_NAME$ = ${this.infos?.name}\n\n${_error}\`\`\``)
            .setColor(this.client.config.colors.red)
            .setThumbnail(this.client.config.images.error);
        return ctx.reply({ type: '4' }, { embeds: [embed.embed], ephemeral: true, edit: options?.edit ? true : false, followup: options?.followup ? true : options.edit ? false : true }).catch(() => { });
    }
}
exports.BaseCommand = BaseCommand;
