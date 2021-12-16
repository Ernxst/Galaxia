# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/create_simulation'

describe 'POST /simulations, no name', type: :request do
  it_behaves_like 'a simulation create test',
                  params: { simulation: { description: 'aaa' } },
                  expected_response: { status: "bad_request",
                                       errors: { name:
                                                   ["The required parameter 'name' is either blank or missing."] } },
                  expected_status: :bad_request
end

