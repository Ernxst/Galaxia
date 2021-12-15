module Celestial
  extend ActiveSupport::Concern
  included do
    validates :name, presence: { message: -> (object, _) do
      "The #{object.model_name.human.downcase} must have a name."
    end }, length: { in: 2..64, too_short: -> (object, _) do
      "The #{object.model_name.human.downcase} name must be at least %{count} characters long."
    end, too_long: ->(object, _) do
      "The #{object.model_name.human.downcase} name cannot be more than %{count} characters long."
    end }

    validates :caption, allow_blank: true,
              length: { in: 0..32, too_long: "The caption is limited to %{count} characters only." }

    validates :short_description, allow_blank: true,
              length: { in: 0..128, too_long: "The short description is limited to %{count} characters only." }

    validates :description, allow_blank: true,
              length: { in: 0..512, too_long: "The description is limited to %{count} characters only." }

    validates :mass, presence: { message: -> (object, _) do
      "The #{object.model_name.human.downcase} must have a mass defined."
    end }, numericality: true

    validates :mean_velocity, presence: { message: -> (object, _) do
      "The #{object.model_name.human.downcase} must have a mean velocity defined."
    end }, numericality: true

    validates :axial_tilt, presence: { message: -> (object, _) do
      "The #{object.model_name.human.downcase} must have a value for the axial tilt defined."
    end }, numericality: true

    validates :day_length, presence: { message: -> (object, _) do
      "The #{object.model_name.human.downcase} must have a day length defined."
    end }, numericality: true
  end
end
