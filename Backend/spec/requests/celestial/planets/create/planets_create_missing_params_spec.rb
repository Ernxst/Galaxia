# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/celestial/post_celestial_body'

describe 'POST /celestial/planets/ missing params', type: :request do
  it_behaves_like 'a celestial body post test',
                  params: { planet: {} },
                  type: 'planets',
                  expected_status: :bad_request,
                  record: Celestial::Planet
end
