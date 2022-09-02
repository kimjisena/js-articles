# Playing It Safe With `Array.prototype.fill()`

## Introduction
So how do you initialize your dynamic arrays? When we create arrays using the `Array` constructor, we get a "holey" array so to speak. The resulting array has a defined `length` but it's filled with holes. Most of the time we need to initialize the array, and like many other things in JavaScript, there's a million ways to do just that (well not exactly). In this article, we will explore ways we can initialize arrays in JavaScript with a particular focus on `Array.prototype.fill()`. Ready?

## Initializing Arrays
### 1. Array literal syntax
If we know the contents of the array beforehand, it is good practice to initialize our array using the array literal syntax, like so:
```js
let fibs = [5, -3, 2, -1, 1, 0, 1, 1, 2, 3, 5,];
```

### 2. Initialization loop
Another popular way of initializing arrays is by using a plain old `for` loop, especially if we want to have sequential numeric elements. Of course a `while` loop can be used too.

For instance, the code below initializes the `evens` array with even numbers less than 10.
```js
let evens = [];

for (let i = 2; i < 10; i += 2) {
  evens.push(i);
}

console.log(evens); // => [2, 4, 6, 8]
```
We can also use the initilization loop to initialize all elements of an array to a static value.
```js
let nibble = new Array(4);

for (let i = 0; i < nibble.length; i++) {
  nibble[i] = 0;
}

console.log(nibble); // => [0, 0, 0, 0]
```

### 3. `Array.prototype.fill()`
Initializing arrays is so common a task that JavaScript has a built in method for our convenience. `Array.prototype.fill()` fills an array or a slice of the array with a static value.

This means we can create an array and initialize it in two lines of code. Cool right?
```js
let coolArr = new Array(3);
coolArr.fill('cool');

console.log(coolArr); // ['cool', 'cool', 'cool']
```
The `Array.prototype.fill()` method takes an additional two arguments: `start` to indicate at what index should the filling start, and `end` to indicate the index one up from where the filling should end. When not provided, `start` and `end` default to 0 and the length of the array respectively.
```js
let byte = new Array(8);
byte.fill(0, 0, 4); // fill with 0 from index 0 up to, but not including index 4

byte.fill(1, 4); // fill with 1 from index 4 up to the end of the array

console.log(byte); // => [0, 0, 0, 0, 1, 1, 1, 1]
```
What's more, `Array.prototype.fill()` accepts negative indices which are treated as offsets from the end of the array!
```js
let fives = new Array(5);
fives.fill(5, -5); // fill with 5 from index 0 (fives.length - 5) to the end

console.log(fives); // => [5, 5, 5, 5, 5]
```
## Surprise
I think we all agree that `Array.prototype.fill()` is way more convenient for the initialization task. And that's 
kind of the point of having it built in. Now, it's all **bad and bouje** until when we want to initialize our array with objects instead of primitives.

### Intermission
A quick reminder here, JavaScript primitives are `number`, `string`, `symbol`, `bigint`, `boolean` and `undefined` (this is not a proper primitive, but okay). Everything else is an `object`: objects themselves, arrays, `function`s and `null`s. The latter two (`function`s and `null`s) are special objects but they're still objects.

Why all this talk of primitives and objects you ask? Well, it's because they behave differently when evaluated. Objects are evaluated by *reference* while primitives are evaluated by *value*.

For instance, consider the three objects `obj1`, `obj2` and `obj3` below:
```js
let obj1 = {x: 1, y: 2,};
let obj2 = {x: 1, y: 2,};
let obj3 = obj2;

console.log(obj1 === obj2); // => false

console.log(obj3 === obj2); // => true
```
`obj1` and `obj2` have the same properties, in the same order and with the same values and yet they are not equal! But `obj2` and `obj3` are equal because they are *references* to the same object! Emphasis on *references*.

On the other hand, primitives are equal as long as their *values* are the same. Emphasis on *values*.
```js
let aFive = 5; // gimme a five
let anotherFive = 5; // gimme another five

console.log(a === b); // => true : a five is a five
```
Now that we're all speaking the same language, let's get on with `Array.prototype.fill()`.

### Enter ZigZag
To understand why it's important to know what types we're initializing our arrays with when we use `Array.prototype.fill()`, we will implement a simple algorithm, the *zigzag conversion algorithm*.

The requirement goes something like this:

Given a string `str` and number of rows `numRows`, a zigzag conversion function should return a zigzag converted string (I know).

For instance,
```
Input: str = "PAYPALISHIRING" numRows = 3

Output: "PAHNAPLSIIGYIR"

Rows:
[
  [P     A     H     N], // ROW 1
  [A  P  L  S  I  I  G], // ROW 2
  [Y     I     R      ], // ROW 3

]      
```

Looking at the zigzag pattern in the the rows above (I hope you can see it too), we can conclude that our algorithm will have the following steps:
```
START
1. While there are still characters to visit on str:
  1.1. Visit the next character
  1.2. Add it to the current row
  1.3. If current row is last row, start going backwards in rows, picking the previous row
  1.4. If current row is first row, start going forwards in rows, picking the next row
2. Concatenate rows to produce the output string
END
```

