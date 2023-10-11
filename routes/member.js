const Base = Route => {
  Route.group(function () {
    // Program
    Route.post('programs', 'Member/ProgramController.index')

    // Arrangement
    Route.post('arrangements', 'Member/ArrangementController.index')

    // Arrangement item route
    Route.post('arrangement/items', 'Member/ArrangementItemController.index')
    Route.get('arrangement/item', 'Member/ArrangementItemController.get')
    Route.post('arrangement/item', 'Member/ArrangementItemController.create')
    Route.put('arrangement/item', 'Member/ArrangementItemController.edit')
    Route.put('arrangement/item/dump', 'Member/ArrangementItemController.dump')
    Route.put(
      'arrangement/item/restore',
      'Member/ArrangementItemController.restore',
    )
    Route.delete('arrangement/item', 'Member/ArrangementItemController.destroy')

    // Event routes
    Route.post('events', 'Member/EventController.index')
    Route.get('event', 'Member/EventController.get')
    Route.post('event', 'Member/EventController.create')
    Route.put('event', 'Member/EventController.edit')
    Route.put('event/dump', 'Member/EventController.dump')
    Route.put('event/restore', 'Member/EventController.restore')
    Route.delete('event', 'Member/EventController.destroy')

    // Event file
    Route.post('event/file', 'Member/EventFileController.index')
    Route.get('event/file', 'Member/EventFileController.get')
    Route.post('event/file/add', 'Member/EventFileController.create')
    Route.put('event/file', 'Member/EventFileController.edit')
    Route.delete('event/file', 'Member/EventFileController.destroy')

    // Event comment route
    Route.post('event/comments', 'Member/EventCommentController.index')
    Route.get('event/comment', 'Member/EventCommentController.get')
    Route.post('event/comment', 'Member/EventCommentController.create')
    Route.put('event/comment', 'Member/EventCommentController.edit')
    Route.delete('event/comment', 'Member/EventCommentController.destroy')

    // News route
    Route.post('news', 'Member/NewsController.index')
    Route.get('news', 'Member/NewsController.get')
    Route.post('news/add', 'Member/NewsController.create')
    Route.put('news', 'Member/NewsController.edit')
    Route.put('news/dump', 'Member/NewsController.dump')
    Route.put('news/restore', 'Member/NewsController.restore')
    Route.delete('news', 'Member/NewsController.destroy')

    // News comment route
    Route.post('news/comments', 'Member/NewsCommentController.index')
    Route.get('news/comment', 'Member/NewsCommentController.get')
    Route.post('news/comment', 'Member/NewsCommentController.create')
    Route.put('news/comment', 'Member/NewsCommentController.edit')
    Route.delete('news/comment', 'Member/NewsCommentController.destroy')
  })
    .prefix('api/v1/member')
    .middleware(['auth', 'api:member'])
}

module.exports = Base
