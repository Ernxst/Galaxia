# frozen_string_literal: true

require 'rails_helper'
require_relative './../../../support/shared_examples/user_login'

params = {
  user: {
    username: ENV['GUEST_USERNAME'],
    password: ''
  }
}

describe 'POST /users/login, guest login', type: :request do
  it_behaves_like 'an user login test',
                  params: params,
                  expected_status: :created,
                  expected_response: {}
end
