Rails.application.routes.draw do
  root 'static_pages#home'

  get '/menu', to: 'game#menu'
  get '/loading', to: 'game#loading'
  get '/cancel', to: 'game#cancel'
  get '/change_labyrinth', to: 'game#change_labyrinth'
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
  get '/save_labyrinth', to: 'game#save_labyrinth'
end
