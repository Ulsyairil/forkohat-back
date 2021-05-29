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

Route.get("/", function ({ view }) {
  return view.render("welcome");
});

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
  Route.post("user/token", "AuthController.checkUser").middleware(["jwt"]);
  Route.get("user/profile", "ProfileController.index").middleware(["jwt"]);
  Route.put("user/profile/edit", "ProfileController.edit")
    .middleware(["jwt"])
    .validator("Auth/Profile");
  Route.put("user/profile/image/edit", "ProfileController.changeImage")
    .middleware(["jwt"])
    .validator("Auth/Profile");
  Route.post("logout", "AuthController.logout").middleware(["jwt"]);

  Route.get("file/:mime/:filename", "FileController.index");

  Route.post("/event", "Public/EventController.index").validator(
    "Public/Event"
  );
  Route.get("/event", "Public/EventController.get").validator("Public/Event");

  Route.get("/faq", "Public/FaqController.index");

  Route.post("/news", "Public/NewsController.index").validator("Public/News");
  Route.get("/news", "Public/NewsController.get").validator("Public/News");

  Route.post("/program", "Public/ProgramController.index").validator(
    "Public/Program"
  );
  Route.get("/program", "Public/ProgramController.get").validator(
    "Public/Program"
  );

  Route.post("/order", "Public/OrderController.index").validator(
    "Public/Order"
  );
  Route.get("/order", "Public/OrderController.get").validator("Public/Order");

  Route.post("/order/stuff", "Public/OrderStuffController.index").validator(
    "Public/OrderStuff"
  );
  Route.get("/order/stuff", "Public/OrderStuffController.get").validator(
    "Public/OrderStuff"
  );
}).prefix("api/v1");

