# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/update_celestial_body'

describe 'PATCH /simulations/{id}/stars/{star_id}', type: :request do
  it_behaves_like 'a simulation celestial update test',
                  params: { star: { name: "Star" } },
                  type: :star,
                  expected_status: :no_content
end
