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

Route.get("/", function ({ response }) {
  return response.status(403).send("Access Forbidden");
});

Route.group(() => {
  // Route.get("province", "IndonesianAreaController.getProvince");
  // Route.get("province/detail", "IndonesianAreaController.detailProvince");
  // Route.get("city", "IndonesianAreaController.getCity");
  // Route.get("city/detail", "IndonesianAreaController.detailCity");
  // Route.get("district", "IndonesianAreaController.getDistrict");
  // Route.get("district/detail", "IndonesianAreaController.detailDistrict");
  // Route.get("sub-district", "IndonesianAreaController.getSubDistrict");
  // Route.get(
  //   "sub-district/detail",
  //   "IndonesianAreaController.detailSubDistrict"
  // );

  Route.post("login", "AuthController.login");
  Route.post("register", "AuthController.register");
  Route.post("user/token", "AuthController.checkUser").middleware(["api"]);
  Route.post("logout", "AuthController.logout").middleware(["api"]);

  Route.get("file/:mime/:filename", "FileController.index");

  Route.post("news", "Public/NewsController.index");
  Route.post("events", "Public/EventController.index");
  Route.post("faqs", "Public/FaqController.index");
  Route.get("galleries", "Public/GalleryController.index");
  Route.get("carousels", "Public/CarouselController.index");
}).prefix("api/v1");

// Admin Route
Route.group(function () {
  // User route
  Route.post("users", "Admin/UserController.index");
  Route.get("user", "Admin/UserController.get");
  Route.post("user", "Admin/UserController.create");
  Route.put("user", "Admin/UserController.edit");
  Route.put("user/dump", "Admin/UserController.dump");
  Route.put("user/restore", "Admin/UserController.restore");
  Route.delete("user", "Admin/UserController.destroy");

  // Rule routes
  Route.post("rules", "Admin/RuleController.index");
  Route.get("rules", "Admin/RuleController.indexAll");
  Route.get("rule", "Admin/RuleController.get");
  Route.post("rule", "Admin/RuleController.create");
  Route.put("rule", "Admin/RuleController.edit");
  Route.delete("rule", "Admin/RuleController.destroy");

  // Rule item routes
  Route.post("rule/item", "Admin/RuleItemController.create");
  Route.put("rule/item", "Admin/RuleItemController.edit");
  Route.delete("rule/item", "Admin/RuleItemController.destroy");

  // FAQ route
  Route.post("faqs", "Admin/FaqController.index");
  Route.get("faq", "Admin/FaqController.get");
  Route.post("faq", "Admin/FaqController.create");
  Route.put("faq", "Admin/FaqController.edit");
  Route.delete("faq", "Admin/FaqController.destroy");

  // FAQ topic route
  Route.post("faq/topics", "Admin/FaqTopicController.index");
  Route.get("faq/topic", "Admin/FaqTopicController.get");
  Route.post("faq/topic", "Admin/FaqTopicController.create");
  Route.put("faq/topic", "Admin/FaqTopicController.edit");
  Route.delete("faq/topic", "Admin/FaqTopicController.destroy");

  // News route
  Route.post("news", "Admin/NewsController.index");
  Route.get("news", "Admin/NewsController.get");
  Route.post("news/add", "Admin/NewsController.create");
  Route.put("news", "Admin/NewsController.edit");
  Route.put("news/dump", "Admin/NewsController.dump");
  Route.put("news/restore", "Admin/NewsController.restore");
  Route.delete("news", "Admin/NewsController.destroy");

  // News comment route
  Route.post("news/comments", "Admin/NewsCommentController.index");
  Route.get("news/comment", "Admin/NewsCommentController.get");
  Route.post("news/comment", "Admin/NewsCommentController.create");
  Route.put("news/comment", "Admin/NewsCommentController.edit");
  Route.delete("news/comment", "Admin/NewsCommentController.destroy");

  // Event routes
  Route.post("events", "Admin/EventController.index");
  Route.get("event", "Admin/EventController.get");
  Route.post("event", "Admin/EventController.create");
  Route.put("event", "Admin/EventController.edit");
  Route.put("event/dump", "Admin/EventController.dump");
  Route.put("event/restore", "Admin/EventController.restore");
  Route.delete("event", "Admin/EventController.destroy");
  Route.delete("event/file", "Admin/EventController.deleteFile");

  // Event comment route
  Route.post("event/comments", "Admin/EventCommentController.index");
  Route.get("event/comment", "Admin/EventCommentController.get");
  Route.post("event/comment", "Admin/EventCommentController.create");
  Route.put("event/comment", "Admin/EventCommentController.edit");
  Route.delete("event/comment", "Admin/EventCommentController.destroy");

  // Program route
  Route.post("programs", "Admin/ProgramController.index");
  Route.get("program", "Admin/ProgramController.get");
  Route.post("program", "Admin/ProgramController.create");
  Route.put("program", "Admin/ProgramController.edit");
  // Route.put("program/dump", "Admin/ProgramController.dump");
  // Route.put("program/restore", "Admin/ProgramController.restore");
  Route.delete("program", "Admin/ProgramController.destroy");

  // Arrangement route
  Route.post("arrangements", "Admin/ArrangementController.index");
  Route.get("arrangement", "Admin/ArrangementController.get");
  Route.post("arrangement", "Admin/ArrangementController.create");
  Route.put("arrangement", "Admin/ArrangementController.edit");
  // Route.put("arrangement/dump", "Admin/ArrangementController.dump");
  // Route.put("arrangement/restore", "Admin/ArrangementController.restore");
  Route.delete("arrangement", "Admin/ArrangementController.destroy");

  // Arrangement item route
  Route.post("arrangement/items", "Admin/ArrangementItemController.index");
  Route.get("arrangement/item", "Admin/ArrangementItemController.get");
  Route.post("arrangement/item", "Admin/ArrangementItemController.create");
  Route.put("arrangement/item", "Admin/ArrangementItemController.edit");
  Route.put("arrangement/item/dump", "Admin/ArrangementItemController.dump");
  Route.put(
    "arrangement/item/restore",
    "Admin/ArrangementItemController.restore"
  );
  Route.delete("arrangement/item", "Admin/ArrangementItemController.destroy");

  // Gallery route
  Route.post("galleries", "Admin/GalleryController.index");
  Route.post("gallery", "Admin/GalleryController.create");
  Route.put("gallery", "Admin/GalleryController.edit");
  Route.delete("gallery", "Admin/GalleryController.destroy");

  // Carousel route
  Route.post("carousels", "Admin/CarouselController.index");
  Route.post("carousel", "Admin/CarouselController.create");
  Route.put("carousel", "Admin/CarouselController.edit");
  Route.delete("carousel", "Admin/CarouselController.destroy");
})
  .prefix("api/v1/admin")
  .middleware(["api:admin"]);
