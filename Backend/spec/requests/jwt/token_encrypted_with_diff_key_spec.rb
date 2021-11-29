# frozen_string_literal: true

require 'rails_helper'
require_relative './../../support/shared_examples/jwt_auth'
require_relative './../../support/helpers/user_helpers'

token = JWT.encode(Helpers::UserHelpers.user, 'some_key', 'HS256')

describe 'JWT authorisation test, JWT token encrypted using different key', type: :request do
  it_behaves_like 'a jwt auth test',
                  headers: { 'Accept': 'application/json', 'Authorization': "Bearer #{token}" },
                  expected_status: :unauthorized,
                  expected_response: {},
                  blank: true
end
