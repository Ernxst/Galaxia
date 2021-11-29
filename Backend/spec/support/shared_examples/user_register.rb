# frozen_string_literal: true

shared_examples 'a sign up test', type: :request do |params:,
  expected_status:, expected_response:, taken: false|
  before(:all) do
    Helpers::UserHelpers.user(params) if taken
    post '/api/v1/users/register', params: params
  end

  it 'expected response', unless: expected_status == :created do
    expect(response.body).to eq(expected_response.to_json)
  end
  it 'correct status code' do
    expect(response).to have_http_status(expected_status)
  end
  it 'object not persisted', unless: expected_status == :created || taken do
    fetched_record = User.find_by_username(params[:user][:username])
    expect(fetched_record).to be(nil)
  end
  it 'object persisted', if: expected_status == :created do
    fetched_record = User.find_by_username(params[:user][:username])
    expect(fetched_record).not_to be(nil)
  end
  it 'returns JWT Bearer token in header', if: expected_status == :created do
    expect(response.headers['Authorization']).to start_with('Bearer')
  end
  it 'returns JWT Bearer token in response', if: expected_status == :created do
    expect(JSON.parse(response.body)).to have_key('token')
  end
  it 'can use returned JWT token in subsequent requests', if: expected_status == :created do
    next_headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json',
                     'Authorization': response.headers['Authorization'] }
    next_response = get '/api/v1/users/login', params: {}, headers: next_headers
    expect(next_response).to eq(200)
  end
end
