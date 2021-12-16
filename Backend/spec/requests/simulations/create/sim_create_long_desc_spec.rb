# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/create_simulation'

describe 'POST /simulations, long description', type: :request do
  it_behaves_like 'a simulation create test',
                  params: { simulation: { name: "aaaaaa", description: Faker::Lorem.paragraphs(number: 10).join("\n") } },
                  expected_response: { errors: { description: ["The description is limited to 512 characters only."] } },
                  expected_status: :unprocessable_entity
end

