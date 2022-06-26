interface SelectMenuOption {
  label: string;
  value: string,
  description: string;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean
  };
  default?: boolean;
}

interface Options {
  placeholder?: string;
  max_values?: number;
  min_values?: number;
  disabled?: boolean;
}

interface SelectMenu {
  type: 3,
  custom_id: string;
  options: Array<SelectMenuOption>;
  placeholder?: string;
  max_values?: number;
  min_values?: number;
  disabled?: boolean;
}

export class SelectMenuComponent {
  public constructor(customID: string, selections: Array<SelectMenuOption>, options: Options = {}) {
    let selectmenu: SelectMenu = {
      type: 3,
      custom_id: customID,
      options: selections
    };
    
    if(options) {
      ['placeholder', 'min_values', 'max_values', 'disabled'].forEach((opt: string) => {
        if(options[opt as keyof Options]) {
          //@ts-ignore
          selectmenu[opt as keyof Options] = options[opt as keyof Options];
        }
      });
    }
    
    return selectmenu;
  }
}