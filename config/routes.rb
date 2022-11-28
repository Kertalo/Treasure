Rails.application.routes.draw do
  root 'game#main'

  get '/loading', to: 'game#loading'
  get '/change_labyrinth', to: 'game#change_labyrinth'
end
