# frozen_string_literal: true

require 'rails_helper'
require_relative './../../support/shared_examples/jwt_auth'

describe 'JWT authorisation test, invalid Authorization header', type: :request do
  it_behaves_like 'a jwt auth test',
                  headers: { 'Accept': 'application/json', 'Authorization': 'aaaa' },
                  expected_status: :unauthorized,
                  expected_response: { status: :unauthorized,
                                       error: 'You need to be signed in to access this resource.' }
end
