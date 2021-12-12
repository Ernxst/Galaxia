# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/celestial/post_celestial_body'

attrs = FactoryBot.attributes_for(:planet).except(:texture, :atmosphere_texture, :bump_map, :specular_map)

describe 'POST /celestial/planets/', type: :request do
  it_behaves_like 'a celestial body post test',
                  params: { planet: attrs.merge({ texture_id: 1, bump_map_id: nil,
                                                  specular_map_id: nil, atmosphere_texture_id: nil }) },
                  type: 'planets',
                  expected_status: :created,
                  record: Celestial::Planet
end