Route.group(function () {
  // Event routes
  Route.post("events", "Superadmin/EventController.index");
  Route.get("event", "Superadmin/EventController.get").validator(
    "Superadmin/Event"
  );
  Route.post("event", "Superadmin/EventController.create").validator(
    "Superadmin/Event"
  );
  Route.put("event", "Superadmin/EventController.edit").validator(
    "Superadmin/Event"
  );
  Route.put("event/dump", "Superadmin/EventController.dump").validator(
    "Superadmin/Event"
  );
  Route.put("event/restore", "Superadmin/EventController.restore").validator(
    "Superadmin/Event"
  );
  Route.delete("event", "Superadmin/EventController.delete").validator(
    "Superadmin/Event"
  );
  Route.delete("event/file", "Superadmin/EventController.deleteFile").validator(
    "Superadmin/Event"
  );

  // Rule routes
  Route.post("rules", "Superadmin/RuleController.index");
  Route.get("rule", "Superadmin/RuleController.get").validator(
    "Superadmin/Rule"
  );
  Route.post("rule", "Superadmin/RuleController.create").validator(
    "Superadmin/Rule"
  );
  Route.put("rule", "Superadmin/RuleController.edit").validator(
    "Superadmin/Rule"
  );
  Route.put("rule/dump", "Superadmin/RuleController.dump").validator(
    "Superadmin/Rule"
  );
  Route.put("rule/restore", "Superadmin/RuleController.restore").validator(
    "Superadmin/Rule"
  );

  // Program route
  Route.post("programs", "Superadmin/ProgramController.index");
  Route.get("program", "Superadmin/ProgramController.get").validator(
    "Superadmin/Program"
  );
  Route.post("program", "Superadmin/ProgramController.create").validator(
    "Superadmin/Program"
  );
  Route.put("program", "Superadmin/ProgramController.edit").validator(
    "Superadmin/Program"
  );
  Route.put("program/dump", "Superadmin/ProgramController.dump").validator(
    "Superadmin/Program"
  );
  Route.put(
    "program/restore",
    "Superadmin/ProgramController.restore"
  ).validator("Superadmin/Program");
  Route.delete("program", "Superadmin/ProgramController.delete").validator(
    "Superadmin/Program"
  );

  // Program rules route
  Route.get(
    "rule/program",
    "Superadmin/ProgramRuledController.index"
  ).validator("Superadmin/RuleProgram");
  Route.post(
    "rule/program",
    "Superadmin/ProgramRuledController.create"
  ).validator("Superadmin/RuleProgram");
  Route.put("rule/program", "Superadmin/ProgramRuledController.edit").validator(
    "Superadmin/RuleProgram"
  );
  Route.delete(
    "rule/program",
    "Superadmin/ProgramRuledController.delete"
  ).validator("Superadmin/RuleProgram");

  // FAQ route
  Route.post("faqs", "Superadmin/FaqController.index");
  Route.get("faq", "Superadmin/FaqController.get").validator("Superadmin/Faq");
  Route.post("faq", "Superadmin/FaqController.create").validator(
    "Superadmin/Faq"
  );
  Route.put("faq", "Superadmin/FaqController.edit").validator("Superadmin/Faq");
  Route.put("faq/dump", "Superadmin/FaqController.dump").validator(
    "Superadmin/Faq"
  );
  Route.put("faq/restore", "Superadmin/FaqController.restore").validator(
    "Superadmin/Faq"
  );
  Route.delete("faq", "Superadmin/FaqController.delete").validator(
    "Superadmin/Faq"
  );

  // FAQ topic route
  Route.get("faq/topics", "Superadmin/FaqTopicController.index").validator(
    "Superadmin/FaqTopic"
  );
  Route.post("faq/topic", "Superadmin/FaqTopicController.create").validator(
    "Superadmin/FaqTopic"
  );
  Route.put("faq/topic", "Superadmin/FaqTopicController.edit").validator(
    "Superadmin/FaqTopic"
  );
  Route.put("faq/topic/dump", "Superadmin/FaqTopicController.dump").validator(
    "Superadmin/FaqTopic"
  );
  Route.put(
    "faq/topic/restore",
    "Superadmin/FaqTopicController.restore"
  ).validator("Superadmin/FaqTopic");
  Route.delete("faq/topic", "Superadmin/FaqTopicController.delete").validator(
    "Superadmin/FaqTopic"
  );

  // User route
  Route.post("users", "Superadmin/UserController.index");
  Route.get("user", "Superadmin/UserController.get").validator(
    "Superadmin/User"
  );
  Route.post("user", "Superadmin/UserController.create").validator(
    "Superadmin/User"
  );
  Route.put("user", "Superadmin/UserController.edit").validator(
    "Superadmin/User"
  );
  Route.put("user/dump", "Superadmin/UserController.dump").validator(
    "Superadmin/User"
  );
  Route.put("user/restore", "Superadmin/UserController.restore").validator(
    "Superadmin/User"
  );

  // News route
  Route.post("news", "Superadmin/NewsController.index");
  Route.get("news", "Superadmin/NewsController.get").validator(
    "Superadmin/News"
  );
  Route.post("news/add", "Superadmin/NewsController.create").validator(
    "Superadmin/News"
  );
  Route.put("news", "Superadmin/NewsController.edit").validator(
    "Superadmin/News"
  );
  Route.put("news/dump", "Superadmin/NewsController.dump").validator(
    "Superadmin/News"
  );
  Route.put("news/restore", "Superadmin/NewsController.restore").validator(
    "Superadmin/News"
  );
  Route.delete("news", "Superadmin/NewsController.delete").validator(
    "Superadmin/News"
  );
  Route.delete("news/file", "Superadmin/NewsController.deleteFile").validator(
    "Superadmin/News"
  );

  // Order route
  Route.post("orders", "Superadmin/OrderController.index").validator(
    "Superadmin/Order"
  );
  Route.get("order", "Superadmin/OrderController.get").validator(
    "Superadmin/Order"
  );
  Route.post("order", "Superadmin/OrderController.create").validator(
    "Superadmin/Order"
  );
  Route.put("order", "Superadmin/OrderController.edit").validator(
    "Superadmin/Order"
  );
  Route.put("order/dump", "Superadmin/OrderController.dump").validator(
    "Superadmin/Order"
  );
  Route.put("order/restore", "Superadmin/OrderController.restore").validator(
    "Superadmin/Order"
  );

  // Order stuff route
  Route.get("order/stuffs", "Superadmin/OrderStuffController.index").validator(
    "Superadmin/OrderStuff"
  );
  Route.get("order/stuff", "Superadmin/OrderStuffController.get").validator(
    "Superadmin/OrderStuff"
  );
  Route.post("order/stuff", "Superadmin/OrderStuffController.create").validator(
    "Superadmin/OrderStuff"
  );
  Route.put("order/stuff", "Superadmin/OrderStuffController.edit").validator(
    "Superadmin/OrderStuff"
  );
  Route.put(
    "order/stuff/dump",
    "Superadmin/OrderStuffController.dump"
  ).validator("Superadmin/OrderStuff");
  Route.put(
    "order/stuff/restore",
    "Superadmin/OrderStuffController.restore"
  ).validator("Superadmin/OrderStuff");

  // Order stuff file route
  Route.get(
    "order/stuff/files",
    "Superadmin/OrderFileController.index"
  ).validator("Superadmin/OrderFile");
  Route.post(
    "order/stuff/file",
    "Superadmin/OrderFileController.create"
  ).validator("Superadmin/OrderFile");
  Route.post(
    "order/stuff/file/check",
    "Superadmin/OrderFileController.checkImageRequest"
  ).validator("Superadmin/OrderFile");
  Route.put(
    "order/stuff/file",
    "Superadmin/OrderFileController.edit"
  ).validator("Superadmin/OrderFile");
  Route.put(
    "order/stuff/file/dump",
    "Superadmin/OrderFileController.dump"
  ).validator("Superadmin/OrderFile");
  Route.put(
    "order/stuff/file/restore",
    "Superadmin/OrderFileController.restore"
  ).validator("Superadmin/OrderFile");
  Route.delete(
    "order/stuff/file",
    "Superadmin/OrderFileController.delete"
  ).validator("Superadmin/OrderFile");
})
  .prefix("api/v1/superadmin")
  .middleware(["jwt:superadmin"]);

