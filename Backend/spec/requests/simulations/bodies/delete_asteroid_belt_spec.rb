# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/delete_celestial_body'

describe 'DELETE /simulations/{id}/asteroid_belts/{asteroid_belt_id}', type: :request do
  it_behaves_like 'a simulation celestial delete test',
                  type: :asteroid_belt,
                  expected_status: :no_content
end
