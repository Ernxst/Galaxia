# frozen_string_literal: true

require 'rails_helper'
require_relative './../../../support/shared_examples/user_login'

params = {
  user: {  username: 'ernest',
           password: 'P@55word' }
}

describe 'POST /users/login, valid', type: :request do
  it_behaves_like 'an user login test',
                  params: params,
                  expected_status: :created,
                  expected_response: {}
end
