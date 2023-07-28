const Base = (Route) => {
  Route.group(() => {
    Route.post('login', 'AuthController.login')
    Route.post('register', 'AuthController.register')
    Route.get('me', 'AuthController.checkUser').middleware(['auth', 'api'])
    Route.post('refresh-token', 'AuthController.refreshToken').middleware([
      'auth',
      'api',
    ])
    Route.post('logout', 'AuthController.logout').middleware(['auth', 'api'])

    Route.get('file/:mime/:filename', 'FileController.index')

    Route.post('news', 'Guest/NewsController.index')
    Route.post('events', 'Guest/EventController.indexPublic')
    Route.post('faqs', 'Guest/FaqController.index')
    Route.get('galleries', 'Guest/GalleryController.index')
    Route.get('carousels', 'Guest/CarouselController.index')
  }).prefix('api/v1')
}

module.exports = Base
