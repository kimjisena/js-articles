type List = {
  value?: any,
  __proto__?: List | null,
}

function getEmptyList (): List {
  return Object.prototype;
}

function makeList (element: any, list: List): List {
  list = Object.create(list);
  list.value = element; 
  return list;
}

function first (list: List): List {
  return list.value;
}

function rest (list: List): List {
  return list.__proto__;
}

function isEmpty (list: List): boolean {
  return list.__proto__ === null;
}

function replaceFirst (element: any, list: List): List {
  list = Object.create(list.__proto__);
  list.value = element;
  return list;
}

function replaceRest (rest: List, list: List): List {
  let value = list.value;
  list = Object.create(rest);
  list.value = value;
  return list;
}

function printList (list: List): void {
  while(!isEmpty(list)) {
    console.log(list.value);
    list = rest(list);
  }
}