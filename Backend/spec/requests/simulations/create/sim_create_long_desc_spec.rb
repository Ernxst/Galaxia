# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/create_simulation'

describe 'POST /simulations, long description', type: :request do
  it_behaves_like 'a simulation create test',
                  params: { simulation: { name: "aaaaaa", description: Faker::Lorem.characters(number: 5000) } },
                  expected_response: { errors: { description: ["The description is limited to 4096 characters only."] } },
                  expected_status: :unprocessable_entity
end

