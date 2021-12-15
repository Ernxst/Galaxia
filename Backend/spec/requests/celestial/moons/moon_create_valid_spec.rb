# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/celestial/post_celestial_body'

attrs = FactoryBot.attributes_for(:moon).except(:texture, :atmosphere_texture, :bump_map, :specular_map)

describe 'POST /celestial/moons/', type: :request do
  it_behaves_like 'a celestial body post test',
                  params: { moon: attrs.merge({ texture_id: 1, bump_map_id: nil,
                                                  specular_map_id: nil, atmosphere_texture_id: nil }) },
                  type: 'moons',
                  expected_status: :created,
                  record: Space::Moon
end
