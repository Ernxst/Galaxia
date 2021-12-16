# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/update_simulation'

describe 'PATCH /simulations/{id}, valid', type: :request do
  it_behaves_like 'a simulation update test',
                  params: { simulation: { name: "My Sim", description: 'aaa' } },
                  expected_status: :no_content
end

