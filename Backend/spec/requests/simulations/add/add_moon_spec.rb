# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/add_celestial_body'

describe 'GET /simulations/{id}/planets/{planet_id}/moons/{moon_id}', type: :request do
  it_behaves_like 'a simulation build test',
                  type: :moon,
                  expected_status: :created
end
