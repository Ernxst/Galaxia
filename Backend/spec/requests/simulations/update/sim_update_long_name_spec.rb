# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/update_simulation'

describe 'PATCH /simulations/{id}, long name', type: :request do
  it_behaves_like 'a simulation update test',
                  params: { simulation: { name: Faker::Lorem.paragraphs(number: 10).join("\n"), description: 'aaa' } },
                  expected_response: { errors: { name: ["The simulation name cannot be more than 64 characters long."] } },
                  expected_status: :unprocessable_entity
end