Route.group(function () {
  // Event routes
  Route.post("events", "Admin/EventController.index");
  Route.get("event", "Admin/EventController.get").validator("Admin/Event");
  Route.post("event", "Admin/EventController.create").validator("Admin/Event");
  Route.put("event", "Admin/EventController.edit").validator("Admin/Event");
  Route.put("event/dump", "Admin/EventController.dump").validator(
    "Admin/Event"
  );
  Route.put("event/restore", "Admin/EventController.restore").validator(
    "Admin/Event"
  );
  Route.delete("event", "Admin/EventController.delete").validator(
    "Admin/Event"
  );
  Route.delete("event/file", "Admin/EventController.deleteFile").validator(
    "Admin/Event"
  );

  // Rule routes
  Route.post("rules", "Admin/RuleController.index");
  Route.get("rule", "Admin/RuleController.get").validator("Admin/Rule");
  Route.post("rule", "Admin/RuleController.create").validator("Admin/Rule");
  Route.put("rule", "Admin/RuleController.edit").validator("Admin/Rule");
  Route.put("rule/dump", "Admin/RuleController.dump").validator("Admin/Rule");
  Route.put("rule/restore", "Admin/RuleController.restore").validator(
    "Admin/Rule"
  );

  // Program route
  Route.post("programs", "Admin/ProgramController.index");
  Route.get("program", "Admin/ProgramController.get").validator(
    "Admin/Program"
  );
  Route.post("program", "Admin/ProgramController.create").validator(
    "Admin/Program"
  );
  Route.put("program", "Admin/ProgramController.edit").validator(
    "Admin/Program"
  );
  Route.put("program/dump", "Admin/ProgramController.dump").validator(
    "Admin/Program"
  );
  Route.put("program/restore", "Admin/ProgramController.restore").validator(
    "Admin/Program"
  );
  Route.delete("program", "Admin/ProgramController.delete").validator(
    "Admin/Program"
  );

  // Program rules route
  Route.get("rule/program", "Admin/ProgramRuledController.index").validator(
    "Admin/RuleProgram"
  );
  Route.post("rule/program", "Admin/ProgramRuledController.create").validator(
    "Admin/RuleProgram"
  );
  Route.put("rule/program", "Admin/ProgramRuledController.edit").validator(
    "Admin/RuleProgram"
  );
  Route.delete("rule/program", "Admin/ProgramRuledController.delete").validator(
    "Admin/RuleProgram"
  );

  // FAQ route
  Route.post("faqs", "Admin/FaqController.index");
  Route.get("faq", "Admin/FaqController.get").validator("Admin/Faq");
  Route.post("faq", "Admin/FaqController.create").validator("Admin/Faq");
  Route.put("faq", "Admin/FaqController.edit").validator("Admin/Faq");
  Route.put("faq/dump", "Admin/FaqController.dump").validator("Admin/Faq");
  Route.put("faq/restore", "Admin/FaqController.restore").validator(
    "Admin/Faq"
  );
  Route.delete("faq", "Admin/FaqController.delete").validator("Admin/Faq");

  // FAQ topic route
  Route.get("faq/topics", "Admin/FaqTopicController.index").validator(
    "Admin/FaqTopic"
  );
  Route.post("faq/topic", "Admin/FaqTopicController.create").validator(
    "Admin/FaqTopic"
  );
  Route.put("faq/topic", "Admin/FaqTopicController.edit").validator(
    "Admin/FaqTopic"
  );
  Route.put("faq/topic/dump", "Admin/FaqTopicController.dump").validator(
    "Admin/FaqTopic"
  );
  Route.put("faq/topic/restore", "Admin/FaqTopicController.restore").validator(
    "Admin/FaqTopic"
  );
  Route.delete("faq/topic", "Admin/FaqTopicController.delete").validator(
    "Admin/FaqTopic"
  );

  // User route
  Route.post("users", "Admin/UserController.index");
  Route.get("user", "Admin/UserController.get").validator("Admin/User");
  Route.post("user", "Admin/UserController.create").validator("Admin/User");
  Route.put("user", "Admin/UserController.edit").validator("Admin/User");
  Route.put("user/dump", "Admin/UserController.dump").validator("Admin/User");
  Route.put("user/restore", "Admin/UserController.restore").validator(
    "Admin/User"
  );

  // News route
  Route.post("news", "Admin/NewsController.index");
  Route.get("news", "Admin/NewsController.get").validator("Admin/News");
  Route.post("news/add", "Admin/NewsController.create").validator("Admin/News");
  Route.put("news", "Admin/NewsController.edit").validator("Admin/News");
  Route.put("news/dump", "Admin/NewsController.dump").validator("Admin/News");
  Route.put("news/restore", "Admin/NewsController.restore").validator(
    "Admin/News"
  );
  Route.delete("news", "Admin/NewsController.delete").validator("Admin/News");
  Route.delete("news/file", "Admin/NewsController.deleteFile").validator(
    "Admin/News"
  );

  // Order route
  Route.post("orders", "Admin/OrderController.index");
  Route.get("order", "Admin/OrderController.get").validator("Admin/Order");
  Route.post("order", "Admin/OrderController.create").validator("Admin/Order");
  Route.put("order", "Admin/OrderController.edit").validator("Admin/Order");
  Route.put("order/dump", "Admin/OrderController.dump").validator(
    "Admin/Order"
  );
  Route.put("order/restore", "Admin/OrderController.restore").validator(
    "Admin/Order"
  );

  // Order stuff route
  Route.get("order/stuffs", "Admin/OrderStuffController.index").validator(
    "Admin/OrderStuff"
  );
  Route.get("order/stuff", "Admin/OrderStuffController.get").validator(
    "Admin/OrderStuff"
  );
  Route.post("order/stuff", "Admin/OrderStuffController.create").validator(
    "Admin/OrderStuff"
  );
  Route.put("order/stuff", "Admin/OrderStuffController.edit").validator(
    "Admin/OrderStuff"
  );
  Route.put("order/stuff/dump", "Admin/OrderStuffController.dump").validator(
    "Admin/OrderStuff"
  );
  Route.put(
    "order/stuff/restore",
    "Admin/OrderStuffController.restore"
  ).validator("Admin/OrderStuff");

  // Order stuff file route
  Route.get("order/stuff/files", "Admin/OrderFileController.index").validator(
    "Admin/OrderFile"
  );
  Route.post("order/stuff/file", "Admin/OrderFileController.create").validator(
    "Admin/OrderFile"
  );
  Route.post(
    "order/stuff/file/check",
    "Admin/OrderFileController.checkImageRequest"
  ).validator("Admin/OrderFile");
  Route.put("order/stuff/file", "Admin/OrderFileController.edit").validator(
    "Admin/OrderFile"
  );
  Route.put(
    "order/stuff/file/dump",
    "Admin/OrderFileController.dump"
  ).validator("Admin/OrderFile");
  Route.put(
    "order/stuff/file/restore",
    "Admin/OrderFileController.restore"
  ).validator("Admin/OrderFile");
  Route.delete(
    "order/stuff/file",
    "Admin/OrderFileController.delete"
  ).validator("Admin/OrderFile");
})
  .prefix("api/v1/admin")
  .middleware(["jwt:admin"]);

