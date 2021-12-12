# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/celestial/fetch_celestial_body'

describe 'GET /celestial/planets/{id}', type: :request do
  it_behaves_like 'a celestial body fetch test',
                  id: 1,
                  type: 'planets',
                  expected_status: :ok
end
