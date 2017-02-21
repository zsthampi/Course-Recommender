require 'test_helper'

class GradedistsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @gradedist = gradedists(:one)
  end

  test "should get index" do
    get gradedists_url
    assert_response :success
  end

  test "should get new" do
    get new_gradedist_url
    assert_response :success
  end

  test "should create gradedist" do
    assert_difference('Gradedist.count') do
      post gradedists_url, params: { gradedist: { as: @gradedist.as, au: @gradedist.au, bs: @gradedist.bs, cid: @gradedist.cid, cs: @gradedist.cs, ds: @gradedist.ds, fs: @gradedist.fs, in: @gradedist.in, instructor: @gradedist.instructor, integer: @gradedist.integer, la: @gradedist.la, nr: @gradedist.nr, s: @gradedist.s, section: @gradedist.section, semester: @gradedist.semester, total: @gradedist.total, u: @gradedist.u, w: @gradedist.w } }
    end

    assert_redirected_to gradedist_url(Gradedist.last)
  end

  test "should show gradedist" do
    get gradedist_url(@gradedist)
    assert_response :success
  end

  test "should get edit" do
    get edit_gradedist_url(@gradedist)
    assert_response :success
  end

  test "should update gradedist" do
    patch gradedist_url(@gradedist), params: { gradedist: { as: @gradedist.as, au: @gradedist.au, bs: @gradedist.bs, cid: @gradedist.cid, cs: @gradedist.cs, ds: @gradedist.ds, fs: @gradedist.fs, in: @gradedist.in, instructor: @gradedist.instructor, integer: @gradedist.integer, la: @gradedist.la, nr: @gradedist.nr, s: @gradedist.s, section: @gradedist.section, semester: @gradedist.semester, total: @gradedist.total, u: @gradedist.u, w: @gradedist.w } }
    assert_redirected_to gradedist_url(@gradedist)
  end

  test "should destroy gradedist" do
    assert_difference('Gradedist.count', -1) do
      delete gradedist_url(@gradedist)
    end

    assert_redirected_to gradedists_url
  end
end
