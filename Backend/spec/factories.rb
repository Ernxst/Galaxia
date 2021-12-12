FactoryBot.define do
  factory :celestial_body, class: 'celestial/base/celestial_body' do
    name { Faker::Space.planet }
    caption { Faker::Lorem.sentence(word_count: 2) }
    short_description { Faker::Lorem.sentence(word_count: 8) }
    description { Faker::Lorem.paragraphs(number: 2).join("\n") }

    mass { Faker::Number.number(digits: 24) }
    mean_velocity { Faker::Number.within(range: 4000..65000) }
    axial_tilt { Faker::Number.within(range: 0.0..Math::PI) }
    day_length do
      tidally_locked = Faker::Boolean.boolean(true_ratio: 0.33)
      tidally_locked ? 0 : Faker::Number.within(range: 0.0..1000000)
    end
  end

  factory :orbiting_body, parent: :celestial_body, class: 'celestial/base/orbitable' do
    semi_major { Faker::Number.within(range: 0.25..11) }
    eccentricity { Faker::Number.within(range: 0..0.96) }
    semi_minor { (1 - eccentricity ** 2.0) * semi_major }
    inclination { Faker::Number.within(range: 0..2 * Math::PI) }
    orbital_period { Faker::Number.within(range: 0.279..60182) }
  end

  factory :planet, parent: :orbiting_body, class: 'celestial/planet' do
    radius { Faker::Number.within(range: 2255..258670) }
    texture
    atmosphere_texture
    bump_map
    specular_map

  end

  factory :atmosphere_texture, class: 'media/atmosphere_texture' do
    name { Faker::Internet.username(specifier: 3) }
    sequence(:filename) { |n| "atmos-#{n}-#{Faker::File.file_name}" }
    original_url { Faker::Internet.url }
    width { Faker::Number.within(range: 480..8000) }
    height { Faker::Number.within(range: 240..400) }
  end

  factory :specular_map, class: 'media/specular_map' do
    name { Faker::Internet.username(specifier: 3) }
    sequence(:filename) { |n| "spec-#{n}-#{Faker::File.file_name}" }
    original_url { Faker::Internet.url }
    width { Faker::Number.within(range: 480..8000) }
    height { Faker::Number.within(range: 240..400) }
  end

  factory :bump_map, class: 'media/bump_map' do
    name { Faker::Internet.username(specifier: 3) }
    sequence(:filename) { |n| "bump-#{n}-#{Faker::File.file_name}" }
    original_url { Faker::Internet.url }
    width { Faker::Number.within(range: 480..8000) }
    height { Faker::Number.within(range: 240..400) }
  end

  factory :texture, class: 'media/texture' do
    name { Faker::Internet.username(specifier: 3) }
    sequence(:filename) { |n| "tex-#{n}-#{Faker::File.file_name}" }
    original_url { Faker::Internet.url }
    width { Faker::Number.within(range: 480..8000) }
    height { Faker::Number.within(range: 240..400) }
    add_attribute(:for) { [:any, :planets, :stars, :moons].sample }
  end

  factory :user do
    username { Faker::Internet.username(specifier: 3) }
    password { Faker::Internet.password(min_length: 3, max_length: 24, mix_case: true, special_characters: true) }
  end
end
