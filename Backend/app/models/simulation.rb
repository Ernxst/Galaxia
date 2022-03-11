# Includes both preset and user-created simulations
class Simulation < ApplicationRecord
  validates :name, presence: { message: "The simulation must have a name." },
            length: { in: 3..64,
                      too_short: "The simulation name must be at least %{count} characters long.",
                      too_long: "The simulation name cannot be more than %{count} characters long." }
  validates :description, allow_blank: true,
            length: { in: 0..4096, too_long: "The description is limited to %{count} characters only." }

  belongs_to :user, required: false
  belongs_to :star, class_name: 'Space::Star', required: false

  has_many :simulation_planets, class_name: 'Sim::SimulationPlanet', dependent: :destroy
  has_many :planets, class_name: 'Space::Planet', through: :simulation_planets

  has_many :simulation_moons, class_name: 'Sim::SimulationMoon', through: :simulation_planets
  has_many :moons, class_name: 'Space::Moon', through: :simulation_moons

  has_many :simulation_asteroid_belts, class_name: 'Sim::SimulationAsteroidBelt', dependent: :destroy
  has_many :asteroid_belts, class_name: 'Space::AsteroidBelt', through: :simulation_asteroid_belts

  has_many :likes
  has_many :comments

  scope :preset, -> { where(user_id: nil) }
  # Where the simulation has a star and is not made by a guest
  scope :user_created, -> { 
    where
    .not(user_id: nil)
    .joins(:user)
    .where.not(user: { username: ENV["guest_username"] })
    .where.not(user_id: 1)
    .where.not(star_id: nil)
    .left_joins(:likes)
    .group(:id)
    .order('COUNT(likes.id) DESC')
  }

  def editable?
    !user.nil?
  end
end
