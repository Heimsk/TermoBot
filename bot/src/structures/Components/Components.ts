export class Components {
  public cmp: any
  
  public constructor(...components: any) {
    if(!components) throw Error('missing components');
    this.cmp = {
      type: 1,
      components: components
    };
  }
  
  public editComponent(ids: Array<string> | string, edit: object) {
    if(!ids) throw Error('missing id(s)');
    if(!edit) throw Error('missing edit');
    
    if(!Array.isArray(ids)) ids = [ids];
    
    for(let id of ids) {
      let cmpi = this.cmp.components?.findIndex((n: any) => n.custom_id == id);
      if(cmpi != -1) {
        let cmp = this.cmp.components[cmpi];
        if(cmp) {
          let entries = Object.entries(edit);
          for(let entry of entries) {
            cmp[entry[0]] = entry[1]
          }
          this.cmp.components[cmpi] = cmp;
        }
      }
    }
  }
  
  public pushComponent(...component: any): Array<any> {
    for(let comp of component) {
      this.cmp[0].components.push(comp);
    }
    return this.cmp
  }
  
  get toJson(): Array<any> {
    return this.cmp;
  }
}