Route.group(function () {
  // Event routes
  Route.post("events", "Employee/EventController.index");
  Route.get("event", "Employee/EventController.get").validator(
    "Employee/Event"
  );
  Route.post("event", "Employee/EventController.create").validator(
    "Employee/Event"
  );
  Route.put("event", "Employee/EventController.edit").validator(
    "Employee/Event"
  );
  Route.put("event/dump", "Employee/EventController.dump").validator(
    "Employee/Event"
  );
  Route.put("event/restore", "Employee/EventController.restore").validator(
    "Employee/Event"
  );
  Route.delete("event", "Employee/EventController.delete").validator(
    "Employee/Event"
  );
  Route.delete("event/file", "Employee/EventController.deleteFile").validator(
    "Employee/Event"
  );

  // News route
  Route.post("news", "Employee/NewsController.index");
  Route.get("news", "Employee/NewsController.get").validator("Employee/News");
  Route.post("news/add", "Employee/NewsController.create").validator(
    "Employee/News"
  );
  Route.put("news", "Employee/NewsController.edit").validator("Employee/News");
  Route.put("news/dump", "Employee/NewsController.dump").validator(
    "Employee/News"
  );
  Route.put("news/restore", "Employee/NewsController.restore").validator(
    "Employee/News"
  );
  Route.delete("news", "Employee/NewsController.delete").validator(
    "Employee/News"
  );
  Route.delete("news/file", "Employee/NewsController.deleteFile").validator(
    "Employee/News"
  );

  // Order stuff route
  Route.get("order/stuffs", "Employee/OrderStuffController.index");
  Route.get("order/stuff", "Employee/OrderStuffController.get").validator(
    "Employee/OrderStuff"
  );
  Route.post("order/stuff", "Employee/OrderStuffController.create").validator(
    "Employee/OrderStuff"
  );
  Route.put("order/stuff", "Employee/OrderStuffController.edit").validator(
    "Employee/OrderStuff"
  );
  Route.put("order/stuff/dump", "Employee/OrderStuffController.dump").validator(
    "Employee/OrderStuff"
  );
  Route.put(
    "order/stuff/restore",
    "Employee/OrderStuffController.restore"
  ).validator("Employee/OrderStuff");

  // Order stuff file route
  Route.get(
    "order/stuff/files",
    "Employee/OrderFileController.index"
  ).validator("Employee/OrderFile");
  Route.post(
    "order/stuff/file",
    "Employee/OrderFileController.create"
  ).validator("Employee/OrderFile");
  Route.post(
    "order/stuff/file/check",
    "Employee/OrderFileController.checkImageRequest"
  ).validator("Employee/OrderFile");
  Route.put("order/stuff/file", "Employee/OrderFileController.edit").validator(
    "Employee/OrderFile"
  );
  Route.put(
    "order/stuff/file/dump",
    "Employee/OrderFileController.dump"
  ).validator("Employee/OrderFile");
  Route.put(
    "order/stuff/file/restore",
    "Employee/OrderFileController.restore"
  ).validator("Employee/OrderFile");
  Route.delete(
    "order/stuff/file",
    "Employee/OrderFileController.delete"
  ).validator("Employee/OrderFile");
})
  .prefix("api/v1/employee")
  .middleware(["jwt"]);
