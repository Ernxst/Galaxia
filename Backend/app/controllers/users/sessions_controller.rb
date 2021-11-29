# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]
  skip_before_action :authenticate_user!, only: [:create]
  skip_before_action :authenticate_user, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /users/login
  def create
    params.require(:user).permit(:username, :password).require(%i[username password])
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    yield resource if block_given?
    render json: { user_id: resource.id, token: current_token }, status: :created
  end

  # Return the most recently generated JWT token.
  # @return [String] a JWT token.
  def current_token
    request.env['warden-jwt_auth.token']
  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
