import colors from 'colors/safe';

export class Logger {
  public config: any;
  public date: number = 0;
  public initialDate: number = 0;
  public timingtrace: boolean = false;
  
  public constructor(config?: any) {
    this.config = config;
  }
  
  public startTimingTrace() {
    this.date = Date.now();
    this.initialDate = this.date;
    this.timingtrace = true;
    console.log('~~~~~~~~~~~ Start of timing trace ~~~~~~~~~~~\n');
  }
  
  public endTimingTrace() {
    if(!this.timingtrace) {
      return;
    }
    
    this.timingtrace = false;
    console.log(`\n~~~~~~~~~~~ End of timing trace ~~~~~~~~~~~\nTime spent:`, colors.green(`${(Date.now() - this.initialDate) / 1000}s`))
  }
  
  public success(...text: Array<string>) {
    console.log(colors.green(colors.bold('SUCCESS')), `🟢`, (this.config.showTime ? `[ ${colors.gray(new Date().toLocaleTimeString())} ] ${text.join(' ')}` : text.join(' ')), (this.timingtrace ? colors.green(`+${(Date.now() - this.date) / 1000}s`) : ''));
    if(this.timingtrace) {
      this.date = Date.now();
    }
  }
  
  public info(...text: Array<string>) {
    console.log(colors.blue(colors.bold('INFO')), `🔵`, (this.config.showTime ? `[ ${colors.gray(new Date().toLocaleTimeString())} ] ${text.join(' ')}` : text.join(' ')), (this.timingtrace ? colors.green(`+${(Date.now() - this.date) / 1000}s`) : ''));
    if(this.timingtrace) {
      this.date = Date.now();
    }
  }
  
  public debug(...text: Array<string>) {
    console.log(colors.magenta(colors.bold('DEBUG')), `🟣`, (this.config.showTime ? `[ ${colors.gray(new Date().toLocaleTimeString())} ] ${text.join(' ')}` : text.join(' ')), (this.timingtrace ? colors.green(`+${(Date.now() - this.date) / 1000}s`) : ''));
    if(this.timingtrace) {
      this.date = Date.now();
    }
  }
  
  public warn(...text: Array<string>) {
    console.log(colors.yellow(colors.bold('WARN')), `🟡`, (this.config.showTime ? `[ ${colors.gray(new Date().toLocaleTimeString())} ] ${text.join(' ')}` : text.join(' ')), (this.timingtrace ? colors.green(`+${(Date.now() - this.date) / 1000}s`) : ''));
    if(this.timingtrace) {
      this.date = Date.now();
    }
  }
  
  public error(...text: Array<string>) {
    console.log(colors.red(colors.bold('ERROR')), `🔴`, (this.config.showTime ? `[ ${colors.gray(new Date().toLocaleTimeString())} ] ${text.join(' ')}` : text.join(' ')));
  }
  
  public fatal(...text: Array<string>) {
    console.log(colors.bgRed(colors.bold('FATAL')), `🔴🔴🔴`, (this.config.showTime ? `[ ${colors.gray(new Date().toLocaleTimeString())} ] ${text.join(' ')}` : text.join(' ')));
  }
}