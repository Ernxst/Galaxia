# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/delete_celestial_body'

describe 'DELETE /simulations/{id}/planets/{planet_id}/moons/{moon_id}', type: :request do
  it_behaves_like 'a simulation celestial delete test',
                  type: :moon,
                  expected_status: :no_content
end
