# frozen_string_literal: true

require 'google/cloud/storage'
require './spec/support/helpers/media_helpers'

shared_examples 'a cloud storage test', type: :request do
  let(:stubbed_bucket) { StubbedBucket.new }
  let(:storage_stub) { double('Google Cloud Storage', bucket: :stubbed_bucket) }

  before(:each) do
    allow(stubbed_bucket).to receive(:file).and_throw(NoMethodError)
    allow(Google::Cloud::Storage).to receive(:new).and_return(storage_stub)
    get "/api/v1/media/textures/", params: {}
  end

  it 'correct status code' do
    expect(response).to have_http_status(:internal_server_error)
  end

  it 'expected response' do
    expected = { error: 'Could not access media storage. Please try again later.' }
    expect(response.body).to eq(expected.to_json)
  end

end

