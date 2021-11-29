# frozen_string_literal: true

require 'rails_helper'
require_relative './../../../support/shared_examples/user_login'

params = {
  user: { username: 'aaa',
          password: 'P@55word' }
}

expected_response = { "error": 'Login failed, either your username or password was incorrect. Please try again.' }

describe 'POST /users/login, wrong username', type: :request do
  it_behaves_like 'an user login test',
                  params: params,
                  expected_status: :unauthorized,
                  expected_response: expected_response
end
