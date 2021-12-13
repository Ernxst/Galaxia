# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/celestial/fetch_celestial_body'

describe 'GET /celestial/asteroid_belts/{id}', type: :request do
  it_behaves_like 'a celestial body fetch test',
                  id: 1,
                  type: 'asteroid_belts',
                  expected_status: :ok
end
