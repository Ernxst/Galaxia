# frozen_string_literal: true

require './spec/support/helpers/media_helpers'
require 'google/cloud/storage'
require 'devise/jwt/test_helpers'

shared_examples 'a simulation delete test', type: :request do |preset: false, owned: true,
  expected_status: :no_content, expected_response: {}|
  before(:each) do
    stub = double('Google Cloud Storage', bucket: StubbedBucket.new)
    allow(Google::Cloud::Storage).to receive(:new).and_return(stub)
    create(:user) do |user|
      headers = Devise::JWT::TestHelpers.auth_headers({ 'Accept': 'application/json' }, user)
      sim = preset ? create(:simulation) : create(:simulation, user: owned ? user : create(:user))
      @user = user
      @before_count = Simulation.all.length
      delete "/api/v1/simulations/#{sim.id}", headers: headers, as: :json
    end
  end

  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end

  it 'expected response', unless: expected_status == :no_content do
    expect(response.body).to eq(expected_response.to_json)
  end

  it 'simulation not destroyed', unless: expected_status == :no_content do
    expect(Simulation.all.length).to eq(@before_count)
  end

  it 'simulation deleted', if: expected_status == :no_content do
    expect(Simulation.all.length).to eq(@before_count - 1)
  end
end

