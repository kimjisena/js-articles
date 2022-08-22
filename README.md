# Flexin' the JavaScript Prototype Chain

## Context

One of the concepts I struggled to grasp as a JavaScript programmer was 
the _prototype_ chain. Despite the fact I didn't know how it actually worked or 
what it was, I found myself touching it every day during my learning and when I was 
doing projects.

Everytime the tutorials mentioned the prototype chain, I was freaked out. It was like the shadowy room in the basement that you were never supposed to enter, let alone open it. But now I know exactly what that goddamn chain is and I hope you will too after reading this article. Let's dive right in!

## Introduction

In this article, I'm going to assume you're familiar with basic programming concepts such as variables, functions and control flow. Also a little bit understanding of object-oriented programming will come in handy.

So, in JavaScript, everything that is not a `string`, `number`, `true`, `false`, `undefined`, `symbol`, `bigint` or `null` is an object. Technically speaking, `null`s are objects too but that's a subject for another day (or for today). A JavaScript object is an unordered collection of name/value pairs called `properties`.

It turns out, all objects are created from other objects, their _prototypes_, and all objects have prototypes. This is true for all objects except the `null` object. The `null` object doesn't have properties and it doesn't have a prototype.

In the following sections, we will create objects, interrogate the protoype chain and finally flex it by implementing a linked list.

## Creating objects

When a new object is created, it inherits properties from its prototype in addition to its _own_ properties.

All objects inherit properties from the `Object.prototype` object unless otherwise specified (remember this). The `prototype` property is a special property of constructor functions which specifies the properties that will be inherited by the instances created by invoking the constructor function.

On the other hand, all object instances have a `__proto__` property which is a reference to their prototype.

There are three main ways you can summon a JavaScript object into existence:

1. Using the object literal syntax

    This is the most straightforward way of creating an object.

    ```js
    let obj = {}; // obj is an empty object
    ```

    Now, an object created this way inherits properties directly from `Object.prototype`. 

    ```js
    obj.__proto__ === Object.prototype; // => true
    ```

    Properties such as `toSting()` and `valueOf()` are made available to `obj` via its prototype.

2. Using the `Object` constructor function

    It is also possible to create an object using the constructor function. You might have used this syntax to create other objects such as `Date`s.

    ```js
    let anotherObj = new Object(); // same as {}
    ```

    Just like above, `anotherObj` inherits properties from `Object.prototype`.

    ```js
    anotherObj.__proto__ === Object.prototype; // => true
    ```

3. Using the `Object.create` method

    Remember when we said "all objects inherit properties from `Object.prototype` unless otherwise specified"? You can use the `Object.create` method to specify which object you want to use as the prototype of your new creation. You can even use the `null` object!

    ```js
    let yetAnotherObj = Object.create(null);
    ```
    This is where things get interesting. Our newly created `yetAnotherObj` object now doesn't inherit any property from `Object.prototype`.

    Let's look up it's prototype just to make sure.

    ```js
    yetAnotherObj.__proto__ === null // => false
    ```
    What did just happen? Didn't we specify the `null` object as our prototype?

    Of course we did. What happened here is the `__proto__` property is not defined on our `yetAnotherObj` object. But why? That property belongs to `Object.prototype` and when we chose not to inherit properties from  `Object.prototype`, we lost the luxury of reading `__proto__` property. In JavaScript, reading an undefined property returns `undefined`.

    ```js
    yetAnotherObj.__proto__ === undefined // => true
    ```
    So our object was created using the `null` object as the prototype.

    To further affirm our understanding, let's pass `Object.prototype` as an argument to the `Object.create` method.
    ```js
    let andYetAnotherObj = Object.create(Object.prototype);
    ```
    Now if we check the prototype of our `andYetAnotherObj` object:
    ```js
    andYetAnotherObj.__proto__ === Object.prototype // => true
    ```

## The chain
Now that we can create objects, let's talk about the prototype chain. To understand the prototype chain we need to understand how properties are looked up on JavaScript objects.

When we try to read a property on an object, JavaScript first tries to read that property from the object itself. If it is defined, it returns its value. If it's not defined, and the object in question has a prototype, the property is looked up on that prototype and on that proptotype's prototype. Hence the prototype chain. If the end of the prototype chain is reached, JavaScript returns undefined.

Consider the following code:
```js
let point = { x: 2, y: 3, };
```
The `point` object has two properties defined on it, `x` and `y`. Let's look up those properties.

