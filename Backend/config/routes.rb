# frozen_string_literal: true

# For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  get '/health', to: 'application#ping'

  scope :api, defaults: { format: :json }, constraints: { format: :json } do
    scope :v1 do
      devise_for :users,
                 path: 'users',
                 path_names: {
                   sign_in: 'login',
                   sign_out: 'logout',
                   registration: 'register'
                 },
                 controllers: {
                   registrations: 'users/registrations',
                   sessions: 'users/sessions'
                 }

      get '/users/guest_username', to: 'application#guest_username'
    end
  end
end
