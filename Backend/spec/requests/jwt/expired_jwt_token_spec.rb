# frozen_string_literal: true

require 'rails_helper'
require_relative './../../support/shared_examples/jwt_auth'
require_relative './../../support/helpers/user_helpers'

exp_time = Time.now - 1.hour
payload = { data: Helpers::UserHelpers.user.to_json, exp: exp_time.to_i }
token = JWT.encode(payload, ENV['DEVISE_JWT_SECRET_KEY'], 'HS256')
headers = { 'Accept': 'application/json', 'Authorization': "Bearer #{token}" }

describe 'JWT authorisation test, expired JWT token', type: :request do
  it_behaves_like 'a jwt auth test',
                  headers: headers,
                  expected_status: :unauthorized,
                  expected_response: {},
                  blank: true
end
