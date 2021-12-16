# frozen_string_literal: true

require './spec/support/helpers/media_helpers'
require 'google/cloud/storage'
require 'devise/jwt/test_helpers'

shared_examples 'a simulation create test', type: :request do |params: {},
  expected_status: :created, expected_response: {}|
  before(:each) do
    stub = double('Google Cloud Storage', bucket: StubbedBucket.new)
    allow(Google::Cloud::Storage).to receive(:new).and_return(stub)
    create(:user) do |user|
      headers = Devise::JWT::TestHelpers.auth_headers({ 'Accept': 'application/json' }, user)
      @before_count = Simulation.all.length
      post "/api/v1/simulations/", params: params, headers: headers, as: :json
    end
  end

  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end

  it 'expected response', unless: expected_status == :created do
    expect(response.body).to eq(expected_response.to_json)
  end

  it 'simulation not persisted', unless: expected_status == :created do
    expect(Simulation.all.length).to eq(@before_count)
  end

  it 'simulation persisted', if: expected_status == :created do
    expect(Simulation.all.length).to eq(@before_count + 1)
  end

  it 'ID returned in response', if: expected_status == :created do
    body = JSON.parse(response.body)
    expect(body).to have_key 'id'
  end
end

