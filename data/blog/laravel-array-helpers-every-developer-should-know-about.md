---
title: Laravel Array Helpers Every Developer Should Know About
date: '2023-07-14'
tags: ['laravel']
draft: false
summary: Laravel is known for its elegance, simplicity, and expressiveness.
image: '/static/images/array_wrap.png'
---

Laravel is known for its elegance, simplicity, and expressiveness. One of the most powerful features of Laravel is its helper functions. Laravel's array helpers are an essential tool for developers working with arrays of data.

This article will explore some Laravel array helper functions that every developer should know. These helpers can save time and make working with arrays more manageable. We'll cover `join()`, `keyBy()`, `get()`, `first()`, `last()`, and `pluck()`. So, let's dive in and see what Laravel's array helpers have to offer!

## Array Join

You might be thinking, "why do I need this helper when I can use `join()` or `implode()`?"

```bash
    use Illuminate\Support\Arr; $stack = ['Tailwind', 'Alpine', 'Laravel', 'Livewire']; Arr::join($stack, ', ');// Tailwind, Alpine, Laravel, Livewire implode($stack, ', ');// Tailwind, Alpine, Laravel, Livewire
```

The above work exactly the same, so I'll leave it up to you to decide which style you prefer.

Where the `join()` helper really comes in handy is when you want the last value to use a separate joining string:

```bash
    use Illuminate\Support\Arr; $stack = ['Tailwind', 'Alpine', 'Laravel', 'Livewire']; Arr::join($stack, ', ', ', and');// Tailwind, Alpine, Laravel, and Livewire
```

## Keyed Array data

Sometimes you'll take an array of data (i.e., multiple products) and key the data by a given product attribute. That way, you can conveniently target data for a given key.

You might have written something like the following, creating a new variable and stuffing the data into it by a keyed value:

```bash
     $array = [    ['product_id' => 'prod-100', 'name' => 'Desk'],    ['product_id' => 'prod-200', 'name' => 'Chair'],]; $keyed = []; foreach ($array as $value) {    $keyed[$value['product_id']] = $value;} /*    [        'prod-100' => ['product_id' => 'prod-100', 'name' => 'Desk'],        'prod-200' => ['product_id' => 'prod-200', 'name' => 'Chair'],    ]*/
```

Using the `Arr::keyBy()` method, you can do the same thing with one line of code:

```bash
    $keyed = Arr::keyBy($array, 'product_id');
```

## Checking and Getting Data from an Array

The mighty `Arr::get()` method is simple to use, but contains a powerful "dot notation" you can use to get nested data easily:

```bash
    use Illuminate\Support\Arr; $data = [    'products' => [        'desk' => [            'name' => 'Oakendesk'            'price' => 599.00,            'description' => 'Solid oak desk built from scratch.'        ],    ],]; // 599.00Arr::get($data, 'products.desk.price'); // Returns falseArr::has($data, 'products.desk.discount'); // Returns nullArr::get($data, 'products.desk.discount'); // Returns custom default value if not found.Arr::get($data, 'products.desk.discount', ['type' => 'percent', 'value' => 10]);
```

## Getting the first or last element in an array

When you have an array and want to get the last element, you can reach for the `end()` function in PHP:

```bash
    $array = [100, 200, 300, 110]; end($array);
```

If your array is empty, though, you will get `false` instead:

```bash
    $array = [];end($array); // false
```

Using Laravel's `last()` helper, you have multiple options when an array is empty:

```bash
    use Illuminate\Support\Arr; $array = []; Arr::last($array); // null // Provide a defaultArr::last($array, null, 100); // 100
```

Using Laravel's helper also enables you to pass a closure as a second argument as the condition for which element to return first or last respectively:

```bash
    $array = [100, 200, 300, 110]; Arr::last($array, fn ($e) => $e > 110); // 300Arr::first($array, fn ($e) => $e > 110); // 200
```

Simple but powerful API for the many situations you might find yourself in with getting the first or last element within array data.

## Plucking Data from an Array

Sometimes you need to get one scalar piece of data from a collection of data (i.e., emails from users):

```bash
    $array = [    ['user' => ['id' => 1, 'name' => 'User 1', 'email' => 'user1@example.com']],    ['user' => ['id' => 2, 'name' => 'User 2', 'email' => 'user2@example.com']],]; $emails = []; foreach ($array as $result) {    $emails[] = $result['user']['email'];} /*[    "user1@example.com",    "user2@example.com",]*/
```

Laravel's `Arr::pluck()` helper makes this trivial:

````bash
    Arr::pluck($array, 'user.email');
    ```
````
