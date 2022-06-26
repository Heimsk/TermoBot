interface Options {
  custom_id?: string;
  url?: string;
  emoji?: {
    name: string;
    id: string;
    animated?: boolean;
  };
  disabled?: boolean;
}

export interface ButtonComponentInterface {
  type: 2;
  label: string;
  style: number;
  custom_id?: string;
  url?: string;
  emoji?: {
    name: string;
    id: string;
    animated?: boolean
  };
  disabled?: boolean;
}

export class ButtonComponent {
  public constructor(label: string, style: number, options: Options = {}) {
    let button: ButtonComponentInterface = {
      type: 2,
      label,
      style,
    };
    
    if(options) {
      if(options.url) button.url = options.url;
      if(options.emoji) button.emoji = options.emoji;
      if(options.disabled) button.disabled = options.disabled
      if(options.custom_id) button.custom_id = options.custom_id;
    }
    
    return button;
  }
}