export function errorHandler(field: String, error: any) {
    let errorTxt = '';
    for (const key in error) {
        switch (key) {
            case 'required': errorTxt = `${field} is required.`;
            break;
            case 'minlength': errorTxt = `${field} must contain atleast ${error[key]['requiredLength']} characters.`;
            break;
            case 'maxlength': errorTxt = `${field} must contain atmost ${error[key]['requiredLength']} characters.`;
            break;
            case 'isAlphabates': errorTxt = `${field} must contain only alphabets`;
            break;
            case 'isNumber': errorTxt = `${field} must contain only numbers`;
            break;
            case 'isDecimal': errorTxt = `${field} must contain only decimals`;
            break;
            case 'hasLength': errorTxt = `${field} must be equals to ${error[key]['requiredLength']} characters.`;
            break;
            default: errorTxt = `${field} is invalid.`;
            break;
        }
    }
    return errorTxt;
};