#### Implementation
Based on the steps above, we can see we will need a 2D array to hold our rows as we build them. Below is a buggy implementation of the zigzag conversion algorithm (can you spot the bug based on the output? It's a really subtle bug).

```js
function buggyZigZagConversion (str, numRows) {

  if (numRows === 1) {
    return str;
  }

  // we keep our rows in an array
  let rows = new Array(numRows);
  // each row is an array of characters, so let's initialize our array of rows
  rows.fill([]);

  // we select the first row
  let currentRow = 0;
  // `delta` will help us step majestically through the rows
  let delta;

  // keep visiting the next character of `str` until we've visited all of them
  for (let i = 0; i < str.length; i++) {

    if (currentRow === 0) {
       // it's the first row - we go forwards in rows, picking the next row
      delta = 1;
    } else if (currentRow === rows.length - 1) {
      // it's the last row -  we go backwards in rows, picking the previous row
      delta = -1;
    }
    // add the current character to the current row
    rows[currentRow].push(str[i]);
    // advance to the next or previous row
    currentRow += delta;
  }

  // flatten our rows and convert to a string
  return rows.flat().join('');
}

buggyZigZagConversion('PAYPALISHIRING', 3);
// output: => "PAYPALISHIRINGPAYPALISHIRINGPAYPALISHIRING"
// expected: => "PAHNAPLSIIGYIR"
```
It seems our zigzag conversion algorithm is indeed buggy! Our `buggyZigZagConversion()` function is repeating the input string `str` in the output `numRows` times. Nothing is zigzag about this. The bug is at the line that initializes our `rows` array.
```js
function buggyZigZagConversion (str, numRows) {
  ... // omitted details
  rows.fill([]);
  ... // omitted details
}
```

The code `rows.fill([])` does exactly what we would expect it to do. It initializes our `rows` array to a static value, which happens to be an object (arrays are objects, remember?). 

Remember,  objects are evaluated by *reference*. So our `rows` array ends up with `numRows` *references* to the one array we passed as an argument to `Array.prototype.fill()`.

As a result, when we visit the next character and add it to the current row, we end up modifying the same array! Our `rows` array is nothing but a container for *references* to one object in memory. Arrgh.

Consider the code below,
```js
let arr = new Array(2);
arr.fill([]);

console.log(arr[0] === arr[1]); // => true: arr[0] and arr[1] are references to the same object
```
`Array.prototype.fill()` isn't that cool anymore, is it?
### Debugging ZigZag
So, what should we do when we want to initialize an array with different objects?

Well, one obvious solution is to revisit our old friend: the initialization loop.
```js
function notSoBuggyZigZagConversion (str, numRows) {
  ... // omitted details
  let rows = new Array(numRows);
  // let's use a loop instead of rows.fill([]);
  for (let i = 0; i < rows.length; i++) {
    rows[i] = []; // we get a new array on every iteration
  }
  ... // omitted details
}
```
That works. But the loop makes our code kind of ugly, don't you think? Is there a better way? There's always a better way.

How about conditionally initializing the `rows` array whenever we visit the next character? Here is our second attempt.
```js
function debbugedZigZagConversion (str, numRows) {
  ... // omitted details
  let rows = new Array(numRows);
  // we don't initialize here
  for (let i = 0; i < str.length; i++) {

    // conditionally initialize the rows array
    rows[currentRow] = rows[currentRow] || [];

    ... // rest of the loop logic goes here
  }
  ... // omitted details
}
```

That works too. Basically, the line `rows[currentRow] = rows[currentRow] || [];` says if we have a row at index `currentRow` let's use that, otherwise let's assign an empty array at that index and use it instead. Honestly, this is more elegant than the loop version, but less convenient than simply calling a method. Who else misses `Array.prototype.fill()`?

## Playing the long game
Since we're long term people, let's play the long game. Let's forget our zigzag algorithm. Suppose we're working on a JavaScript library that drives a game.

This hypothetical library intensively utilizes dynamically initialized arrays of objects. Of course we could package the initialization loop in a function, export it as a module and import it whenever we need it. Fortunately for us, JavaScript is extensible.

Here's what we can do:
1. Extend the `Array.prototype` by adding a method called `Array.prototype.fillUnique()` that works exactly like `Array.prototype.fill()` except it handles object references for us.
2. Create a custom class `CustomArray` that extends `Array`. Then we could implement the `CustomArray.fillUnique()` instance method on our custom class.

In both of these cases, our `fillUnique()` method will have the same implementation.

### Extending `Array.prototype`

Modifying the prototype directly is not optimal and can get messy quickly, but it gets the job done. Defining `Array.prototype.fillUnique()` immediatelly makes that method available to all arrays. Nice.

Here's our `Array.prototype.fillUnique()` method:
```js
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
```
A quick overview of the code above. Our `Array.prototype.fillUnique()` method takes the same arguments as `Array.prototype.fill()`. It then checks if the `value` argument is an object (notice that our method handles `null`s and `function`s as well).

Next, the method determines if we're dealing with an array or an object so that we can make copies the right way. The method also handles `start` and `end` indices (yes, even negatives!).

Remember the initialization loop? That's what our method uses to initialize the array, but with unique objects instead of references. Also notice that we're using the built in `Array.prototype.fill()` to handle primitives, `null`s, and `function`s.
And that's it, no more subtle bugs!

### `CustomArray` extends `Array`
Using a custom class is more elegant because it documents our intent: We need an array but with added functionality. We can also implement methods that are specific to our use case on this custom class without cluttering the prototype chain. Way cool.

Here's our `CustomArray()` class:
```js
class CustomArray extends Array {
  constructor (length) {
    super(length);
  }

  fillUnique (value, start, end) {
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
  }

  ... // more use case methods go here
}
```
The method works exactly like above. A few things to note here is that we could customize our class as much as we need including adding more methods, adding parameters to our constructor and all this without losing the array functionality! Oh, how I love JavaScript!

## Conclusion
In this article we learned about different ways we can go about initializing our arrays. We implemented a zigzag conversion algorithm, we explored the obscurity of `Array.prototype.fill()` and all without breaking a sweat because it's JavaScript. I hope you enjoyed reading this article as much as I enjoyed writing it. 

Thanks for reading and code on!