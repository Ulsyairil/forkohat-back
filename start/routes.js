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
  Route.post("login", "AuthController.login");
  Route.post("register", "AuthController.register");
  Route.get("me", "AuthController.checkUser").middleware(["api"]);
  Route.post("logout", "AuthController.logout").middleware(["api"]);

  Route.get("file/:mime/:filename", "FileController.index");

  Route.post("news", "Guest/NewsController.index");
  Route.post("events", "Guest/EventController.indexPublic");
  Route.post("faqs", "Guest/FaqController.index");
  Route.get("galleries", "Guest/GalleryController.index");
  Route.get("carousels", "Guest/CarouselController.index");
}).prefix("api/v1");

// Superadmin Route
Route.group(function () {
  // User route
  Route.post("users", "Superadmin/UserController.index");
  Route.get("users", "Superadmin/UserController.indexAll");
  Route.get("user", "Superadmin/UserController.get");
  Route.post("user", "Superadmin/UserController.create");
  Route.put("user", "Superadmin/UserController.edit");
  Route.put("user/dump", "Superadmin/UserController.dump");
  Route.put("user/restore", "Superadmin/UserController.restore");
  Route.delete("user", "Superadmin/UserController.destroy");

  // Rule routes
  Route.post("rules", "Superadmin/RuleController.index");
  Route.get("rules", "Superadmin/RuleController.indexAll");
  Route.get("rule", "Superadmin/RuleController.get");
  Route.post("rule", "Superadmin/RuleController.create");
  Route.put("rule", "Superadmin/RuleController.edit");
  Route.delete("rule", "Superadmin/RuleController.destroy");

  // Rule item routes
  Route.post("rule/permissions", "Superadmin/PermissionController.index");
  Route.get("rule/permissions", "Superadmin/PermissionController.indexAll");
  Route.post("rule/permission", "Superadmin/PermissionController.create");
  Route.put("rule/permission", "Superadmin/PermissionController.edit");
  Route.delete("rule/permission", "Superadmin/PermissionController.destroy");

  // FAQ route
  Route.post("faqs", "Superadmin/FaqController.index");
  Route.get("faqs", "Superadmin/FaqController.indexAll");
  Route.get("faq", "Superadmin/FaqController.get");
  Route.post("faq", "Superadmin/FaqController.create");
  Route.put("faq", "Superadmin/FaqController.edit");
  Route.delete("faq", "Superadmin/FaqController.destroy");

  // FAQ topic route
  Route.post("faq/topics", "Superadmin/FaqTopicController.index");
  Route.get("faq/topic", "Superadmin/FaqTopicController.get");
  Route.post("faq/topic", "Superadmin/FaqTopicController.create");
  Route.put("faq/topic", "Superadmin/FaqTopicController.edit");
  Route.delete("faq/topic", "Superadmin/FaqTopicController.destroy");

  // News route
  Route.post("news", "Superadmin/NewsController.index");
  Route.get("news", "Superadmin/NewsController.get");
  Route.post("news/add", "Superadmin/NewsController.create");
  Route.put("news", "Superadmin/NewsController.edit");
  Route.put("news/dump", "Superadmin/NewsController.dump");
  Route.put("news/restore", "Superadmin/NewsController.restore");
  Route.delete("news", "Superadmin/NewsController.destroy");

  // News comment route
  Route.post("news/comments", "Superadmin/NewsCommentController.index");
  Route.get("news/comment", "Superadmin/NewsCommentController.get");
  Route.post("news/comment", "Superadmin/NewsCommentController.create");
  Route.put("news/comment", "Superadmin/NewsCommentController.edit");
  Route.delete("news/comment", "Superadmin/NewsCommentController.destroy");

  // Event routes
  Route.post("events", "Superadmin/EventController.index");
  Route.get("event", "Superadmin/EventController.get");
  Route.post("event", "Superadmin/EventController.create");
  Route.put("event", "Superadmin/EventController.edit");
  Route.put("event/dump", "Superadmin/EventController.dump");
  Route.put("event/restore", "Superadmin/EventController.restore");
  Route.delete("event", "Superadmin/EventController.destroy");

  // Event file
  Route.post("event/file", "Superadmin/EventFileController.index");
  Route.post("event/file/add", "Superadmin/EventFileController.create");
  Route.delete("event/file", "Superadmin/EventFileController.destroy");

  // Event comment route
  Route.post("event/comments", "Superadmin/EventCommentController.index");
  Route.get("event/comment", "Superadmin/EventCommentController.get");
  Route.post("event/comment", "Superadmin/EventCommentController.create");
  Route.put("event/comment", "Superadmin/EventCommentController.edit");
  Route.delete("event/comment", "Superadmin/EventCommentController.destroy");

  // Program route
  Route.post("programs", "Superadmin/ProgramController.index");
  Route.get("programs", "Superadmin/ProgramController.indexAll");
  Route.get("program", "Superadmin/ProgramController.get");
  Route.post("program", "Superadmin/ProgramController.create");
  Route.put("program", "Superadmin/ProgramController.edit");
  // Route.put("program/dump", "Superadmin/ProgramController.dump");
  // Route.put("program/restore", "Superadmin/ProgramController.restore");
  Route.delete("program", "Superadmin/ProgramController.destroy");

  // Arrangement route
  Route.post("arrangements", "Superadmin/ArrangementController.index");
  Route.get("arrangements", "Superadmin/ArrangementController.indexAll");
  Route.get("arrangement", "Superadmin/ArrangementController.get");
  Route.post("arrangement", "Superadmin/ArrangementController.create");
  Route.put("arrangement", "Superadmin/ArrangementController.edit");
  // Route.put("arrangement/dump", "Superadmin/ArrangementController.dump");
  // Route.put("arrangement/restore", "Superadmin/ArrangementController.restore");
  Route.delete("arrangement", "Superadmin/ArrangementController.destroy");

  // Arrangement item route
  Route.post("arrangement/items", "Superadmin/ArrangementItemController.index");
  Route.get("arrangement/item", "Superadmin/ArrangementItemController.get");
  Route.post("arrangement/item", "Superadmin/ArrangementItemController.create");
  Route.put("arrangement/item", "Superadmin/ArrangementItemController.edit");
  Route.put(
    "arrangement/item/dump",
    "Superadmin/ArrangementItemController.dump"
  );
  Route.put(
    "arrangement/item/restore",
    "Superadmin/ArrangementItemController.restore"
  );
  Route.delete(
    "arrangement/item",
    "Superadmin/ArrangementItemController.destroy"
  );

  // Gallery route
  Route.post("galleries", "Superadmin/GalleryController.index");
  Route.post("gallery", "Superadmin/GalleryController.create");
  Route.put("gallery", "Superadmin/GalleryController.edit");
  Route.delete("gallery", "Superadmin/GalleryController.destroy");

  // Carousel route
  Route.post("carousels", "Superadmin/CarouselController.index");
  Route.post("carousel", "Superadmin/CarouselController.create");
  Route.put("carousel", "Superadmin/CarouselController.edit");
  Route.delete("carousel", "Superadmin/CarouselController.destroy");
})
  .prefix("api/v1/superadmin")
  .middleware(["api:superadmin"]);
