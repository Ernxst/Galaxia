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

      scope :media do
        [:textures, :bump_maps, :specular_maps, :atmosphere_textures].each do |type|
          scope type do
            get '/', to: "media/#{type.to_s}#all"
            get '/:id', to: "media/#{type.to_s}#get"
            scope :all do
              get '/planets', to: "media/#{type.to_s}#planets"
              get '/stars', to: "media/#{type.to_s}#stars"
              get '/moons', to: "media/#{type.to_s}#moons"
            end
          end
        end
      end

      scope :celestial do
        [:planets, :stars, :moons, :asteroid_belts].each do |type|
          scope type do
            get '/', to: "celestial/#{type.to_s}#all"
            get '/:id', to: "celestial/#{type.to_s}#get"
            post '/', to: "celestial/#{type.to_s}#new"
          end
        end
      end

      scope :simulations do
        post '/', to: 'simulations/simulations#new'

        get '/:id', to: 'simulations/simulations_fetch#get'
        patch '/:id', to: 'simulations/simulations#update'
        delete '/:id', to: 'simulations/simulations#delete'

        get '/by/:id', to: 'simulations/simulations_fetch#get_users_sims'
        get '/all/preset', to: 'simulations/simulations_fetch#get_preset'
        get '/all/user', to: 'simulations/simulations_fetch#get_user_created'
      end

    end
  end
end
