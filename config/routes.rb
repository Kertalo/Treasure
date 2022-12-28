Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  root 'static_pages#home'

  get '/home', to: 'static_pages#home'
  get '/create_lobby', to: 'game#create_lobby'
  post '/join_lobby', to: 'game#join_lobby'
  get '/join', to: 'game#join_page'
  get '/cancel', to: 'game#cancel'
  get '/main', to: 'game#main'

  post "sign_up", to: "users#create"
  get "sign_up", to: "users#new"

  resources :confirmations, only: [:create, :edit, :new], param: :confirmation_token

  post "login", to: "sessions#create"
  delete "logout", to: "sessions#destroy"
  get "login", to: "sessions#new"

  resources :passwords, only: [:create, :edit, :new, :update], param: :password_reset_token

  get "password_rest", to: "passwords#new"

  put "account", to: "users#update"
  get "account", to: "users#edit"
  delete "account", to: "users#destroy"

  resources :active_sessions, only: [:destroy] do
    collection do
      delete "destroy_all"
    end
  end

  get '/edit_labyrinth', to: 'game#edit_labyrinth'
  post '/save_labyrinth', to: 'game#save_labyrinth'
  get '/reset_labyrinth', to: 'game#reset_labyrinth'

  # Routes for Google authentication
  get 'auth/:provider/callback', to: 'sessions#omniauth'

  get '/set_other_labyrinth', to: 'game#set_other_labyrinth'

  get '/move_up', to: 'game#move_up'
  get '/move_right', to: 'game#move_right'
  get '/move_down', to: 'game#move_down'
  get '/move_left', to: 'game#move_left'

  get '/update_labyrinth', to: 'game#update_labyrinth'
end
