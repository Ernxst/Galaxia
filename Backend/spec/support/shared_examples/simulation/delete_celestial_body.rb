# frozen_string_literal: true

require './spec/support/helpers/media_helpers'
require 'google/cloud/storage'
require 'devise/jwt/test_helpers'

shared_examples 'a simulation celestial delete test', type: :request do |type:, expected_status:|

  let(:user) { create(:user) }
  let(:simulation) { create(:simulation, user: user, with_bodies: false) }
  let(:simulation_id) { simulation.id }
  let(:body) do
    case type
    when :star
      create(:star, simulations: [simulation])
    when :moon
      planet = create(:simulation_planet, with_moons: false, simulation: simulation)
      create(:simulation_moon, simulation_planet: planet)
    when :planet
      create(:simulation_planet, simulation: simulation, with_moons: false)
    when :asteroid_belt
      create(:simulation_asteroid_belt, simulation: simulation)
    end
  end
  let(:planet) { type == :moon ? body.simulation_planet : nil }
  let(:stub) { double('Google Cloud Storage', bucket: StubbedBucket.new) }
  let(:base) { "/api/v1/simulations/#{simulation.id}" }

  before(:each) do
    allow(Google::Cloud::Storage).to receive(:new).and_return(stub)
    endpoint = type == :moon ? "planets/#{planet.id}/moons" : type.to_s.pluralize
    delete "#{base}/#{endpoint}/#{body.id}", headers:
      Devise::JWT::TestHelpers.auth_headers({ 'Accept': 'application/json' }, user), as: :json
  end

  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end

  it 'simulation not deleted', if: expected_status == :no_content do
    expect(Simulation.find(simulation_id)).not_to be(nil)
  end

  it 'planet deleted from simulation', if: expected_status == :no_content && type == :planet do
    expect(simulation.simulation_planets.length).to eq(0)
  end

  it 'star dissociated from simulation', if: expected_status == :no_content && type == :star do
    expect(body.reload.simulations.length).to eq(0)
    expect(simulation.reload.star).to be(nil)
  end

  it 'asteroid belt deleted from simulation', if: expected_status == :no_content && type == :asteroid_belt do
    expect(simulation.simulation_asteroid_belts.length).to eq(0)
  end

  it 'moon deleted from simulation without deleting planet', if: expected_status == :no_content && type == :moon do
    expect(simulation.reload.simulation_planets.length).to eq(1)
    planet = simulation.reload.simulation_planets[0]
    expect(planet.reload.simulation_moons.length).to eq(0)
  end
end

