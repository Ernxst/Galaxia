# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/media/textures'

describe 'GET /media/atmosphere_textures/all/moons', type: :request do
  it_behaves_like 'a texture group fetch test',
                  endpoint: 'all/moons',
                  type: 'atmosphere_textures'
end
