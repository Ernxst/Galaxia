# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/update_celestial_body'

describe 'PATCH /simulations/{id}/planets/{planet_id}', type: :request do
  it_behaves_like 'a simulation celestial update test',
                  params: { planet: { name: "Planet" } },
                  type: :planet,
                  expected_status: :no_content
end
