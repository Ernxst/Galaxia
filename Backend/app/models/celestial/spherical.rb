module Celestial::Spherical
  extend ActiveSupport::Concern
  included do
    validates :radius, presence: { message: -> (object, _) do
      "The #{object.model_name.human.downcase} must have a radius defined."
    end }, numericality: true
  end
end
