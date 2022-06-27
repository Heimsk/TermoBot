"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CTXParser = void 0;
const eris_1 = require("eris");
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
class CTXParser {
    constructor(int, client) {
        if (!int)
            throw Error('missing interaction object');
        if (!client)
            throw Error('missing client');
        this.rawINT = int;
        this.client = client;
        this.token = int.token;
        this.id = int.id;
        this.commandName = int.data.name;
        this.command = this.commandName ? this.client.commands.get(this.commandName) : undefined;
        this.mentions = {
            users: new eris_1.Collection(eris_1.User),
            members: new eris_1.Collection(eris_1.Member)
        };
        this.options = int.data?.options;
        this.data = int.data;
        if (int.guild_id) {
            let guild = this.client.guilds.get(int.guild_id);
            if (guild)
                this.guild = guild;
        }
        if (int.data?.resolved) {
            if (int.data?.resolved.users) {
                for (let iuser of Object.values(int.data?.resolved.users)) {
                    let user = new eris_1.User(iuser, this.client);
                    this.mentions.users.set(user.id, user);
                }
            }
            if (int.data?.resolved.members) {
                for (let imember of Object.entries(int.data?.resolved.members)) {
                    imember[1].user = {
                        id: imember[0]
                    };
                    let member = new eris_1.Member(imember[1], this.guild, this.client);
                    member.rolesc = new eris_1.Collection(eris_1.Role);
                    for (let roleid of member.roles) {
                        let role = this.guild?.roles.get(roleid);
                        if (role) {
                            member.rolesc.set(roleid, role);
                        }
                    }
                    this.mentions.members.set(member.user.id, member);
                }
            }
        }
        if (int.member) {
            if (this.guild)
                this.member = new eris_1.Member(int.member, this.guild, this.client);
            if (this.guild && this.member && this.member.roles && this.member.roles.length > 0) {
                let rolesid = this.member.roles;
                this.member.rolesc = new eris_1.Collection(eris_1.Role);
                for (let roleid of rolesid) {
                    let role = this.guild.roles.get(roleid);
                    if (role) {
                        this.member.rolesc.set(roleid, role);
                    }
                }
            }
            if (this.member && !this.member.rolesc) {
                this.member.rolesc = new eris_1.Collection(eris_1.Role);
            }
        }
        this.author = this.client.users.get(int.member.user.id);
        if (this.guild)
            this.channel = this.guild.channels.get(int.channel_id);
    }
    async reply(res, options = {}) {
        let form = null;
        let obj = {};
        let embeds = [];
        let attachments = [];
        let components = [];
        if (options.embeds && options.embeds.length > 0) {
            embeds = options.embeds;
        }
        if (options.attachments) {
            attachments = options.attachments;
        }
        if (options.components) {
            components = options.components;
        }
        if (options.files && options.files.length > 0) {
            form = new form_data_1.default();
            form.append('payload_json', JSON.stringify({
                content: res.content,
                type: res.type || 4,
                embeds,
                attachments,
                components
            }));
            for (let i = 0; i < options.files.length; i++) {
                form.append(`files[${i}]`, options.files[i].file, options.files[i].filename);
            }
        }
        if ((res.content || embeds.length > 0 || attachments.length > 0) && !options.edit && !options.followup) {
            obj.data = {};
        }
        if (components.length > 0) {
            if (options.edit || options.followup) {
                obj.components = components;
            }
            else {
                obj.data.components = components;
            }
        }
        if (options.ephemeral) {
            if (options.edit || options.followup) {
                obj.flags = 64;
            }
            else {
                obj.data.flags = 64;
            }
        }
        if (embeds.length > 0) {
            if (options.edit || options.followup) {
                obj.embeds = embeds;
            }
            else {
                obj.data.embeds = embeds;
            }
        }
        if (attachments.length > 0) {
            if (options.edit || options.followup) {
                obj.attachments = attachments;
            }
            else {
                obj.data.attachments = attachments;
            }
        }
        if (res.content) {
            if (options.edit || options.followup) {
                obj.content = res.content;
            }
            else {
                obj.data.content = res.content;
            }
        }
        obj.type = res.type || 4;
        let formHeaders = form?.getHeaders?.() || {};
        let resp;
        if (options.followup) {
            resp = await axios_1.default.post(`https://discord.com/api/v10/webhooks/${this.client.user.id}/${this.token}`, form || obj, {
                headers: {
                    Authorization: `Bot ${process.env.TOKEN}`,
                    formHeaders
                }
            });
        }
        else if (options.edit) {
            resp = await axios_1.default.patch(`https://discord.com/api/v10/webhooks/${this.client.user.id}/${this.token}/messages/@original`, form || obj, {
                headers: {
                    Authorization: `Bot ${process.env.TOKEN}`,
                    formHeaders
                }
            });
        }
        else {
            resp = await axios_1.default.post(`https://discord.com/api/v10/interactions/${this.id}/${this.token}/callback`, form || obj, {
                headers: {
                    Authorization: `Bot ${process.env.TOKEN}`,
                    formHeaders
                }
            });
        }
        if (resp) {
            if (resp.data.channel_id) {
                try {
                    return new eris_1.Message(resp.data, this.client);
                }
                catch {
                    return;
                }
            }
        }
    }
    async sendModal(modal) {
        if (!modal)
            throw Error('missing modal');
        let body = {
            type: 9,
            data: modal
        };
        let res = await axios_1.default.post(`https://discord.com/api/v10/interactions/${this.id}/${this.token}/callback`, body, {
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`,
            }
        });
        if (res) {
            return res.data;
        }
    }
    async delete(msgid) {
        return await axios_1.default.delete(`https://discord.com/api/v10/webhooks/${this.client.user.id}/${this.token}/messages/${msgid}`, {
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`
            }
        });
    }
}
exports.CTXParser = CTXParser;
