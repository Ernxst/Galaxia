# frozen_string_literal: true

require './spec/support/helpers/media_helpers'
require 'google/cloud/storage'

shared_examples 'a texture fetch test', type: :request do |id:, expected_status:, expected_response: {}|
  before(:all) do
    Helpers::MediaHelpers.insert_textures(categories=[:texture])
  end
  before(:each) do
    stub = double('Google Cloud Storage', bucket: StubbedBucket.new)
    allow(Google::Cloud::Storage).to receive(:new).and_return(stub)
    get "/api/v1/media/textures/#{id}", params: {}
  end
  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end
  it 'expected response', unless: expected_status == :ok do
    expect(response.body).to eq(expected_response.to_json)
  end
  it 'texture returned has required attributes', if: expected_status == :ok do
    texture = JSON.parse(response.body)['texture']
    expect(texture).to have_key "public_url"
    expect(texture).to have_key "url"
    expect(texture).to have_key "api_url"
    expect(texture).to have_key "size"
    expect(texture).to have_key "id"
    expect(texture).to have_key "for"
  end
end

