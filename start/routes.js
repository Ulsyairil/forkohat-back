"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
const Index = require("./../routes/index");
const Superadmin = require("./../routes/superadmin");
const Admin = require("./../routes/admin");
const Member = require("./../routes/member");
const Guest = require("./../routes/guest");

Route.get("/", function ({ response }) {
  return response.status(403).send("Access Forbidden");
});

Index(Route);
Superadmin(Route);
Admin(Route);
Member(Route);
Guest(Route);