// End Admin Route

// Member Route
Route.group(function () {
  // Program
  Route.post("programs", "Member/ProgramController.index");

  // Arrangement
  Route.post("arrangements", "Member/ArrangementController.index");

  // Arrangement item route
  Route.post("arrangement/items", "Member/ArrangementItemController.index");
  Route.get("arrangement/item", "Member/ArrangementItemController.get");
  Route.post("arrangement/item", "Member/ArrangementItemController.create");
  Route.put("arrangement/item", "Member/ArrangementItemController.edit");
  Route.put("arrangement/item/dump", "Member/ArrangementItemController.dump");
  Route.put(
    "arrangement/item/restore",
    "Member/ArrangementItemController.restore"
  );
  Route.delete("arrangement/item", "Member/ArrangementItemController.destroy");

  // Event routes
  Route.post("events", "Member/EventController.index");
  Route.get("event", "Member/EventController.get");
  Route.post("event", "Member/EventController.create");
  Route.put("event", "Member/EventController.edit");
  Route.put("event/dump", "Member/EventController.dump");
  Route.put("event/restore", "Member/EventController.restore");
  Route.delete("event", "Member/EventController.destroy");
  Route.delete("event/file", "Member/EventController.destroyFile");

  // Event comment route
  Route.post("event/comments", "Member/EventCommentController.index");
  Route.get("event/comment", "Member/EventCommentController.get");
  Route.post("event/comment", "Member/EventCommentController.create");
  Route.put("event/comment", "Member/EventCommentController.edit");
  Route.delete("event/comment", "Member/EventCommentController.destroy");

  // News route
  Route.post("news", "Member/NewsController.index");
  Route.get("news", "Member/NewsController.get");
  Route.post("news/add", "Member/NewsController.create");
  Route.put("news", "Member/NewsController.edit");
  Route.put("news/dump", "Member/NewsController.dump");
  Route.put("news/restore", "Member/NewsController.restore");
  Route.delete("news", "Member/NewsController.destroy");

  // News comment route
  Route.post("news/comments", "Member/NewsCommentController.index");
  Route.get("news/comment", "Member/NewsCommentController.get");
  Route.post("news/comment", "Member/NewsCommentController.create");
  Route.put("news/comment", "Member/NewsCommentController.edit");
  Route.delete("news/comment", "Member/NewsCommentController.destroy");
})
  .prefix("api/v1/member")
  .middleware(["api"]);
// End Member Route

Route.group(function () {
  // Program
  Route.post("programs", "Public/ProgramController.index");

  // Arrangement
  Route.post("arrangements", "Public/ArrangementController.index");

  // Arrangement item route
  Route.post("arrangement/items", "Public/ArrangementItemController.index");

  // News route
  Route.post("news", "Public/NewsController.index");
  Route.get("news", "Public/NewsController.get");

  // News comment route
  Route.post("news/comments", "Public/NewsCommentController.index");
  Route.get("news/comment", "Public/NewsCommentController.get");
  Route.post("news/comment", "Public/NewsCommentController.create");
  Route.put("news/comment", "Public/NewsCommentController.edit");
  Route.delete("news/comment", "Public/NewsCommentController.destroy");

  // Event routes
  Route.post("events", "Public/EventController.index");
  Route.get("event", "Public/EventController.get");

  // Event comment route
  Route.post("event/comments", "Public/EventCommentController.index");
  Route.get("event/comment", "Public/EventCommentController.get");
  Route.post("event/comment", "Public/EventCommentController.create");
  Route.put("event/comment", "Public/EventCommentController.edit");
  Route.delete("event/comment", "Public/EventCommentController.destroy");

  // Faqs Route
  Route.get("faqs", "Public/FaqController.index");

  // Galleries Route
  Route.get("galleries", "Public/GalleryController.index");

  // Carousels Route
  Route.get("carousels", "Public/CarouselController.index");

  // Profile Route
  Route.put("profile/password", "ProfileController.changePassword");
})
  .prefix("api/v1/public")
  .middleware(["api:public"]);
