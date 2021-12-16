# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/add_celestial_body'

describe 'GET /simulations/{id}/asteroid_belts/{asteroid_belt_id}', type: :request do
  it_behaves_like 'a simulation build test',
                  type: :asteroid_belt,
                  expected_status: :created
end
