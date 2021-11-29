# frozen_string_literal: true

require 'rails_helper'
require_relative './../../support/shared_examples/jwt_auth'

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJhYWEiLCJpYXQiOjE1MTYyMzkwMjJ9.M2LEknSOwqomypRt0N5TMlcc26R0muZk-tjjyjCq-Yk'
headers = {
  'Accept': 'application/json',
  'Authorization': "Bearer #{token}"
}
expected_response = { status: :unauthorized, error: 'Could not find the user the JWT token was generated for.' }

describe 'JWT authorisation test, token for unknown user', type: :request do
  it_behaves_like 'a jwt auth test',
                  headers: headers,
                  expected_status: :unauthorized,
                  expected_response: expected_response
end
