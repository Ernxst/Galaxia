# frozen_string_literal: true

require 'devise/jwt/test_helpers'

shared_examples 'a jwt auth test', type: :request do |headers:, expected_status:, expected_response:, blank: false|
  before(:all) do
    get '/api/v1/users/login', headers: headers
  end
  it 'expected response', unless: blank do
    expect(response.body).to eq(expected_response.to_json)
  end
  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end
end
