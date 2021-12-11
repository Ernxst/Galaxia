# frozen_string_literal: true

require './spec/support/helpers/media_helpers'
require 'google/cloud/storage'

shared_examples 'a texture group fetch test', type: :request do |endpoint:, type:|
  before(:all) do
    Helpers::MediaHelpers.insert_textures
  end
  before(:each) do
    stub = double('Google Cloud Storage', bucket: StubbedBucket.new)
    allow(Google::Cloud::Storage).to receive(:new).and_return(stub)
    get "/api/v1/media/#{type}/#{endpoint}", params: {}
  end
  it 'correct status code' do
    expect(response).to have_http_status(:ok)
  end
  it 'returns an array' do
    expect(JSON.parse(response.body)[type]).to be_an_instance_of(Array)
  end
  it 'array elements have required attributes' do
    JSON.parse(response.body)[type].each do |texture|
      expect(texture).to have_key "public_url"
      expect(texture).to have_key "url"
      expect(texture).to have_key "api_url"
      expect(texture).to have_key "size"
      expect(texture).to have_key "id"
      expect(texture).to have_key "for"
    end
  end
end

