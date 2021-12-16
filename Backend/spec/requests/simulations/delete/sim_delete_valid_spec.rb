# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/simulation/delete_simulation'

describe 'DELETE /simulations/{id}, valid', type: :request do
  it_behaves_like 'a simulation delete test',
                  preset: false,
                  owned: true,
                  expected_status: :no_content
end


