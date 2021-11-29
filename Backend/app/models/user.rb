class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Denylist
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :trackable, :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  validates :username, presence: true, uniqueness: true
  validates :username, length: { minimum: 3, maximum: 50 }, allow_blank: true

  def email_required?
    false
  end

  def will_save_change_to_email?
    false
  end
end
