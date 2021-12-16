# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/delete_simulation'

describe 'DELETE /simulations/{id}, should not delete a preset simulation', type: :request do
  it_behaves_like 'a simulation delete test',
                  preset: true,
                  owned: false,
                  expected_status: :unauthorized,
                  expected_response: { error: 'You cannot modify a preset simulation.' }
end

