# frozen_string_literal: true

require 'rails_helper'
require_relative './../../../support/shared_examples/user_login'

params = {
  user: { username: 'ernest',
          password: '' }
}

error_field = 'password'
error_message = "The required parameter '#{error_field}' is either blank or missing."
expected_response = { "status": :bad_request, "errors": { "#{error_field}": [error_message] } }

describe 'POST /users/login, valid username but blank password', type: :request do
  it_behaves_like 'an user login test',
                  params: params,
                  expected_status: :bad_request,
                  expected_response: expected_response
end
