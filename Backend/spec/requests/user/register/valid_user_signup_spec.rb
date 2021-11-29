# frozen_string_literal: true

require 'rails_helper'
require_relative './../../../support/helpers/user_helpers'
require_relative './../../../support/shared_examples/user_register'

params = Helpers::UserHelpers.user_registration_params

describe 'POST /users/register, valid', type: :request do
  it_behaves_like 'a sign up test',
                  params: params,
                  expected_status: :created,
                  expected_response: {}
end
