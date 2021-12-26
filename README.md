# Builder test

## What is this?

This is a simple test app, implementing the coding challenge of an unnamed company

A live version of this code is running at https://builder-test.meteorapp.com/.
(Unless it's temporarily taken offline by the hosting company because of no usage.
If / when that happens, you need to wait for a few minutes for the app to boot
up again.)

## How to run?

Just run `make`.

Assuming that you have [make](https://www.gnu.org/software/make/) installed, this will take care of everything.
(It will download and install [Meteor](https://www.meteor.com/) if not available locally.)

After the app has started, just point your browser to http://localhost:3000/

## What is the tech stack?

This test app is built using the following components:
 * [Meteor](https://www.meteor.com/)
 * (Which automatically includes Node.js)
 * Typescript
 * React
 * [Ant Design](https://ant.design/docs/react/introduce) UI library

## Why are there *three* different versions?

Because there are different optimum ways of solving the tasks,
depending on how much do we want to rely on existing frameworks and libraries.
This results in slightly different data layers and tech stacks.

For now, these different versions live in different subdirectories in the project tree,
and different tabs on the UI.

I have included the following versions:
 * [The first version](https://github.com/csillag/builder-test/tree/master/imports/approach-1-mongo-collections) uses [MongoDB Collections with meteor](https://guide.meteor.com/collections.html)
   a live DDP connection, and MiniMongo -- the default Meteor data stack.
   Looking at the amount of code we have to write, this approach wins hands down,
   since this is a fully automatic, reactive data stack, reaching from the DB up to the client.
   We don't really have to code any of the server APIs, since they are available out of the box from Meteor.
   Please also note that this data is live; if you open the app in multiple browser windows, 
   changes from one window instantly propagate to all other ones. (Click on the 'certified' icons to test.)
 * [The second version](https://github.com/csillag/builder-test/tree/master/imports/approach-2-meteor-methods) uses [Meteor Methods](https://guide.meteor.com/methods.html) for communication.
   This is Meteor's RPC system, which abstracts away many technical details around providing and consuming API endpoints.
    No DB is involved, the data is loaded from a JSON data file, and then the server stores it in memory. 
    Unlike the previous Collections-based approach, this data is not live; 
    data needs to be refreshed to get the latest changes.
 * [The third version](https://github.com/csillag/builder-test/tree/master/imports/approach-3-http-api) uses 
   plain HTTP API endpoints on top of node.js.
   The client accesses the API via the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
   No DB is involved, the data is loaded from a JSON data file, and then the server stores it in memory.
   Conceptually this is the same as the previous method (with Meteor Methods), but with a lot more boilerplate code.

## What is the deal with the certification state, and hiding companies?

In order to better showcase the differences between the different approaches,
I wanted to add write access to the data, too, besides simply displaying it.
So you can toggle the certification states of each company, and you can also hide them.
(An show all hidden, using the button below.)
