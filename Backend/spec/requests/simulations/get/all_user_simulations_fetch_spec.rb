# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/fetch_simulations'

describe 'GET /simulations/all/user', type: :request do
  it_behaves_like 'a group of simulations fetch test',
                  endpoint: 'all',
                  type: 'user',
                  expected_status: :ok
end
