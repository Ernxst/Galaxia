# frozen_string_literal: true

require 'rails_helper'
require_relative './../../support/shared_examples/jwt_auth'

describe 'JWT authorisation test, access protected endpoint without Authorization header', type: :request do
  it_behaves_like 'a jwt auth test',
                  headers: { 'Accept': 'application/json' },
                  expected_status: :unauthorized,
                  expected_response: { status: :unauthorized,
                                       error: 'You need to be signed in to access this resource.' }
end
