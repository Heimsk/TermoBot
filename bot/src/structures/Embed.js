"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embed = void 0;
class Embed {
    constructor() {
        this.embed = {};
    }
    setTitle(title) {
        if (!title)
            throw Error('missing title');
        this.embed.title = title;
        return this;
    }
    setDescription(desc) {
        if (!desc)
            throw Error('missing description');
        this.embed.description = desc;
        return this;
    }
    setColor(color) {
        if (!color)
            throw Error('missing color');
        this.embed.color = color;
        return this;
    }
    setUrl(url) {
        if (!url)
            throw Error('missing url');
        this.embed.url = url;
        return this;
    }
    setTimestamp(timestamp) {
        if (!timestamp)
            throw Error('missing timestamp');
        this.embed.timestamp = timestamp;
        return this;
    }
    setFooter(text, url) {
        if (!text)
            throw Error('missing text');
        this.embed.footer = {
            text
        };
        return this;
    }
    setImage(url) {
        if (!url)
            throw Error('missing url');
        this.embed.image = {
            url
        };
        return this;
    }
    setThumbnail(url) {
        if (!url)
            throw Error('missing url');
        this.embed.thumbnail = {
            url
        };
        return this;
    }
    setVideo(url) {
        if (!url)
            throw Error('missing url');
        this.embed.video = {
            url
        };
        return this;
    }
    setProvider(name, url) {
        if (!name)
            throw Error('missing name');
        this.embed.provider = {
            name,
            url: url || ''
        };
        return this;
    }
    setAuthor(name, url) {
        if (!name)
            throw Error('missing name');
        this.embed.author = {
            name,
            icon_url: url || ''
        };
        return this;
    }
    addField(name, value, inline) {
        if (!name)
            throw Error('missing name');
        if (!value)
            throw Error('missing value');
        if (!this.embed.fields) {
            this.embed.fields = [];
        }
        this.embed.fields.push({
            name,
            value,
            inline: inline || false
        });
        return this;
    }
    setFields(fields) {
        if (!fields)
            throw Error('missing fields');
        if (!this.embed.fields) {
            this.embed.fields = [];
        }
        if (Array.isArray(fields)) {
            for (let field of fields) {
                if (!field.name)
                    throw Error('missing name');
                if (!field.value)
                    throw Error('missing value');
                this.embed.fields.push({
                    name: field.name,
                    value: field.value,
                    inline: field.inline || false
                });
            }
        }
        return this;
    }
}
exports.Embed = Embed;