```js
point.x // => 2: x is defined on the object so its value is returned

point.y // => 3: again, y is defined on the object so its value is returned

point.z // => undefined: not defined on the object and on the prototype chain
```
The prototype chain looks something like this for our `point` object

```js
point.__proto__ // => Object.prototype

point.__proto__.__proto__ // => null: can't go further
```

Just to recap, the `prototype` property is special in that it is only defined on constructors. The value of the `prototype` property is an object which is used as the prototype for all instances created by invoking the constructor function. Instances have a `__proto__` property which is a reference to their prototype.

In other words, given constructor `Constructor`:
```js
let instance = new Constructor();

instance.__proto__ === Constructor.prototype // => true
```

## Flexin' the chain

Pheew! Now that the dark stuff is out of the way, let's have some fun! In this section, we will use our newly acquired knowledge of the prototype chain to implement a basic data structure called a linked list. 

Roughly speaking, a linked list is a collection of elements in which each element points to the next element in the list. Sounds familiar? The prototype chain is essentially just a linked list.

### Specification
Our linked list element will be a JavaScript object with a `value` property. References to other elements will be in the prototype chain.

We will define the following functions for working with our linked list:
- `getEmptyList: () => List` - this gives us the empty list
- `makeList: (element: any, list: List) => List` - puts `element` at the top of the existing `list`

Also, we need to access elements of our list. Here goes our accessors,
- `first: (list: List) => any` - gives us the first element on the existing `list`
- `rest: (list: List) => List` - gives us the rest of the `list` without the first element

Our accessors will only work if our list is not empty,
- `isEmpty: (list: List) => boolean` - tells us whether `list` is empty

Finally, we will need to mutate our list,
- `replaceFirst: (element: any, list: List) => List` - replaces the first element on `list` with `element`
- `replaceRest: (rest: List, list: List) => List` - replaces the rest elements of `list` with `rest`

### Implementation
Now let's implement our functions.

1. `getEmptyList: () => List`

    We will use `Object.prototype` as the beginning of our list because we can't go further than that on the prototype chain.

    ```js
    function getEmptyList () {
      return Object.prototype;
    }
    ```
2. `makeList: (element: any, list: List) => List`

    To grow our list, we will just add an object on the prototype chain using the `Object.create` method.

    ```js
    function makeList (element, list) {
      // create a new object using the current list as the prototype
      list = Object.create(list);
      // add the value property to the new object
      list.value = element; 
      return list;
    }
    ```
3. `first: (list: List) => any`

    Here, we simply need to return the value of the `value` property on `list`

    ```js
    function first (list) {
      return list.value;
    }
    ```
4. `rest: (list: List) => List`

    So far so good. For this function, we just need to remove the first object from the chain and return the rest of the chain (`__proto__` to the rescue).

    ```js
    function rest (list) {
      return list.__proto__;
    }
    ```

5. `isEmpty: (list: List) => boolean`

    The question here is, how do we know if the `list` is empty? Any idea? Yes, exactly! The prototype chain will tell us! All we have to do is ask.

    ```js
    function isEmpty (list) {
      return list.__proto__ === null;
    }
    ```

6. `replaceFirst: (element: any, list: List) => List`

    We simply need to change the value of the `value` property. Easy peasy!

    ```js
    function replaceFirst (element, list) {
      list.value = element;
      return list;
    }
    ```
7. `replaceRest: (rest: List, list: List) => List`

    I'm not gonna say anything here. The code should speak for itself.
    ```js
    function replaceRest (rest, list) {
      let value = list.value; // cache the the first element
      list = Object.create(rest); // create a new object using the `rest` list
      list.value = value; // finally, set the value property using our cached value
      return list;
    }
    ```

### Using the list
That's it. We can now work with our linked list like so:

```js
let list = getEmptyList();

isEmpty(list); // => true

list = makeList(3, makeList(1, makeList(4, makeList(2, makeList(5, emptyList()))))); // list => 3, 1, 4, 2, 5

isEmpty(list) // => false
first(list) // => 3
rest(list) // => { value: 1 }
```
Try out the other functions.

### Bonus

As a bonus, let's write a function that prints out all the elements of our linked list.

```js
function printList (list) {
  while(!isEmpty(list)) {
    console.log(list.value);
    list = rest(list);
  }
}

printList(list) // => 3, 1, 4, 2, 5
```
## Conclusion

In this article, we learned how to create objects and how property look ups are performed on JavaScript objects. We inspected the prototype and used it to implement a linked list data structure. 

I hope that this article has added something to your understanding of the prototype chain. Now, I urge you to go out there and create beautiful programs. Thanks for reading and happy coding!