// End Superadmin Route

// Admin Route
Route.group(function () {
  // User route
  Route.post("users", "Admin/UserController.index");
  Route.get("users", "Admin/UserController.indexAll");
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
  Route.post("rule/permissions", "Admin/PermissionController.index");
  Route.get("rule/permissions", "Admin/PermissionController.indexAll");
  Route.post("rule/permission", "Admin/PermissionController.create");
  Route.put("rule/permission", "Admin/PermissionController.edit");
  Route.delete("rule/permission", "Admin/PermissionController.destroy");

  // FAQ route
  Route.post("faqs", "Admin/FaqController.index");
  Route.get("faqs", "Admin/FaqController.indexAll");
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

  // Event file
  Route.post("event/file", "Admin/EventFileController.index");
  Route.post("event/file/add", "Admin/EventFileController.create");
  Route.delete("event/file", "Admin/EventFileController.destroy");

  // Event comment route
  Route.post("event/comments", "Admin/EventCommentController.index");
  Route.get("event/comment", "Admin/EventCommentController.get");
  Route.post("event/comment", "Admin/EventCommentController.create");
  Route.put("event/comment", "Admin/EventCommentController.edit");
  Route.delete("event/comment", "Admin/EventCommentController.destroy");

  // Program route
  Route.post("programs", "Admin/ProgramController.index");
  Route.get("programs", "Admin/ProgramController.indexAll");
  Route.get("program", "Admin/ProgramController.get");
  Route.post("program", "Admin/ProgramController.create");
  Route.put("program", "Admin/ProgramController.edit");
  // Route.put("program/dump", "Admin/ProgramController.dump");
  // Route.put("program/restore", "Admin/ProgramController.restore");
  Route.delete("program", "Admin/ProgramController.destroy");

  // Arrangement route
  Route.post("arrangements", "Admin/ArrangementController.index");
  Route.get("arrangements", "Admin/ArrangementController.indexAll");
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

  // Event file
  Route.post("event/files", "Admin/EventController.index");
  Route.post("event/file/add", "Admin/EventController.create");
  Route.delete("event/file", "Admin/EventController.destroy");

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
  .middleware(["api:member"]);
// End Member Route

Route.group(function () {
  // Program
  Route.post("programs", "Guest/ProgramController.index");

  // Arrangement
  Route.post("arrangements", "Guest/ArrangementController.index");
  Route.post(
    "arrangement/generals",
    "Guest/ArrangementController.indexGeneral"
  );

  // Arrangement item route
  Route.post("arrangement/items", "Guest/ArrangementItemController.index");

  // News route
  Route.post("news", "Guest/NewsController.index");
  Route.get("news", "Guest/NewsController.get");

  // News comment route
  Route.post("news/comments", "Guest/NewsCommentController.index");
  Route.get("news/comment", "Guest/NewsCommentController.get");
  Route.post("news/comment", "Guest/NewsCommentController.create");
  Route.put("news/comment", "Guest/NewsCommentController.edit");
  Route.delete("news/comment", "Guest/NewsCommentController.destroy");

  // Event routes
  Route.post("events", "Guest/EventController.index");
  Route.get("event", "Guest/EventController.get");

  // Event comment route
  Route.post("event/comments", "Guest/EventCommentController.index");
  Route.get("event/comment", "Guest/EventCommentController.get");
  Route.post("event/comment", "Guest/EventCommentController.create");
  Route.put("event/comment", "Guest/EventCommentController.edit");
  Route.delete("event/comment", "Guest/EventCommentController.destroy");

  // Faqs Route
  Route.get("faqs", "Guest/FaqController.index");

  // Galleries Route
  Route.get("galleries", "Guest/GalleryController.index");

  // Carousels Route
  Route.get("carousels", "Guest/CarouselController.index");

  // Profile Route
  Route.put("profile/password", "ProfileController.changePassword");
})
  .prefix("api/v1/guest")
  .middleware(["api:guest"]);
