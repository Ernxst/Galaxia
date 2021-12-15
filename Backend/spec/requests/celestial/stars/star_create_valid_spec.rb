# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/celestial/post_celestial_body'

attrs = FactoryBot.attributes_for(:star).except(:texture, :atmosphere_texture)

describe 'POST /celestial/stars/', type: :request do
  it_behaves_like 'a celestial body post test',
                  params: { star: attrs.merge({ texture_id: 1, atmosphere_texture_id: nil }) },
                  type: 'stars',
                  expected_status: :created,
                  record: Space::Star
end

