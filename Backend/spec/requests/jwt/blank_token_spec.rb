# frozen_string_literal: true

require 'rails_helper'
require_relative './../../support/shared_examples/jwt_auth'

headers = {
  'Accept': 'application/json',
  'Authorization': ''
}
expected_response = { status: :unauthorized, error: 'You need to be signed in to access this resource.' }

describe 'JWT authorisation test, blank Authorization token', type: :request do
  it_behaves_like 'a jwt auth test',
                  headers: headers,
                  expected_status: :unauthorized,
                  expected_response: expected_response
end
