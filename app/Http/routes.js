'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.on('/').render('welcome')

Route.post('/equations', 'EquationController.store')
Route.get('/equations', 'EquationController.list')
Route.get('/search', 'EquationController.show')
Route.delete('/equation/:eqId', 'EquationController.destroy')
Route.post('/equation/:eqId/upload', 'EquationController.uploadFile')
Route.get('/equation/download', 'EquationController.downloadFile')

Route.post('/app/equations', 'EquationAppController.store')
Route.get('/app/equations', 'EquationAppController.list')
Route.get('/app/search', 'EquationAppController.show')
Route.delete('/app/equation/:eqId', 'EquationAppController.destroy')
Route.post('/app/equation/upload', 'EquationAppController.uploadFile')
Route.get('/app/equation/download', 'EquationAppController.downloadFile')
Route.get('/app/equations/related', 'EquationAppController.related')

Route.post('/app/tokens', 'TokenController.store')

Route.get('/app/tags', 'EquationAppController.listTags')

Route.get('/app/requests', 'EquationAppController.listRequests')

Route.post('/app/request/activate', 'EquationAppController.activate')
