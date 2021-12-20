class Media::Texture < ApplicationRecord
  self.table_name = 'textures'
  enum for: { any: 0, stars: 1, planets: 2, moons: 3 }

  validates :name, presence: true, length: { in: 2..64 }
  validates :filename, presence: true, allow_blank: false, uniqueness: true
  validates :width, presence: true, numericality: true
  validates :height, presence: true, numericality: true

  scope :star_textures, -> { where(for: :stars) }
  scope :planet_textures, -> { where(for: :planets) }
  scope :moon_textures, -> { where(for: :moons) }

  # TODO: For each texture, store a high and low quality version in the same row in the table

end
