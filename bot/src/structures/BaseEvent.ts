export class BaseEvent {
  public name: string;
  
  public constructor(name: string) {
    if(!name) throw Error('Event is missing name');
    
    this.name = name;
  }
}