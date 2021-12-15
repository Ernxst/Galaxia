# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/fetch_simulation'

describe 'GET simulations/{id}', type: :request do
  it_behaves_like 'a simulation fetch test',
                  id: 1,
                  expected_status: :ok
end
