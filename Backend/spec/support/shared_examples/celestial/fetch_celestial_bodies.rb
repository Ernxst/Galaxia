# frozen_string_literal: true

require './spec/support/helpers/media_helpers'
require 'google/cloud/storage'
require 'devise/jwt/test_helpers'

shared_examples 'a group of celestial bodies fetch test', type: :request do |type:, expected_status:, expected_response: {}|
  before(:all) do
    Helpers::MediaHelpers.insert_textures
  end
  before(:each) do
    create(:user) do |user|
      headers = Devise::JWT::TestHelpers.auth_headers({ 'Accept': 'application/json' }, user)
      stub = double('Google Cloud Storage', bucket: StubbedBucket.new)
      allow(Google::Cloud::Storage).to receive(:new).and_return(stub)
      get "/api/v1/celestial/#{type}", headers: headers, as: :json
    end
  end
  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end
  it 'expected response', unless: expected_status == :ok do
    expect(response.body).to eq(expected_response.to_json)
  end
  it 'celestial body returned', if: expected_status == :ok do
    JSON.parse(response.body)[type].each do |body|
      expect(body).to have_key "name"
      expect(body).to have_key "caption"
      expect(body).to have_key "description"
      expect(body).to have_key "short_description"
      expect(body).to have_key "mass"
      expect(body).to have_key "mean_velocity"
      expect(body).to have_key "axial_tilt"
      expect(body).to have_key "day_length"
    end
  end
end

