# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/create_simulation'

describe 'POST /simulations, valid', type: :request do
  it_behaves_like 'a simulation create test',
                  params: { simulation: { name: "My Sim", description: 'aaa' } },
                  expected_status: :created
end

