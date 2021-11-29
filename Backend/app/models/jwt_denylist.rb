# frozen_string_literal: true

# Used as JWT token revocation strategy
class JwtDenylist < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Denylist

  self.table_name = 'jwt_denylists'
end
