const Base = Route => {
  Route.group(function () {
    // User route
    Route.post('users', 'Admin/UserController.index')
    Route.get('users', 'Admin/UserController.indexAll')
    Route.get('user', 'Admin/UserController.get')
    Route.post('user', 'Admin/UserController.create')
    Route.put('user', 'Admin/UserController.edit')
    Route.put('user/dump', 'Admin/UserController.dump')
    Route.put('user/restore', 'Admin/UserController.restore')
    Route.delete('user', 'Admin/UserController.destroy')

    // Rule routes
    Route.post('rules', 'Admin/RuleController.index')
    Route.get('rules', 'Admin/RuleController.indexAll')
    Route.get('rule', 'Admin/RuleController.get')
    Route.post('rule', 'Admin/RuleController.create')
    Route.put('rule', 'Admin/RuleController.edit')
    Route.delete('rule', 'Admin/RuleController.destroy')

    // Rule item routes
    Route.post('rule/permissions', 'Admin/PermissionController.index')
    Route.get('rule/permissions', 'Admin/PermissionController.indexAll')
    Route.post('rule/permission', 'Admin/PermissionController.create')
    Route.put('rule/permission', 'Admin/PermissionController.edit')
    Route.delete('rule/permission', 'Admin/PermissionController.destroy')

    // FAQ route
    Route.post('faqs', 'Admin/FaqController.index')
    Route.get('faq', 'Admin/FaqController.get')
    Route.post('faq', 'Admin/FaqController.create')
    Route.put('faq', 'Admin/FaqController.edit')
    Route.delete('faq', 'Admin/FaqController.destroy')

    // News route
    Route.post('news', 'Admin/NewsController.index')
    Route.get('news', 'Admin/NewsController.get')
    Route.post('news/add', 'Admin/NewsController.create')
    Route.put('news', 'Admin/NewsController.edit')
    Route.put('news/dump', 'Admin/NewsController.dump')
    Route.put('news/restore', 'Admin/NewsController.restore')
    Route.delete('news', 'Admin/NewsController.destroy')

    // News comment route
    Route.post('news/comments', 'Admin/NewsCommentController.index')
    Route.get('news/comment', 'Admin/NewsCommentController.get')
    Route.post('news/comment', 'Admin/NewsCommentController.create')
    Route.put('news/comment', 'Admin/NewsCommentController.edit')
    Route.delete('news/comment', 'Admin/NewsCommentController.destroy')

    // Event routes
    Route.post('events', 'Admin/EventController.index')
    Route.get('event', 'Admin/EventController.get')
    Route.post('event', 'Admin/EventController.create')
    Route.put('event', 'Admin/EventController.edit')
    Route.put('event/dump', 'Admin/EventController.dump')
    Route.put('event/restore', 'Admin/EventController.restore')
    Route.delete('event', 'Admin/EventController.destroy')

    // Event file
    Route.post('event/file', 'Admin/EventFileController.index')
    Route.get('event/file', 'Admin/EventFileController.get')
    Route.post('event/file/add', 'Admin/EventFileController.create')
    Route.put('event/file', 'Admin/EventFileController.edit')
    Route.delete('event/file', 'Admin/EventFileController.destroy')

    // Event comment route
    Route.post('event/comments', 'Admin/EventCommentController.index')
    Route.get('event/comment', 'Admin/EventCommentController.get')
    Route.post('event/comment', 'Admin/EventCommentController.create')
    Route.put('event/comment', 'Admin/EventCommentController.edit')
    Route.delete('event/comment', 'Admin/EventCommentController.destroy')

    // Program route
    Route.post('programs', 'Admin/ProgramController.index')
    Route.get('programs', 'Admin/ProgramController.indexAll')
    Route.get('program', 'Admin/ProgramController.get')
    Route.post('program', 'Admin/ProgramController.create')
    Route.put('program', 'Admin/ProgramController.edit')
    // Route.put("program/dump", "Admin/ProgramController.dump");
    // Route.put("program/restore", "Admin/ProgramController.restore");
    Route.delete('program', 'Admin/ProgramController.destroy')

    // Arrangement route
    Route.post('arrangements', 'Admin/ArrangementController.index')
    Route.get('arrangements', 'Admin/ArrangementController.indexAll')
    Route.get('arrangement', 'Admin/ArrangementController.get')
    Route.post('arrangement', 'Admin/ArrangementController.create')
    Route.put('arrangement', 'Admin/ArrangementController.edit')
    // Route.put("arrangement/dump", "Admin/ArrangementController.dump");
    // Route.put("arrangement/restore", "Admin/ArrangementController.restore");
    Route.delete('arrangement', 'Admin/ArrangementController.destroy')

    // Arrangement item route
    Route.post('arrangement/items', 'Admin/ArrangementItemController.index')
    Route.get('arrangement/item', 'Admin/ArrangementItemController.get')
    Route.post('arrangement/item', 'Admin/ArrangementItemController.create')
    Route.put('arrangement/item', 'Admin/ArrangementItemController.edit')
    Route.put('arrangement/item/dump', 'Admin/ArrangementItemController.dump')
    Route.put(
      'arrangement/item/restore',
      'Admin/ArrangementItemController.restore',
    )
    Route.delete('arrangement/item', 'Admin/ArrangementItemController.destroy')

    // Gallery route
    Route.post('galleries', 'Admin/GalleryController.index')
    Route.post('gallery', 'Admin/GalleryController.create')
    Route.put('gallery', 'Admin/GalleryController.edit')
    Route.delete('gallery', 'Admin/GalleryController.destroy')

    // Carousel route
    Route.post('carousels', 'Admin/CarouselController.index')
    Route.get('carousel', 'Admin/CarouselController.get')
    Route.post('carousel', 'Admin/CarouselController.create')
    Route.put('carousel', 'Admin/CarouselController.edit')
    Route.delete('carousel', 'Admin/CarouselController.destroy')
  })
    .prefix('api/v1/admin')
    .middleware(['auth', 'api:admin'])
}

module.exports = Base
