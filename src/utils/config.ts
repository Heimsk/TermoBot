export const ClientConfig = {
  SafeEnv: {
    '$DEVMODE': process.argv.slice(2).find(n => n === '--dev') === undefined ? false : true,
    '$HOME': process.argv.slice(2).find(n => n === '--dev') === undefined ? process.cwd() : `${process.cwd()}/dist/bot`,
    '$BASE_GUILD_ID': '867098459977941013'
  },
  server_link: "https://discord.gg/f9BPwq9bq4",
  colors: {
    embed_color: 0x2F3136,
    red: 0xff0000,
    green: 0x00ff00
  },
  channels: {
    rating: '988188494641917972',
    suggestions: '988235260531703860',
    bugs: '988582397706633317'
  },
  images: {
    error: 'https://media.discordapp.net/attachments/869691044432850954/869691612345794580/warning.png'
  }
}