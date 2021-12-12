# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/celestial/fetch_celestial_bodies'

describe 'GET /celestial/planets/', type: :request do
  it_behaves_like 'a group of celestial bodies fetch test',
                  type: 'planets',
                  expected_status: :ok
end
