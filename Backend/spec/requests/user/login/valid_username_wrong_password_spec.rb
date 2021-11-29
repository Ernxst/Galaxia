# frozen_string_literal: true

require 'rails_helper'
require_relative './../../../support/shared_examples/user_login'

params = {
  user: { username: 'ernest',
          password: 'incorrect password' }
}

expected_response = { "error": 'Login failed, either your username or password was incorrect. Please try again.' }

describe 'POST /users/login, valid username but wrong password', type: :request do
  it_behaves_like 'an user login test',
                  params: params,
                  expected_status: :unauthorized,
                  expected_response: expected_response
end
