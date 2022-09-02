Array.prototype.fillUnique = function (value, start, end) {
  if(value && typeof value === 'object') {
    const isArray = Array.isArray(value);
    let copy;

    start = start && start < 0 ? this.length + start : start ? start : 0;
    end = end && end < 0 ? this.length + end : end ? end : this.length;

    for(let i = start; i < end; i++) {
      copy = isArray ? [...value] : {...value};
      this[i] = copy;
    }
    return this;
  } else {
    return this.fill(value, start, end);
  }
};