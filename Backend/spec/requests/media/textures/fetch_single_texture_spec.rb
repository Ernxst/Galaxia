# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/media/texture_fetch'

describe 'GET /media/textures/{id}', type: :request do
  it_behaves_like 'a texture fetch test',
                  id: 1,
                  expected_status: :ok
end
