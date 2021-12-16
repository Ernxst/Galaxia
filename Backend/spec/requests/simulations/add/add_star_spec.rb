# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/add_celestial_body'

describe 'POST /simulations/{id}/stars/{star_id}', type: :request do
  it_behaves_like 'a simulation build test',
                  type: :star,
                  expected_status: :created
end
