# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/media/texture_fetch'

describe 'GET /media/textures/{id} unknown ID', type: :request do
  it_behaves_like 'a texture fetch test',
                  id: 5000,
                  expected_status: :not_found,
                  expected_response: { error: 'Could not find a texture with ID 5000.'}
end
