# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/create_simulation'

describe 'POST /simulations, short name', type: :request do
  it_behaves_like 'a simulation create test',
                  params: { simulation: { name: "a", description: 'aaa' } },
                  expected_response: { errors: { name: ["The simulation name must be at least 3 characters long."] } },
                  expected_status: :unprocessable_entity
end

