# frozen_string_literal: true

require_relative './../helpers/user_helpers'

test_username = 'ernest'

shared_examples 'an user login test', type: :request do |params:, expected_status:, expected_response:|
  before(:all) do
    reg_params = Helpers::UserHelpers.user_registration_params(test_username)
    Helpers::UserHelpers.user(reg_params)
    post '/api/v1/users/login', params: params
  end
  it 'expected response', unless: expected_status == :created do
    expect(response.body).to eq(expected_response.to_json)
  end
  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end
  it 'returns JWT Bearer token in header', if: expected_status == :created do
    expect(response.headers['Authorization']).to start_with('Bearer')
  end
  it 'returns JWT Bearer token in response', if: expected_status == :created do
    token = JSON.parse(response.body)['token']
    expect(token.present?).to be(true)
  end
  it 'can use returned JWT token in subsequent requests', if: expected_status == :created do
    next_headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json',
                     'Authorization': response.headers['Authorization'] }
    next_response = get '/api/v1/users/login', params: {}, headers: next_headers
    expect(next_response).to eq(200)
  end
end
