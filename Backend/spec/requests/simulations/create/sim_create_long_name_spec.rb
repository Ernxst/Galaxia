# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/create_simulation'

describe 'POST /simulations, long name', type: :request do
  it_behaves_like 'a simulation create test',
                  params: { simulation: { name: Faker::Lorem.paragraphs(number: 10).join("\n"), description: 'aaa' } },
                  expected_response: { errors: { name: ["The simulation name cannot be more than 64 characters long."] } },
                  expected_status: :unprocessable_entity
end

