const Base = Route => {
  Route.group(function () {
    // Program
    Route.post('programs', 'Guest/ProgramController.index')

    // Arrangement
    Route.post('arrangements', 'Guest/ArrangementController.index')
    Route.post(
      'arrangement/generals',
      'Guest/ArrangementController.indexGeneral',
    )

    // Arrangement item route
    Route.post('arrangement/items', 'Guest/ArrangementItemController.index')

    // News route
    Route.get('news', 'Guest/NewsController.get')

    // News comment route
    Route.post('news/comments', 'Guest/NewsCommentController.index')
    Route.get('news/comment', 'Guest/NewsCommentController.get')
    Route.post('news/comment', 'Guest/NewsCommentController.create')
    Route.put('news/comment', 'Guest/NewsCommentController.edit')
    Route.delete('news/comment', 'Guest/NewsCommentController.destroy')

    // Event routes
    Route.post('events', 'Guest/EventController.index')
    Route.get('event', 'Guest/EventController.get')

    // Event comment route
    Route.post('event/comments', 'Guest/EventCommentController.index')
    Route.get('event/comment', 'Guest/EventCommentController.get')
    Route.post('event/comment', 'Guest/EventCommentController.create')
    Route.put('event/comment', 'Guest/EventCommentController.edit')
    Route.delete('event/comment', 'Guest/EventCommentController.destroy')

    // Profile Route
    Route.put('profile/password', 'ProfileController.changePassword')
  })
    .prefix('api/v1/guest')
    .middleware(['auth', 'api:guest'])
}

module.exports = Base
