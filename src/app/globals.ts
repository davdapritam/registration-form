'use strict';

export class Globals {

    static buildFormData(formData: any, data: any, parentKey: any = null): void {
        if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
            Object.keys(data).forEach(key => {
                this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
            });
        } else {
            const value = data == null ? '' : data;
            formData.append(parentKey, value);
        }
    }

    static jsonToFormData(data: any): FormData {
        const formData = new FormData();
        this.buildFormData(formData, data);
        return formData;
    }

    static convertJSONToFormData(formData: FormData, data: any, parentKey: string =''): void {

      if (Array.isArray(data)) {

          if (data[0] instanceof File) {

              for (let i = 0; i < data.length; i++) {

                  formData.append(parentKey, data[i]);
              }

          } else {

              data.forEach((arrData, i) => {

                  this.convertJSONToFormData(formData, arrData, `${parentKey}[${i}]`);
              });
          }
      } else if (!!data && typeof data === 'object') {

          Object.keys(data).forEach(key => {

              if (key !== 'files') {

                  this.convertJSONToFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);

              } else if (key === 'files' && !!data[key].length) {

                  this.convertJSONToFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
              }
          });

      } else {

          const value = typeof data === 'boolean' || typeof data === 'number' ? data.toString() : data;
          formData.append(parentKey, value || null);
      }
  }
}
