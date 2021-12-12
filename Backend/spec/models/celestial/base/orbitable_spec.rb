require 'rails_helper'

RSpec.describe Celestial::Base::Orbitable, :type => :model do
  context "when included in a class" do
    subject { Celestial::Planet.create(attributes_for(:planet)) }

    describe "Validations" do
      it "is valid with valid attributes" do
        expect(subject).to be_valid
      end

      it "is not valid without a semi major" do
        subject.semi_major = nil
        subject.save
        expect(subject.errors[:semi_major]).not_to be_empty
      end
      it "is not valid without a semi minor" do
        subject.semi_minor = nil
        subject.save
        expect(subject.errors[:semi_minor]).not_to be_empty
      end
      it "is not valid without a eccentricity" do
        subject.eccentricity = nil
        subject.save
        expect(subject.errors[:eccentricity]).not_to be_empty
      end
      it "is not valid without a inclination" do
        subject.inclination = nil
        subject.save
        expect(subject.errors[:inclination]).not_to be_empty
      end
      it "is not valid without a orbital period" do
        subject.orbital_period = nil
        subject.save
        expect(subject.errors[:orbital_period]).not_to be_empty
      end
    end
  end
end
