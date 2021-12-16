# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/update_celestial_body'

describe 'PATCH /simulations/{id}/asteroid_belts/{asteroid_belt}', type: :request do
  it_behaves_like 'a simulation celestial update test',
                  params: { asteroid_belt: { name: "Belt" } },
                  type: :asteroid_belt,
                  expected_status: :no_content
end
