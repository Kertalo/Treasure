Rails.application.routes.draw do
  root 'game#main'
  get '/deadend', to: 'quest#deadend'
end
