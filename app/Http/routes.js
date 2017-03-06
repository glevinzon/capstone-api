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
