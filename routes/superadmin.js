const Base = (Route) => {
  Route.group(function () {
    // User route
    Route.post('users', 'Superadmin/UserController.index')
    Route.get('users', 'Superadmin/UserController.indexAll')
    Route.get('user', 'Superadmin/UserController.get')
    Route.post('user', 'Superadmin/UserController.create')
    Route.put('user', 'Superadmin/UserController.edit')
    Route.put('user/password', 'Superadmin/UserController.editPassword')
    Route.put('user/dump', 'Superadmin/UserController.dump')
    Route.put('user/restore', 'Superadmin/UserController.restore')
    Route.delete('user', 'Superadmin/UserController.destroy')

    // Rule routes
    Route.post('rules', 'Superadmin/RuleController.index')
    Route.get('rules', 'Superadmin/RuleController.indexAll')
    Route.get('rule', 'Superadmin/RuleController.get')
    Route.post('rule', 'Superadmin/RuleController.create')
    Route.put('rule', 'Superadmin/RuleController.edit')
    Route.delete('rule', 'Superadmin/RuleController.destroy')

    // Rule item routes
    Route.post('rule/permissions', 'Superadmin/PermissionController.index')
    Route.get('rule/permissions', 'Superadmin/PermissionController.indexAll')
    Route.post('rule/permission', 'Superadmin/PermissionController.create')
    Route.put('rule/permission', 'Superadmin/PermissionController.edit')
    Route.delete('rule/permission', 'Superadmin/PermissionController.destroy')

    // FAQ route
    Route.post('faqs', 'Superadmin/FaqController.index')
    Route.get('faqs', 'Superadmin/FaqController.indexAll')
    Route.get('faq', 'Superadmin/FaqController.get')
    Route.post('faq', 'Superadmin/FaqController.create')
    Route.put('faq', 'Superadmin/FaqController.edit')
    Route.delete('faq', 'Superadmin/FaqController.destroy')

    // FAQ topic route
    Route.post('faq/topics', 'Superadmin/FaqTopicController.index')
    Route.get('faq/topic', 'Superadmin/FaqTopicController.get')
    Route.post('faq/topic', 'Superadmin/FaqTopicController.create')
    Route.put('faq/topic', 'Superadmin/FaqTopicController.edit')
    Route.delete('faq/topic', 'Superadmin/FaqTopicController.destroy')

    // News route
    Route.post('news', 'Superadmin/NewsController.index')
    Route.get('news', 'Superadmin/NewsController.get')
    Route.post('news/add', 'Superadmin/NewsController.create')
    Route.put('news', 'Superadmin/NewsController.edit')
    Route.put('news/dump', 'Superadmin/NewsController.dump')
    Route.put('news/restore', 'Superadmin/NewsController.restore')
    Route.delete('news', 'Superadmin/NewsController.destroy')

    // News comment route
    Route.post('news/comments', 'Superadmin/NewsCommentController.index')
    Route.get('news/comment', 'Superadmin/NewsCommentController.get')
    Route.post('news/comment', 'Superadmin/NewsCommentController.create')
    Route.put('news/comment', 'Superadmin/NewsCommentController.edit')
    Route.delete('news/comment', 'Superadmin/NewsCommentController.destroy')

    // Event routes
    Route.post('events', 'Superadmin/EventController.index')
    Route.get('event', 'Superadmin/EventController.get')
    Route.post('event', 'Superadmin/EventController.create')
    Route.put('event', 'Superadmin/EventController.edit')
    Route.put('event/dump', 'Superadmin/EventController.dump')
    Route.put('event/restore', 'Superadmin/EventController.restore')
    Route.delete('event', 'Superadmin/EventController.destroy')

    // Event file
    Route.post('event/file', 'Superadmin/EventFileController.index')
    Route.post('event/file/add', 'Superadmin/EventFileController.create')
    Route.delete('event/file', 'Superadmin/EventFileController.destroy')

    // Event comment route
    Route.post('event/comments', 'Superadmin/EventCommentController.index')
    Route.get('event/comment', 'Superadmin/EventCommentController.get')
    Route.post('event/comment', 'Superadmin/EventCommentController.create')
    Route.put('event/comment', 'Superadmin/EventCommentController.edit')
    Route.delete('event/comment', 'Superadmin/EventCommentController.destroy')

    // Program route
    Route.post('programs', 'Superadmin/ProgramController.index')
    Route.get('programs', 'Superadmin/ProgramController.indexAll')
    Route.get('program', 'Superadmin/ProgramController.get')
    Route.post('program', 'Superadmin/ProgramController.create')
    Route.put('program', 'Superadmin/ProgramController.edit')
    // Route.put("program/dump", "Superadmin/ProgramController.dump");
    // Route.put("program/restore", "Superadmin/ProgramController.restore");
    Route.delete('program', 'Superadmin/ProgramController.destroy')

    // Arrangement route
    Route.post('arrangements', 'Superadmin/ArrangementController.index')
    Route.get('arrangements', 'Superadmin/ArrangementController.indexAll')
    Route.get('arrangement', 'Superadmin/ArrangementController.get')
    Route.post('arrangement', 'Superadmin/ArrangementController.create')
    Route.put('arrangement', 'Superadmin/ArrangementController.edit')
    // Route.put("arrangement/dump", "Superadmin/ArrangementController.dump");
    // Route.put("arrangement/restore", "Superadmin/ArrangementController.restore");
    Route.delete('arrangement', 'Superadmin/ArrangementController.destroy')

    // Arrangement item route
    Route.post(
      'arrangement/items',
      'Superadmin/ArrangementItemController.index'
    )
    Route.get('arrangement/item', 'Superadmin/ArrangementItemController.get')
    Route.post(
      'arrangement/item',
      'Superadmin/ArrangementItemController.create'
    )
    Route.put('arrangement/item', 'Superadmin/ArrangementItemController.edit')
    Route.put(
      'arrangement/item/dump',
      'Superadmin/ArrangementItemController.dump'
    )
    Route.put(
      'arrangement/item/restore',
      'Superadmin/ArrangementItemController.restore'
    )
    Route.delete(
      'arrangement/item',
      'Superadmin/ArrangementItemController.destroy'
    )

    // Gallery route
    Route.post('galleries', 'Superadmin/GalleryController.index')
    Route.post('gallery', 'Superadmin/GalleryController.create')
    Route.put('gallery', 'Superadmin/GalleryController.edit')
    Route.delete('gallery', 'Superadmin/GalleryController.destroy')

    // Carousel route
    Route.post('carousels', 'Superadmin/CarouselController.index')
    Route.get('carousel', 'Superadmin/CarouselController.get')
    Route.post('carousel', 'Superadmin/CarouselController.create')
    Route.put('carousel', 'Superadmin/CarouselController.edit')
    Route.delete('carousel', 'Superadmin/CarouselController.destroy')
  })
    .prefix('api/v1/superadmin')
    .middleware(['auth', 'api:superadmin'])
}

module.exports = Base
