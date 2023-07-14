---
title: 5 Underrated Filament Features
date: '2023-07-14'
tags: ['Filament', 'laravel', 'php']
draft: false
summary: People who have spent any amount of time in my Twitch stream know that I really, REALLY love one particular Laravel package Filament.
image: '/static/images/5filamentfeatures.jpg'
---

People who have spent any amount of time in my Twitch stream know that I really, REALLY love one particular Laravel package [Filament]
It's an immensely powerful group of packages to help build out common functionality in TALL-stack applications. I've used each of the packages on their own, but my most commonly used package is the one that combines them all: Admin Panel.

During my time using Filament, after the initial shock of just how easy the primary pieces of functionality were to use, I noticed that there are a handful of features that, while not spending the most time in the spotlight, are incredibly well-polished. These features aren't exactly earth-shattering for a lot of people, but if you bump into a situation where you need one of them, it makes everything much, much easier.

Let's jump right in: here are my top five most underrated features of Filament.

# 1.Simple chart generation

Charts, graphs, and data, oh my!

After years of working on Laravel applications that use admin panels, building charts and graphs from application data sits right near the top of my list of most frequently requested features. I can see why, though–data informs a business's decision-making process, and being able to see the data in a human-understandable way helps users to make quick, informed decisions at a glance.

Thankfully, over the past few years, creating charts and graphs has become easier and easier with the introduction of charting libraries. However, to use these packages, you still have to install and configure them, set up styling for them, and then push all of the data into them so they can display correctly. If you're using Filament, however, there's now an easier way!

Filament allows you to quickly and easily generate charts using the Chart.js library via several prebuilt and extendable Chart widget classes. Some of my personal favorites are LineChartWidget, BarChartWidget, and the always-fun DoughnutChartWidget! It's as simple as creating a new Widget class, extending the chart widget that you want to use, and giving your new class a heading and some data. For example:

```php
<?php

namespace App\Filament\Widgets;

use Filament\Widgets\BarChartWidget;

class LikesPerDay extends BarChartWidget
{
    protected function getHeading(): string
    {
        return 'Blog Post Likes per Day';
    }

    protected function getData(): array
    {
        return [
            'datasets' =>  [
                [
                    'label' => 'Number of Likes',
                    'data' => [12, 32, 12, 35, 22],
                ],
            ],
            'labels' => [
                '2022-01-01',
                '2022-01-09',
                '2022-01-12',
                '2022-01-22',
                '2022-01-23',
            ],
        ];
    }
}
```

Once you've built your chart widget, you are free to use it on any Dashboards in your project!

This is a massive time-saver if you're building lots of charts and graphs for your system, but Filament takes this a step further by integrating an interesting package: the flowframe/laravel-trend package. This package allows you to create trends of data from your Models using the Eloquent syntax that you know and love! For example, the above code could be re-written as:

```php
<?php

namespace App\Filament\Widgets;

use App\Models\Like;
use Filament\Widgets\BarChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class LikesPerDay extends BarChartWidget
{
    protected function getHeading(): string
    {
        return 'Blog Post Likes per Day';
    }

    protected function getData(): array
    {
        $data = Trend::model(Like::class)
            ->between(
                start: now()->subDays(5),
                end: now()
            )
            ->perDay()
            ->count();

        return [
            'datasets' =>  [
                [
                    'label' => 'Number of Likes',
                    'data' => $data->map(fn (TrendValue $value) => $value->aggregate),
                ],
            ],
            'labels' => $data->map(fn (TrendValue $value) => $value->date),
        ];
    }
}
```

The example above is simple, but since laravel-trends is so heavily backed by Eloquent, you can create powerful, extensive queries to gather data. For more information on the laravel-trends package, check out the documentation

# 2. Real-time notifications

Notifications are a staple in most modern web applications. In one form or another, they help alert the user to important events happening in the system, their account, or their data. Because they are such an important part of any application, the Filament maintainers have gone out of their way to create a robust and easy-to-use notifications package that is used in the Admin Panel.

Filament notifications are incredibly simple to create. Anywhere you would like to fire off a notification within your Filament code, you can use the Notification object's fluent API (similar to Eloquent, in case you aren't familiar with the term "fluent API") to build and send a notification to the user. At its core, firing a notification in Filament looks like this:

```php
<?php

namespace App\Http\Livewire;

use Filament\Notifications\Notifications;
use Livewire\Component;

class LikePost extends Component
{
    public function storeLike(): void
    {
        // Like creation & storage code

        Notification::make()
            ->title('Your Images have been Processed Successfully')
            ->success()
            ->send();
    }
}
```

You'd be hard-pressed to get more simple than that!

There's another facet to this, though, that elevates Filament's notifications from a great package to an indispensable package, and that's the ability to do real-time notifications.

