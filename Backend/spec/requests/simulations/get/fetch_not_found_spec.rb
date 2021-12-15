# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/fetch_simulation'

describe 'GET /simulations/{id} not found', type: :request do
  it_behaves_like 'a simulation fetch test',
                  id: 40000,
                  expected_status: :not_found,
                  expected_response: { error: 'Could not find a simulation with ID 40000.' }
end
