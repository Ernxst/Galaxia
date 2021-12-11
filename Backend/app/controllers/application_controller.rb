# frozen_string_literal: true

# Super class for all controllers.
class ApplicationController < ActionController::API
  prepend_before_action :underscore_params!
  # Before any endpoint, authenticate the user, throwing an error if it fails.
  prepend_before_action :authenticate_user
  before_action :authenticate_user!

  skip_before_action :authenticate_user!, only: %i[ping guest_username]
  skip_before_action :authenticate_user, only: %i[ping guest_username]

  include ActionController::MimeResponds
  # Prevent CSRF attacks by rejecting their session cookie.
  include ActionController::RequestForgeryProtection
  protect_from_forgery with: :null_session, prepend: true
  skip_before_action :verify_authenticity_token

  # Only allow JSON requests.
  respond_to :json

  # A ParameterMissing exception is thrown when the
  # request body does not have the required parameters.
  # When this occurs, run the handle_parameter_missing method.
  rescue_from ActionController::ParameterMissing, with: :handle_parameter_missing

  def underscore_params!
    params.deep_transform_keys!(&:underscore)
  end

  # Initialiser
  def initialize
    super
    @current_user = nil
  end

  # Return a JSON response to the client if a parameter is missing.
  # Overrides Devise's default error message.
  # @param [Exception] exception the exception that was thrown
  # @return [JSON] the error message of the exception inserted into a JSON response
  def handle_parameter_missing(exception)
    param = exception.param
    render json: { status: :bad_request,
                   errors: { "#{param}": ["The required parameter '#{param}' is either blank or missing."] } },
           status: :bad_request
  end

  # Verify that the user is authenticated and signed in.
  # @return [JSON] a response to client indicating they need to sign in if they are not signed in.
  def authenticate_user!
    return if signed_in?

    render json: {
      status: :unauthorized,
      error: 'You need to be signed in to access this resource.'
    }, status: :unauthorized
  end

  # Authenticate a user using the JWT mechanism.
  # @return [void, JSON] a response if JWT authentication failed.
  def authenticate_user
    auth_header = request.headers['Authorization']
    return unless auth_header.present? && auth_header.starts_with?('Bearer ')

    begin
      @current_user = User.find(id_in_header(auth_header))
    rescue JWT::ExpiredSignature, JWT::DecodeError, JWT::VerificationError
      head :unauthorized
    rescue ActiveRecord::RecordNotFound
      render json: { status: :unauthorized, error: 'Could not find the user the JWT token was generated for.' },
             status: :unauthorized
    end
  end

  # Return the ID of the user the token was generated for from the auth header.
  # @param [String] auth_header the Bearer JWT token header
  # @return [String] the ID of the user the token was generated for.
  def id_in_header(auth_header)
    token = auth_header.split(' ')[1]
    decoded_token = JWT.decode(token, ENV['DEVISE_JWT_SECRET_KEY']).first
    decoded_token['sub']
  end

  # Return the current user object, whether it is null or an user object.
  # @return [user, nil] the current user object.
  def current_user
    @current_user ||= super
  end

  # An user is signed in if the current user is set to some user object.
  # @return [Boolean] a boolean, representing whether or not the user has been set and, hence, is signed in.
  def signed_in?
    @current_user.present?
  end

  # GET /users/guest_username
  def guest_username
    render json: { username: ENV['GUEST_USERNAME'] }, status: :ok
  end

  def ping
    head :ok
  end
end
