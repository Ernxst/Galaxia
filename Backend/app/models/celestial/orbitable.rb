module Celestial::Orbitable
  extend ActiveSupport::Concern
  included do
    validates :semi_major, presence: { message: -> (object, _) do
      "The #{object.model_name.human.downcase} must have a value for the semi major axis defined."
    end }, numericality: true

    validates :semi_minor, presence: { message: -> (object, _) do
      "The #{object.model_name.human.downcase} must have a value for the semi minor axis defined."
    end }, numericality: true

    validates :eccentricity, presence: { message: -> (object, _) do
      "The #{object.model_name.human.downcase} must have an orbital eccentricity defined."
    end }, numericality: true

    validates :inclination, presence: { message: -> (object, _) do
      "The #{object.model_name.human.downcase} must have a value for the orbital inclination defined."
    end }, numericality: true

    validates :orbital_period, presence: { message: -> (object, _) do
      "The #{object.model_name.human.downcase} must have a value for the orbital period defined."
    end }, numericality: true
  end
end
