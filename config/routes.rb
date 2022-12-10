Rails.application.routes.draw do
  root 'game#menu', as: 'home'

  get '/loading', to: 'game#loading'
  get '/edit_labyrinth', to: 'game#edit_labyrinth'
  get '/save_labyrinth', to: 'game#save_labyrinth'
end
