require 'devise/jwt/test_helpers'
module Helpers
  module UserHelpers
    def self.test_user
      @test_user ||= user
      @test_user
    end

    def self.auth_headers
      Devise::JWT::TestHelpers.auth_headers({ 'Accept': 'application/json' }, @test_user)
    end

    def self.username
      Faker::Internet.username(specifier: 3)
    end

    def self.valid_password(length = 8)
      Faker::Internet.password(min_length: length, max_length: 24, mix_case: true, special_characters: true)
    end

    def self.user(params = {})
      params = user_registration_params if params.empty?
      User.create(params[:user])
    end

    def self.user_registration_params(user = '')
      {
        user: {
          username: user.blank? ? username : user,
          password: 'P@55word'
        }
      }
    end
  end
end
