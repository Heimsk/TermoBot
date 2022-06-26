interface TextInput {
  type: 4;
  custom_id: string;
  style: number;
  label: string;
  min_length?: number;
  max_length?: number;
  required?: boolean;
  value?: string;
  placeholder?: string;
}

interface Options {
  min_length?: number;
  max_length?: number;
  required?: boolean;
  value?: string;
  placeholder?: string;
}

export class ModalTextInput {
  public constructor(customID: string, style: number, label: string, options: Options = {}) {
    let input: TextInput = {
      type: 4,
      custom_id: customID,
      label,
      style
    }
    
    if(options) {
      ['placeholder', 'min_length', 'max_length', 'required', 'value'].forEach((opt: string) => {
        if(options[opt as keyof Options]) {
          //@ts-ignore
          input[opt as keyof Options] = options[opt as keyof Options];
        }
      });
    }
    
    return input;
  }
}