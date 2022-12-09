Rails.application.routes.draw do
  root 'game#menu', as: 'home'

  get '/loading', to: 'game#loading'
  get '/change_labyrinth', to: 'game#change_labyrinth'
end
