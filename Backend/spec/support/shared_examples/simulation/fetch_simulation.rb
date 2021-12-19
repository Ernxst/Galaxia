# frozen_string_literal: true

require './spec/support/helpers/media_helpers'
require 'google/cloud/storage'
require 'devise/jwt/test_helpers'

shared_examples 'a simulation fetch test', type: :request do |id:, expected_status:, expected_response: {}|
  before(:each) do
    Helpers::MediaHelpers.insert_textures
    2.times do
      create(:simulation)
      create(:simulation, :user_created)
    end
    stub = double('Google Cloud Storage', bucket: StubbedBucket.new)
    allow(Google::Cloud::Storage).to receive(:new).and_return(stub)
    create(:user) do |user|
      headers = Devise::JWT::TestHelpers.auth_headers({ 'Accept': 'application/json' }, user)
      id = expected_status == :ok ? create(:simulation).id : id
      get "/api/v1/simulations/#{id}", headers: headers, as: :json
    end
  end

  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end

  it 'expected response', unless: expected_status == :ok do
    expect(response.body).to eq(expected_response.to_json)
  end

  it 'simulation returned', if: expected_status == :ok do
    simulation = JSON.parse(response.body)
    expect(simulation).to have_key "name"
    expect(simulation).to have_key "description"
    expect(simulation).to have_key "star"
    expect(simulation).to have_key "planets"
    expect(simulation).to have_key "asteroid_belts"
    expect(simulation).to have_key "preset"
  end
end

