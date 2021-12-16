# frozen_string_literal: true

require './spec/support/helpers/media_helpers'
require 'google/cloud/storage'
require 'devise/jwt/test_helpers'

shared_examples 'a simulation build test', type: :request do |type:, expected_status:|

  let(:user) { create(:user) }
  let(:simulation) { create(:simulation, user: user, with_bodies: false) }
  let(:body) { create(type) }
  let(:planet) { create(:simulation_planet, simulation: simulation, with_moons: false) }
  let(:stub) { double('Google Cloud Storage', bucket: StubbedBucket.new) }
  let(:base) { "/api/v1/simulations/#{simulation.id}" }

  before(:each) do
    allow(Google::Cloud::Storage).to receive(:new).and_return(stub)
    endpoint = type == :moon ? "planets/#{planet.id}/moons" : type.to_s.pluralize
    post "#{base}/#{endpoint}/#{body.id}", headers:
      Devise::JWT::TestHelpers.auth_headers({ 'Accept': 'application/json' }, user), as: :json
  end

  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end

  it 'ID returned in response', if: expected_status == :created do
    expect(JSON.parse(response.body)).to have_key 'id'
  end

  it 'planet added to simulation', if: expected_status == :created && type == :planet do
    expect(simulation.simulation_planets.length).to eq(1)
  end

  it 'star added to simulation', if: expected_status == :created && type == :star do
    expect(simulation.star).not_to be(nil)
  end

  it 'asteroid belt added to simulation', if: expected_status == :created && type == :asteroid_belt do
    expect(simulation.simulation_asteroid_belts.length).to eq(1)
  end

  it 'moon added to simulation', if: expected_status == :created && type == :moon do
    expect(simulation.simulation_planets.length).to eq(1)
    planet = simulation.simulation_planets[0]
    expect(planet.simulation_moons.length).to eq(1)
  end
end

