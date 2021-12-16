# frozen_string_literal: true

require './spec/support/helpers/media_helpers'
require 'google/cloud/storage'
require 'devise/jwt/test_helpers'

shared_examples 'a simulation update test', type: :request do |params: {},
  expected_status: :no_content, expected_response: {}|

  let(:user) { create(:user) }
  let(:simulation) { create(:simulation, user: user) }
  let(:original) { simulation.as_json }
  let(:stub) { double('Google Cloud Storage', bucket: StubbedBucket.new) }

  before(:each) do
    allow(Google::Cloud::Storage).to receive(:new).and_return(stub)
    patch "/api/v1/simulations/#{simulation.id}", params: params,
          headers: Devise::JWT::TestHelpers.auth_headers({ 'Accept': 'application/json' }, user),
          as: :json
  end

  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end

  it 'expected response', unless: expected_status == :no_content do
    expect(response.body).to eq(expected_response.to_json)
  end

  it 'simulation not updated', unless: expected_status == :no_content do
    expect(simulation.name).to eq(original["name"])
    expect(simulation.description).to eq(original["description"])
  end

  it 'simulation updated', if: expected_status == :no_content do
    sim_params = params[:simulation]
    expect(simulation.reload.name).to eq(sim_params[:name]) if sim_params[:name]
    expect(simulation.reload.description).to eq(sim_params[:description]) if sim_params[:description]
  end
end

