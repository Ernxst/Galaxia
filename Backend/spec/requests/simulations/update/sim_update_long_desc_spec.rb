# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/update_simulation'

describe 'PATCH /simulations/{id}, long description', type: :request do
  it_behaves_like 'a simulation update test',
                  params: { simulation: { name: "aaaaaa", description: Faker::Lorem.characters(number: 5000) } },
                  expected_response: { errors: { description: ["The description is limited to 4096 characters only."] } },
                  expected_status: :unprocessable_entity
end

