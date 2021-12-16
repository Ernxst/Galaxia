# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/delete_celestial_body'

describe 'DELETE /simulations/{id}/stars/{star_id}', type: :request do
  it_behaves_like 'a simulation celestial delete test',
                  type: :star,
                  expected_status: :no_content
end
