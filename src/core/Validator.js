const rules = {
    number: /^[0-9]+\.?[0-9]*$/,
    phone: /^[1-9]\d{10}$/,
    email: /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/,
};
function parseValue(v) {
    const { type } = this;
    if (type === 'date') {
      return new Date(v);
    }
    if (type === 'number') {
      return Number(v);
    }
    return v;
}
function getValidation(flag, key) {
    let message = '';
    if (!flag) {
        switch(key) {
            case 'required':
                message = `${this.validateTitle}字段必填哦！`;
                break;
            case 'notMatch':
                message = `${this.validateTitle}字段不符合预期格式哦！`;
                break;
            case 'notIn':
                message = `${this.validateTitle}字段是无效值哦！`;
                break;
            default:
                message = `${this.validateTitle}字段是无效值哦！`;
        }
    }
    return { flag, message: this.message || message };
  }

class Validator {
    constructor(column) {
        this.validateKey = column.key
        this.validateTitle = column.title

        // type: date|number|phone|email|select
        // required
        // validator: RegExp|Function
        // message
        this.type = column.type
        this.options = column.options
        Object.assign(this, column.rule)
    }
    filterValue (value) {
        let label = value
        if (this.type === 'select' && Array.isArray(this.options)) {
            for (let item of this.options) {
                if (value === item.value) {
                    label = item.label
                    break
                }
            }
        }
        return label
    }
    validate(v) {
        const {
            required, validator, operator, options, type, descriptor
        } = this;

        if (required && /^\s*$/.test(v)) {
            return getValidation.call(this, false, 'required');
        }

        if (validator instanceof RegExp) {
            const pattern = new RegExp(validator)
            return getValidation.call(this, pattern.test(v), 'notIn');
        } else if (typeof validator === 'function') {
            return getValidation.call(this, validator(v), 'notIn');
        }
        if (/^\s*$/.test(v)) return { flag: true };

        if (rules[type] && !rules[type].test(v)) {
            return getValidation.call(this, false, 'notMatch');
        }
        // if (type === 'select') {
        //     return getValidation.call(this, options.includes(v), 'notIn');
        // }
        // if (operator) {
        //     const v1 = parseValue.call(this, v);
        //     if (operator === 'be') {
        //         const [min, max] = value;
        //         return getValidation.call(this, 
        //             v1 >= parseValue.call(this, min) && v1 <= parseValue.call(this, max),
        //             'between',
        //             min,
        //             max,
        //         );
        //     }
        //     if (operator === 'nbe') {
        //         const [min, max] = value;
        //         return getValidation.call(this, 
        //             v1 < parseValue.call(this, min) || v1 > parseValue.call(this, max),
        //             'notBetween',
        //             min,
        //             max,
        //         );
        //     }
        //     if (operator === 'eq') {
        //         return getValidation.call(this, 
        //             v1 === parseValue.call(this, value),
        //             'equal',
        //             value,
        //         );
        //     }
        //     if (operator === 'neq') {
        //         return getValidation.call(this, 
        //             v1 !== parseValue.call(this, value),
        //             'notEqual',
        //             value,
        //         );
        //     }
        //     if (operator === 'lt') {
        //         return getValidation.call(this, 
        //             v1 < parseValue.call(this, value),
        //             'lessThan',
        //             value,
        //         );
        //     }
        //     if (operator === 'lte') {
        //         return getValidation.call(this, 
        //             v1 <= parseValue.call(this, value),
        //             'lessThanEqual',
        //             value,
        //         );
        //     }
        //     if (operator === 'gt') {
        //         return getValidation.call(this, 
        //             v1 > parseValue.call(this, value),
        //             'greaterThan',
        //             value,
        //         );
        //     }
        //     if (operator === 'gte') {
        //         return getValidation.call(this, 
        //             v1 >= parseValue.call(this, value),
        //             'greaterThanEqual',
        //             value,
        //         );
        //     }
        // }
        return { flag: true };
    }
}

export default Validator