require 'rails_helper'

RSpec.describe Celestial, :type => :model do
  context "when included in a class" do
    subject { Space::Planet.create(attributes_for(:planet)) }

    describe "Validations" do
      it "is valid with valid attributes" do
        expect(subject).to be_valid
      end

      it "is not valid without a name" do
        subject.name = nil
        subject.save
        expect(subject.errors[:name]).not_to be_empty
      end

      it "is not valid with a short name" do
        subject.name = "a"
        subject.save
        expect(subject.errors[:name]).not_to be_empty
      end

      it "is not valid with a long name" do
        subject.name = Faker::Lorem.paragraphs(number: 4)
        subject.save
        expect(subject.errors[:name]).not_to be_empty
      end

      it "is not valid with a long caption" do
        subject.caption = Faker::Lorem.paragraphs(number: 4)
        subject.save
        expect(subject.errors[:caption]).not_to be_empty
      end

      it "is not valid with a long short_description" do
        subject.short_description = Faker::Lorem.paragraphs(number: 4)
        subject.save
        expect(subject.errors[:short_description]).not_to be_empty
      end

      it "is not valid with a long description" do
        subject.description = Faker::Lorem.paragraphs(number: 10)
        subject.save
        expect(subject.errors[:description]).not_to be_empty
      end

      it "is not valid without a mass" do
        subject.mass = nil
        subject.save
        expect(subject.errors[:mass]).not_to be_empty
      end

      it "is not valid without a day_length" do
        subject.day_length = nil
        subject.save
        expect(subject.errors[:day_length]).not_to be_empty
      end

      it "is not valid without a axial_tilt" do
        subject.axial_tilt = nil
        subject.save
        expect(subject.errors[:axial_tilt]).not_to be_empty
      end

      it "is not valid without a mean_velocity" do
        subject.mean_velocity = nil
        subject.save
        expect(subject.errors[:mean_velocity]).not_to be_empty
      end
    end
  end
end
