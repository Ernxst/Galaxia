# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/create_simulation'

describe 'POST /simulations, no description', type: :request do
  it_behaves_like 'a simulation create test',
                  params: { simulation: { name: "aaaaa" } },
                  expected_status: :created
end
