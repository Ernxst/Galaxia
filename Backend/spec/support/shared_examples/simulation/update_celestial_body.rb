# frozen_string_literal: true

require './spec/support/helpers/media_helpers'
require 'google/cloud/storage'
require 'devise/jwt/test_helpers'

shared_examples 'a simulation celestial update test', type: :request do |type:, params: {}, expected_status:|

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
  let(:original) { body }
  let(:planet) { type == :moon ? body.simulation_planet : nil }
  let(:stub) { double('Google Cloud Storage', bucket: StubbedBucket.new) }
  let(:base) { "/api/v1/simulations/#{simulation.id}" }

  before(:each) do
    allow(Google::Cloud::Storage).to receive(:new).and_return(stub)
    endpoint = type == :moon ? "planets/#{planet.id}/moons" : type.to_s.pluralize
    patch "#{base}/#{endpoint}/#{body.id}", params: params, headers:
      Devise::JWT::TestHelpers.auth_headers({ 'Accept': 'application/json' }, user), as: :json
  end

  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end

  it 'star updated', if: expected_status == :no_content && type == :star do
    data = body.reload
    params[type].each do |key, value|
      expect(data[key]).to eq(value)
    end
  end

  it 'planet updated', if: expected_status == :no_content && type == :planet do
    data = body.planet.reload
    params[type].each do |key, value|
      expect(data[key]).to eq(value)
    end
  end

  it 'moon updated', if: expected_status == :no_content && type == :moon do
    data = body.moon.reload
    params[type].each do |key, value|
      expect(data[key]).to eq(value)
    end
  end

  it 'asteroid belt updated', if: expected_status == :no_content && type == :asteroid_belt do
    data = body.asteroid_belt.reload
    params[type].each do |key, value|
      expect(data[key]).to eq(value)
    end
  end
end

