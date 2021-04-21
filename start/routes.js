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
})
  .prefix("api/v1/superadmin")
  .middleware(["access"]);

Route.group(function () {}).prefix("api/v1/admin");

Route.group(function () {}).prefix("api/v1/employee");