Typically, without real-time notifications, if you wanted to update your user when a long-running task (like a queued job) was finished processing, you would have to continually poll an endpoint in the background that would eventually let you know that the job was completed. It's certainly a viable method of doing this, but depending on your use case, it can be a heavy strain to put on your server having hundreds or thousands of users polling the same endpoint over and over again waiting for their jobs to complete. If you find yourself in this sort of situation, the Filament Notifications package natively integrates with Laravel Echo, a JavaScript library that allows you to subscribe to channels and listen to events broadcast by your server. With this integration (as well as some sort of websockets implementation installed on your server, i.e. Pusher), we can update the previous notification code to broadcast the notification in real-time instead of sending it directly after an action is taken.

Filament gives us a few different ways to send real-time notifications, but my preferred option is to use a Laravel notification class like all other notifications in my system. That way, all of my notifications are written similarly, regardless of whether they're for Filament or any other part of the application. The only difference is that we will need to give our Notification class a toBroadcast method that fires the Filament notification, like so:

```php
<?php

namespace App\Notifications;

use App\Models\User;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class ImagesOptimized extends Notification
{
    public function toBroadcast(User $notifiable): BroadcastMessage
    {
        return FilamentNotification::make()
            ->title('Your Images have been Optimized Successfully')
            ->getBroadcastMessage();
    }
}
```

By building our Filament notification code into a Laravel notification, we are opening up the ability to use this same notification in other formats like email, SMS, etc. Even if we only use this Laravel notification class to send our Filament notification, we are still getting the benefit of having a dedicated class for this notification that resides in the same (or a similar) location as the rest of our notifications for our application.

If creating an entire class isn't your speed, Filament also provides a fluent API to broadcast notifications in a much more similar way to our original, synchronous Filament notification code. Pick your favorite and use what suits your project and your use case!

# 3. Native global search

Almost every project with an Admin panel eventually needs a way to quickly sort through all of the data in the system. Some might say that once you need a global search in your application, you need to update your UI/UX, but even in projects with impeccable, usable user interfaces, a global search bar can be a useful tool for users who know exactly what they want without remembering where to find it.

Building a global search implementation can be a tedious, time-consuming process. Making sure you build a performant and user-friendly option takes a decent bit of know-how to get it right. Thankfully, Filament has provided a substantial global search feature within their Admin panel that does a lot of the heavy lifting for us developers. At a basic level, all it takes to add specific resources to the global search functionality is to add a protected static ?string $recordTitleAttribute to your Resource class. This title attribute tells Filament to search a specific property (aka column) from your resource when a user attempts to use the global search. For example, setting the $recordTitleAttribute of a User Resource to last_name will cause Filament to compare the search string against the last_name property of all Users in the system.

This way of telling Filament what properties to search on specific resources works in many cases, but there are times when you might want to have Filament search over multiple columns. Filament's global search allows us to override the getGloballySearchableAttributes() method to return an array of columns (including relationships using the Laravel-standard dot notation) that Filament will search!

There are a few more goodies that Filament has added to the global search feature, but I'll leave you to check out the documentation page (it's an easy read) and discover some of the fun pieces yourself!

# 4. Not just an admin panel

I mentioned this at the beginning of this post, but one of my favorite parts about Filament, and one of the reasons that I tout it as one of the best packages in the entire Laravel ecosystem, is that all of the main parts of the Admin Panel package that we've been talking about this entire time (tables, forms, and notifications) are available as standalone packages for us to use in our TALL stack applications. Need an easy way to build out forms in your TALL stack app? Include the Filament Forms package. Want some nice looking and real-time (see point #2) notifications? Pop the Filament Notifications package in your project!

The creators and maintainers of Filament know how good their software is, and not only do they bundle it up and give it away for free in their Admin Panel package, but they also take the time to maintain each of these parts as their own, standalone package as well. What a gift to the Laravel & Livewire community! So next time you're building a TALL application and want some of the nice functionality from the Admin Panel without needing to include the entire package, pick and choose what you like best from the three core plugins and build your app from some of the best-made TALL packages in the community.

# 5. Custom pages

Last, but certainly not least, is my favorite feature of the Filament Admin panel: Custom Pages. There is a lot of CRUD-based Admin panel software out there, and Filament is no exception. The bread and butter of Filament is their CRUD-based workflow. However, when building "real-life" applications, there always tends to be something that can't be handled easily (or at all) with the generated CRUD views that most Admin panels offer. Whether that's a page that wraps multiple resources together or a very specialized view that doesn't correspond with the typical "CRUD-for-a-specific-resource" mentality, more than once I have had to break outside of the bounds of the Admin panel to achieve this.

With Filament, I can create whatever custom pages I could ever want, without ever having to leave the Admin panel.

Filament's custom pages come in two flavors: resource-based and general. Resource-based custom pages are added to the getPages() method on your Resource class, in the same way that the List, Create, View, and Edit pages are all added. These pages are typically best suited for workflows and use cases that only correspond to a particular resource, but fit slightly outside of the normal CRUD pages.

The more interesting pages (to me) are the general custom pages. These pages are simply full-page Livewire components, with all of the features and functionality of Livewire exposed to you, the developer. Creating one of these pages is as simple as using Artisan (php artisan make:filament-page YourPage) and once you have the files in front of you, you can write whatever TALL-stack code you need. Talk about customizability!
