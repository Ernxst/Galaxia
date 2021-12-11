# frozen_string_literal: true

require 'rails_helper'
require './spec/support/shared_examples/media/cloud_failure'

describe 'GET /media/textures - failed to connect to cloud storage', type: :request do
  it_behaves_like 'a cloud storage test'
end

