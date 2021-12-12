# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/celestial/fetch_celestial_body'

describe 'GET /celestial/planets/{id} not found', type: :request do
  it_behaves_like 'a celestial body fetch test',
                  id: 40000,
                  type: 'planets',
                  expected_status: :not_found,
                  expected_response: { error: 'Could not find a planet with ID 40000.' }
end
