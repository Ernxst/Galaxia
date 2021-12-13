# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/celestial/post_celestial_body'


describe 'POST /celestial/asteroid_belts/', type: :request do
  it_behaves_like 'a celestial body post test',
                  params: { asteroid_belt: FactoryBot.attributes_for(:asteroid_belt) },
                  type: 'asteroid_belts',
                  expected_status: :created,
                  record: Celestial::AsteroidBelt
end

