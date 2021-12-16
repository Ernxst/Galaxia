# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/delete_simulation'

describe 'DELETE /simulations/{id}, should not delete an unowned simulation', type: :request do
  it_behaves_like 'a simulation delete test',
                  preset: false,
                  owned: false,
                  expected_status: :unauthorized,
                  expected_response: { error: 'You cannot modify this simulation as you are not the owner.' }
end


