# frozen_string_literal: true

require './spec/support/helpers/media_helpers'
require 'google/cloud/storage'
require 'devise/jwt/test_helpers'

shared_examples 'a group of simulations fetch test', type: :request do |endpoint:, type:, expected_status:|
  let(:user) { create(:user) }
  let(:headers) { Devise::JWT::TestHelpers.auth_headers({ 'Accept': 'application/json' }, user) }
  let(:stub) { double('Google Cloud Storage', bucket: StubbedBucket.new) }

  before(:all) do
    create(:simulation, :user_created)
  end

  before(:each) do
    allow(Google::Cloud::Storage).to receive(:new).and_return(stub)
    type = endpoint == 'by' && expected_status == :ok ? user.id : type
    get "/api/v1/simulations/#{endpoint}/#{type}", headers: headers, as: :json
  end

  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end

  it 'simulations returned', if: expected_status == :ok do
    JSON.parse(response.body).each do |simulation|
      expect(simulation).to have_key "name"
      expect(simulation).to have_key "description"
      expect(simulation).to have_key "star"
      expect(simulation).to have_key "planets"
      expect(simulation).to have_key "asteroid_belts"
      expect(simulation).to have_key "by"
      expect(simulation).to have_key "preset"
    end
  end
end

