Rails.application.routes.draw do
  root 'static_pages#home'

  get '/main', to: 'game#main'
  get '/loading', to: 'game#loading'
  get '/change_labyrinth', to: 'game#change_labyrinth'

  post "sign_up", to: "users#create"
  get "sign_up", to: "users#new"

  resources :confirmations, only: [:create, :edit, :new], param: :confirmation_token
end
