class CustomArray extends Array {
  constructor (length: number) {
    super(length);
  }

  fillUnique (value: any, start?: number, end?: number) {
    if(value && typeof value === 'object') {
      const isArray = Array.isArray(value);
      let copy: any;
  
      start = start && start < 0 ? this.length + start : start ? start : 0;
      end = end && end < 0 ? this.length + end : end ? end : this.length;

      for(let i = start; i < end; i++) {
        if (isArray) {
          copy = [...value];
        } else {
          copy = Object.assign({}, value);
        }
        this[i] = copy;
      }
      return this;
    } else {
      return this.fill(value, start, end);
    }
  }
}

export default CustomArray;