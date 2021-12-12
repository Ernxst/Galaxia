# frozen_string_literal: true

require './spec/support/helpers/media_helpers'
require 'google/cloud/storage'
require 'devise/jwt/test_helpers'

before_count = 0

shared_examples 'a celestial body post test', type: :request do |type:, params: {},
  expected_status:, record: Celestial::Planet|
  before(:all) do
    Helpers::MediaHelpers.insert_textures
  end
  before(:each) do
    create(:user) do |user|
      headers = Devise::JWT::TestHelpers.auth_headers({ 'Accept': 'application/json' }, user)
      stub = double('Google Cloud Storage', bucket: StubbedBucket.new)
      allow(Google::Cloud::Storage).to receive(:new).and_return(stub)
      before_count = record.count
      post "/api/v1/celestial/#{type}", params: params, headers: headers, as: :json
    end
  end
  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end
  it 'celestial body not persisted', unless: expected_status == :created do
    expect(record.count).to eq(before_count)
  end
  it 'celestial body persisted', if: expected_status == :created do
    expect(record.count).not_to eq(before_count)
  end
  it 'ID returned in response', if: expected_status == :created do
    body = JSON.parse(response.body)
    expect(body).to have_key 'id'
  end
end

