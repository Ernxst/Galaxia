# frozen_string_literal: true

require 'rails_helper'
require_relative './../../../../support/helpers/user_helpers'
require_relative './../../../../support/shared_examples/user_register'

taken_username = 'ernest'
params = Helpers::UserHelpers.user_registration_params(taken_username)
params[:user][:username] = taken_username

error_field = 'username'
error_message = "The username '#{taken_username}' is already associated with another account. Did you mean to sign in?"
expected_response = { "errors": { "#{error_field}": [error_message] } }

describe 'POST /users/register, taken username', type: :request do
  before do
    post '/api/v1/users/register', params: params
  end
  it_behaves_like 'a sign up test',
                  params: params,
                  expected_status: :unprocessable_entity,
                  expected_response: expected_response,
                  taken: true
end
