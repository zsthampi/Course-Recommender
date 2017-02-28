require 'test_helper'

class CourseTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end

  def setup
    @course = Course.new(cid: "001", section: "f16", name:"testing", description:"DESC")
  end

  test "should be valid" do
    assert @user.valid?
  end

  test "name should be present" do
    @course.name = ""
    assert_not @user.valid?
  end

  test "course ID should be present" do
    @user.email = "     "
    assert_not @user.valid?
  end


end
