import { Components } from '../Components';

export interface ModalInterface {
  title: string;
  custom_id: string;
  components: [{
    type: 1,
    components: Components
  }]
}

export class Modal {
  public constructor(title: string, customID: string, ...components: any) {
    let modal: ModalInterface = {
      title,
      custom_id: customID,
      components: components
    }
    
    return modal;
  }
}