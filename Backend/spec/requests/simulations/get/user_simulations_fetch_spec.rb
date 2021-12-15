# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/fetch_simulations'

describe 'GET /simulations/by/{id}', type: :request do
  it_behaves_like 'a group of simulations fetch test',
                  type: 1,
                  endpoint: 'by',
                  expected_status: :ok
end
