# frozen_string_literal: true

require 'rails_helper'
require_relative './../../../../support/helpers/user_helpers'
require_relative './../../../../support/shared_examples/user_register'

params = Helpers::UserHelpers.user_registration_params
params[:user][:username] = ''

error_field = 'username'
error_message = 'Your username cannot be blank.'
expected_response = { "errors": { "#{error_field}": [error_message] } }

describe 'POST /users/register, blank username', type: :request do
  it_behaves_like 'a sign up test',
                  params: params,
                  expected_status: :unprocessable_entity,
                  expected_response: expected_response
end
