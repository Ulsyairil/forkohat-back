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

Route.group(() => {
  Route.get("province", "IndonesianAreaController.getProvince");
  Route.get("province/detail", "IndonesianAreaController.detailProvince");
  Route.get("city", "IndonesianAreaController.getCity");
  Route.get("city/detail", "IndonesianAreaController.detailCity");
  Route.get("district", "IndonesianAreaController.getDistrict");
  Route.get("district/detail", "IndonesianAreaController.detailDistrict");
  Route.get("sub-district", "IndonesianAreaController.getSubDistrict");
  Route.get(
    "sub-district/detail",
    "IndonesianAreaController.detailSubDistrict"
  );

  Route.post("login", "AuthController.login");
  Route.get("user", "AuthController.checkUser").middleware(["access"]);
  Route.post("refresh", "AuthController.refreshToken").middleware(["access"]);
}).prefix("api/v1");

Route.group(function () {
  // Event routes
  Route.post("events", "Superadmin/EventController.index");
  Route.get("event", "Superadmin/EventController.get").validator(
    "Superadmin/GetEvent"
  );
  Route.post("event", "Superadmin/EventController.create").validator(
    "Superadmin/CreateEvent"
  );
  Route.put("event", "Superadmin/EventController.edit").validator(
    "Superadmin/EditEvent"
  );
  Route.put("event/dump", "Superadmin/EventController.dump");
  Route.put("event/restore", "Superadmin/EventController.restore");
  Route.delete("event", "Superadmin/EventController.delete");
  Route.delete("event/file", "Superadmin/EventController.deleteFile");

  // Rule routes
  Route.post("rules", "Superadmin/RuleController.index");
  Route.get("rule", "Superadmin/RuleController.get").validator(
    "Superadmin/GetRule"
  );
  Route.post("rule", "Superadmin/RuleController.create").validator(
    "Superadmin/CreateRule"
  );
  Route.put("rule", "Superadmin/RuleController.edit").validator(
    "Superadmin/EditRule"
  );
  Route.put("rule/dump", "Superadmin/RuleController.dump").validator(
    "Superadmin/GetRule"
  );
  Route.put("rule/restore", "Superadmin/RuleController.restore").validator(
    "Superadmin/GetRule"
  );

  // Program route
  Route.post("programs", "Superadmin/ProgramController.index");
  Route.get("program", "Superadmin/ProgramController.get").validator(
    "Superadmin/GetProgram"
  );
  Route.post("program", "Superadmin/ProgramController.create").validator(
    "Superadmin/CreateProgram"
  );
  Route.put("program", "Superadmin/ProgramController.edit").validator(
    "Superadmin/EditProgram"
  );
  Route.put("program/dump", "Superadmin/ProgramController.dump").validator(
    "Superadmin/GetProgram"
  );
  Route.put(
    "program/restore",
    "Superadmin/ProgramController.restore"
  ).validator("Superadmin/GetProgram");
  Route.delete("program", "Superadmin/ProgramController.delete").validator(
    "Superadmin/GetProgram"
  );
})
  .prefix("api/v1/superadmin")
  .middleware(["access"]);

Route.group(function () {}).prefix("api/v1/admin");

Route.group(function () {}).prefix("api/v1/employee");
